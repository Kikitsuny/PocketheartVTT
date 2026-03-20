import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Sidebar from './components/Sidebar';
import Tablero from './components/Tablero';
import Popup from './components/Popup'; // <-- IMPORTAMOS EL NUEVO COMPONENTE
import './Sala.css';

export default function Sala() {
  const { idSala } = useParams();
  const navigate = useNavigate();

  // --- 1. PARSEO DE URL Y NOMBRES ---
  const match = idSala.match(/(.+)-(\d{4})$/);
  const nombreBase = match ? match[1] : idSala;
  const pinBase = match ? match[2] : "";

  const nombreSalaLegible = nombreBase
    .split('-')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');

  const tituloCompleto = pinBase ? `${nombreSalaLegible} #${pinBase}` : nombreSalaLegible;

  // --- 2. ESTADOS LOCALES PRINCIPALES ---
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [personajesEnPantalla, setPersonajesEnPantalla] = useState([]);
  const [todosLosPersonajes, setTodosLosPersonajes] = useState([]);

  // --- NUEVO: GESTOR DE POPUPS UNIVERSAL ---
  const [popupVisible, setPopupVisible] = useState(null); // 'crear', 'borrar', 'exportar', 'importar', 'destruir', 'mensaje'
  const [popupData, setPopupData] = useState(null); // Guarda info temporal (ej. id a borrar, archivo a cargar)

  // --- 3. EFECTOS DE INICIALIZACIÓN ---
  useEffect(() => {
    getPersonajes();

    const registrarActividad = async () => {
      await supabase.from('partida').update({ ultima_actividad: new Date().toISOString() }).eq('sala_id', idSala);
    };
    registrarActividad();

    const guardarHistorialLocal = () => {
      try {
        const historialGuardado = localStorage.getItem('pocketheart_salas');
        let historial = historialGuardado ? JSON.parse(historialGuardado) : [];
        historial = historial.filter(s => s.id !== idSala);
        historial.unshift({ id: idSala, nombre: nombreSalaLegible, pin: pinBase });
        if (historial.length > 5) historial.pop();
        localStorage.setItem('pocketheart_salas', JSON.stringify(historial));
      } catch (error) {
        console.error("Error guardando historial local:", error);
      }
    };
    guardarHistorialLocal();

    const advertirCierre = (e) => {
      e.preventDefault();
      e.returnValue = "Asegurate de guardar tu partida antes de salir";
      return "Asegurate de guardar tu partida antes de salir";
    };
    window.addEventListener('beforeunload', advertirCierre);

    return () => window.removeEventListener('beforeunload', advertirCierre);
  }, [idSala]);

  // --- 4. SUSCRIPCIÓN MULTIJUGADOR (TIEMPO REAL) ---
  useEffect(() => {
    const canal = supabase
      .channel(`cambios-vtt-${idSala}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'personajes', filter: `sala_id=eq.${idSala}` },
        (payload) => {
          if (!payload) return;
          if (payload.eventType === 'UPDATE' && payload.new) {
            setTodosLosPersonajes(prev => prev.map(p => (p.id === payload.new.id ? payload.new : p)));
            setPersonajesEnPantalla(prev => prev.map(p => (p.id === payload.new.id ? payload.new : p)));
          } else if (payload.eventType === 'DELETE' && payload.old) {
            setTodosLosPersonajes(prev => prev.filter(p => p.id !== payload.old.id));
            setPersonajesEnPantalla(prev => prev.filter(p => p.id !== payload.old.id));
          } else if (payload.eventType === 'INSERT' && payload.new) {
            setTodosLosPersonajes(prev => {
              if (prev.find(p => p.id === payload.new.id)) return prev;
              return [...prev, payload.new].sort((a, b) => a.nombre.localeCompare(b.nombre));
            });
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(canal);
  }, [idSala]);

  // --- 5. LÓGICA DE BASE DE DATOS (PERSONAJES) ---
  async function getPersonajes() {
    const { data } = await supabase.from('personajes').select('*').eq('sala_id', idSala).order('nombre');
    if (data) setTodosLosPersonajes(data);
  }

  const desplegar = (p) => {
    if (!personajesEnPantalla.find(i => i.id === p.id)) {
      setPersonajesEnPantalla([...personajesEnPantalla, p]);
    }
  };

  // --- 6. FUNCIONES ENLAZADAS AL POPUP ---

  // -> CREAR
  const solicitarCrear = () => setPopupVisible('crear');
  const ejecutarCrear = async (nombre) => {
    setPopupVisible(null);
    const { data } = await supabase.from('personajes').insert([{ clase: 'Sin Clase', nombre, vida: 0, sala_id: idSala }]).select();
    if (data) {
      setTodosLosPersonajes(prev => {
        if (prev.find(p => p.id === data[0].id)) return prev;
        return [...prev, data[0]].sort((a, b) => a.nombre.localeCompare(b.nombre));
      });
    }
  };

  // -> BORRAR PERSONAJE
  const solicitarBorrar = (e, id, nombre) => {
    e.stopPropagation();
    setPopupData({ id, nombre });
    setPopupVisible('borrar');
  };
  const ejecutarBorrar = async () => {
    const { id } = popupData;
    setPopupVisible(null);
    await supabase.from('personajes').delete().eq('id', id);
  };

  // -> EXPORTAR
  const solicitarExportar = () => setPopupVisible('exportar');
  const ejecutarExportar = async () => {
    setPopupVisible(null);
    const { data: partidaData } = await supabase.from('partida').select('fear').eq('sala_id', idSala).single();
    const datosGuardados = {
      sala: idSala,
      fear: partidaData ? partidaData.fear : 0,
      personajes: todosLosPersonajes
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(datosGuardados, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `pocketheart_${idSala}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // -> IMPORTAR
  const solicitarImportar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPopupData({ file });
    setPopupVisible('importar');
    e.target.value = null; // Reseteamos el input para poder volver a elegir el mismo archivo si es necesario
  };
  const ejecutarImportar = async () => {
    const { file } = popupData;
    setPopupVisible(null);

    const reader = new FileReader();
    reader.onload = async (evento) => {
      try {
        const data = JSON.parse(evento.target.result);
        if (!data.personajes) throw new Error("Archivo inválido");

        if (data.fear !== undefined) {
          await supabase.from('partida').update({ fear: data.fear }).eq('sala_id', idSala);
        }
        await supabase.from('personajes').delete().eq('sala_id', idSala);
        
        const personajesNuevos = data.personajes.map(p => {
          const { id, ...resto } = p; 
          return { ...resto, sala_id: idSala }; 
        });

        if (personajesNuevos.length > 0) {
          await supabase.from('personajes').insert(personajesNuevos);
        }
        
        // Popup de éxito
        setPopupData({ titulo: "¡Restauración Exitosa!", mensaje: "Los datos de la sala han sido cargados." });
        setPopupVisible('mensaje');
        
      } catch (err) {
        console.error(err);
        setPopupData({ titulo: "Error de Lectura", mensaje: "No se pudo leer el archivo. Asegúrate de que sea un guardado válido de Pocketheart." });
        setPopupVisible('mensaje');
      }
    };
    reader.readAsText(file);
  };

  // -> DESTRUIR SALA
  const solicitarDestruir = () => setPopupVisible('destruir');
  const ejecutarDestruir = async () => {
    setPopupVisible(null);
    await ejecutarExportar(); // Guarda antes de borrar
    await supabase.from('personajes').delete().eq('sala_id', idSala);
    await supabase.from('partida').delete().eq('sala_id', idSala); 
    navigate('/');
  };

  // --- 7. RENDERIZADO DEL VTT ---
  return (
    <div className="app-container">

      {/* --- COLECCIÓN DE POPUPS DINÁMICOS --- */}
      <Popup
        isOpen={popupVisible === 'crear'}
        onClose={() => setPopupVisible(null)}
        onConfirm={ejecutarCrear}
        titulo="Nuevo Personaje"
        mensaje="Ingresa el nombre del aventurero:"
        tipo="input"
        placeholder="Ej. Austin"
        textoConfirmar="Añadir"
      />

      <Popup
        isOpen={popupVisible === 'borrar'}
        onClose={() => setPopupVisible(null)}
        onConfirm={ejecutarBorrar}
        titulo="Borrar Personaje"
        mensaje={`¿Eliminar a ${popupData?.nombre} permanentemente de la nube?`}
        tipo="confirmacion"
        esPeligro={true}
        textoConfirmar="Eliminar"
      />

      <Popup
        isOpen={popupVisible === 'exportar'}
        onClose={() => setPopupVisible(null)}
        onConfirm={ejecutarExportar}
        titulo="Guardar Partida"
        mensaje="Se descargará un archivo con todos los personajes y datos de la sala a tu dispositivo."
        tipo="confirmacion"
        textoConfirmar="Descargar"
      />

      <Popup
        isOpen={popupVisible === 'importar'}
        onClose={() => setPopupVisible(null)}
        onConfirm={ejecutarImportar}
        titulo="Cargar Partida"
        mensaje="¿Sobrescribir esta sala con los datos del archivo? Se perderán los personajes actuales."
        tipo="confirmacion"
        esPeligro={true}
        textoConfirmar="Sobrescribir"
      />

      <Popup
        isOpen={popupVisible === 'destruir'}
        onClose={() => setPopupVisible(null)}
        onConfirm={ejecutarDestruir}
        titulo="🚨 PELIGRO DE DESTRUCCIÓN 🚨"
        mensaje={
          <>
            Estás a punto de borrar esta sala de la nube. Se descargará una copia automáticamente.
            <br/><br/>
            Para confirmar, escribe exactamente: <strong style={{color: 'var(--color-primario)'}}>{tituloCompleto}</strong>
          </>
        }
        tipo="estricto"
        valorEsperado={tituloCompleto}
        placeholder={tituloCompleto}
        esPeligro={true}
        textoConfirmar="Destruir Sala"
      />

      <Popup
        isOpen={popupVisible === 'mensaje'}
        onClose={() => setPopupVisible(null)}
        onConfirm={() => setPopupVisible(null)}
        titulo={popupData?.titulo}
        mensaje={popupData?.mensaje}
        tipo="confirmacion"
        textoConfirmar="Entendido"
        textoCancelar="Cerrar"
      />
      {/* ------------------------------------- */}

      {/* Menú Lateral y Bóveda */}
      <Sidebar
        abierto={menuAbierto}
        setAbierto={setMenuAbierto}
        personajes={todosLosPersonajes}
        alCrear={solicitarCrear}
        alBorrar={solicitarBorrar}
        alDesplegar={desplegar}
        nombreSala={tituloCompleto}
        alExportar={solicitarExportar}     
        alImportar={solicitarImportar}    
        alLimpiar={solicitarDestruir} 
      />
      
      {/* Área de Juego */}
      <Tablero 
        personajesVisibles={personajesEnPantalla} 
        alQuitar={(id) => setPersonajesEnPantalla(prev => prev.filter(p => p.id !== id))} 
        nombreSala={tituloCompleto}
      />
    </div>
  );
}