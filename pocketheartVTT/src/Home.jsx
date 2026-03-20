import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { FaEye, FaEyeSlash } from 'react-icons/fa6';
import Popup from './components/Popup'; // <-- IMPORTAMOS EL POPUP UNIVERSAL
import './Home.css';

export default function Home() {
  const [nombreSala, setNombreSala] = useState('');
  const [pinSala, setPinSala] = useState('');
  const [salasRecientes, setSalasRecientes] = useState([]);
  const [mostrarPines, setMostrarPines] = useState(false);
  const navigate = useNavigate();

  // --- NUEVO: ESTADO PARA EL POPUP DE MENSAJES ---
  const [popupData, setPopupData] = useState(null); 

  useEffect(() => {
    const limpiarSalasViejas = async () => {
      const haceUnMes = new Date();
      haceUnMes.setDate(haceUnMes.getDate() - 30);
      const { data } = await supabase.from('partida').select('sala_id').lt('ultima_actividad', haceUnMes.toISOString());
      if (data && data.length > 0) {
        const salasInactivas = data.map(p => p.sala_id);
        await supabase.from('personajes').delete().in('sala_id', salasInactivas);
        await supabase.from('partida').delete().in('sala_id', salasInactivas);
      }
    };
    limpiarSalasViejas();

    const cargarHistorial = () => {
      const historialGuardado = localStorage.getItem('pocketheart_salas');
      if (historialGuardado) setSalasRecientes(JSON.parse(historialGuardado));
    };
    cargarHistorial();
  }, []);

  const entrarASala = (e) => {
    e.preventDefault();
    if (nombreSala.trim() === '') return;

    const salaFormateada = nombreSala.trim().toLowerCase().replace(/\s+/g, '-');
    let pinFinal = pinSala.trim();

    if (pinFinal === '') {
      pinFinal = Math.floor(1000 + Math.random() * 9000).toString();
    } else if (!/^\d{4}$/.test(pinFinal)) {
      // Reemplazamos el alert() nativo por nuestro Popup
      setPopupData({
        titulo: "Identificador Inválido",
        mensaje: "El PIN debe ser de exactamente 4 números (ej. 1234). Puedes dejarlo en blanco para que generemos uno automáticamente."
      });
      return;
    }

    navigate(`/sala/${salaFormateada}-${pinFinal}`);
  };

  const quitarDelHistorial = (e, idSala) => {
    e.stopPropagation();
    const nuevoHistorial = salasRecientes.filter(s => s.id !== idSala);
    setSalasRecientes(nuevoHistorial);
    localStorage.setItem('pocketheart_salas', JSON.stringify(nuevoHistorial));
  };

  return (
    <div className="home-container">
      
      {/* --- RENDERIZADO DEL POPUP --- */}
      <Popup
        isOpen={popupData !== null}
        onClose={() => setPopupData(null)}
        onConfirm={() => setPopupData(null)} // Ambos botones simplemente lo cierran
        titulo={popupData?.titulo}
        mensaje={popupData?.mensaje}
        tipo="confirmacion"
        textoConfirmar="Entendido"
        textoCancelar="Cerrar"
      />

      <div className="home-card">
        <h1>Pocketheart VTT</h1>
        <p>Una mesa virtual ligera para jugar Daggerheart.</p>
        
        <form onSubmit={entrarASala} className="form-sala">
          <div className="inputs-sala-grupo">
            <input 
              type="text" 
              placeholder="Nombre de sala..." 
              value={nombreSala}
              onChange={(e) => setNombreSala(e.target.value)}
              className="input-home input-nombre-sala"
            />
            <div className="input-pin-wrapper">
              <span className="prefijo-pin">#</span>
              <input 
                type="text" 
                placeholder="PIN" 
                value={pinSala}
                onChange={(e) => setPinSala(e.target.value)}
                className="input-home input-pin-sala"
                maxLength="4"
              />
            </div>
          </div>
          <small className="hint-home">Deja el PIN en blanco para generar uno nuevo.</small>

          <button type="submit" className="btn-home">Crear / Entrar a la Sala</button>
        </form>

        {salasRecientes.length > 0 && (
          <div className="salas-recientes-container">
           <div className="header-recientes">
              <h3 className="titulo-recientes">Tus Salas Recientes</h3>
              <button 
                className="btn-toggle-pines"
                onClick={() => setMostrarPines(!mostrarPines)}
                title={mostrarPines ? "Ocultar identificadores" : "Mostrar identificadores"}
                type="button"
              >
                {mostrarPines ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            
          <div className="lista-recientes">
              {salasRecientes.map((sala) => {
                const tienePin = sala.pin && sala.pin !== "";
                return (
                  <div key={sala.id} className="item-reciente">
                    <button 
                      className="btn-sala-reciente"
                      onClick={() => navigate(`/sala/${sala.id}`)}
                    >
                      <span className="nombre-reciente">{sala.nombre}</span>
                      
                      {tienePin && (
                        <span className="pin-reciente">
                          {mostrarPines ? `#${sala.pin}` : '#****'}
                        </span>
                      )}
                      
                    </button>
                    <button 
                      className="btn-quitar-reciente" 
                      onClick={(e) => quitarDelHistorial(e, sala.id)}
                      title="Ocultar del historial"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <button 
          className="btn-changelog" 
          onClick={() => setPopupData({
            titulo: "Registro de Cambios",
            mensaje: "Próximamente estaremos añadiendo el historial de versiones con las nuevas mecánicas de la mesa."
          })}
        >
          Ver Registro de Cambios
        </button>
      </div>
    </div>
  );
}