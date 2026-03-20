import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Ficha.css';

import Cabecera from './Cabecera';
import Estadisticas from './Estadisticas';
import RecursosDefensas from './RecursosDefensas'; 
import Experiencias from './Experiencias';
import Armas from './Armas';
import CartasDeDominio from './CartasDeDominio';
import Inventario from './Inventario';
import Rasgos from './Rasgos';

export default function Ficha({ personaje, alCerrar }) {
  // Estado que contiene toda la info del personaje actualizada en tiempo real
  const [personajeLocal, setPersonajeLocal] = useState(personaje);
  const [dinero, setDinero] = useState(personaje.dinero || { punados: 0, bolsas: 0, cofres: 0 });
  const [listaInventario, setListaInventario] = useState(personaje.inventario || []);
  const [notasInventario, setNotasInventario] = useState(personaje.notas_inventario || '');



  
  const [stats, setStats] = useState({
    vida: personaje.vida || 5,
    estres: personaje.estres || 0,
    hope: personaje.hope || 2,
    armadura: personaje.armadura || 1
  });

  const [maximos, setMaximos] = useState({
    vida: personaje.vida_max || 6,
    estres: personaje.estres_max || 6,
    hope: personaje.hope_max || 6,
    armadura: personaje.armadura_max || 6
  });

  const [listaExperiencias, setListaExperiencias] = useState(personaje.experiencias || []);
  const [listaCartasDominio, setListaCartasDominio] = useState(personaje.cartas_dominio || []); // NUEVO
  const [listaRasgos, setListaRasgos] = useState(personaje.rasgos || []); // <--- NUEVO
  const [equipamiento, setEquipamiento] = useState(personaje.equipamiento || { principal: {}, secundaria: {}, armadura: {} });

  useEffect(() => {
    const channel = supabase
      .channel(`cambios-personaje-${personaje.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'personajes',
          filter: `id=eq.${personaje.id}`,
        },
        (payload) => {
          const nuevoP = payload.new;
          setPersonajeLocal(nuevoP);
          setStats({
            vida: nuevoP.vida || 5,
            estres: nuevoP.estres || 0,
            hope: nuevoP.hope || 2,
            armadura: nuevoP.armadura || 1
          });
          setMaximos({
            vida: nuevoP.vida_max || 6,
            estres: nuevoP.estres_max || 6,
            hope: nuevoP.hope_max || 6,
            armadura: nuevoP.armadura_max || 6
          });
          setListaExperiencias(nuevoP.experiencias || []);
          setListaExperiencias(nuevoP.experiencias || []);

          setListaCartasDominio(nuevoP.cartas_dominio || []); // NUEVO

          setListaRasgos(nuevoP.rasgos || []);

          setEquipamiento(nuevoP.equipamiento || { principal: {}, secundaria: {}, armadura: {} });

          setDinero(nuevoP.dinero || { punados: 0, bolsas: 0, cofres: 0 });
          setListaInventario(nuevoP.inventario || []);
          setNotasInventario(nuevoP.notas_inventario || '');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [personaje.id]);


  const actualizarCampo = async (columna, nuevoValor) => {
    const { error } = await supabase
      .from('personajes')
      .update({ [columna]: nuevoValor })
      .eq('id', personaje.id);
    if (error) console.error("Error actualizando campo:", error);
  };

  const togglePip = async (recurso, valor) => {
    const nuevoValor = stats[recurso] === valor ? valor - 1 : valor;
    setStats({ ...stats, [recurso]: nuevoValor });
    await supabase.from('personajes').update({ [recurso]: nuevoValor }).eq('id', personaje.id);
  };

  const modificarMaximo = async (recurso, delta) => {
    const nuevoMax = Math.max(1, (maximos[recurso] || 6) + delta);
    setMaximos({ ...maximos, [recurso]: nuevoMax });
    const colName = `${recurso}_max`;
    await supabase.from('personajes').update({ [colName]: nuevoMax }).eq('id', personaje.id);
  };

  const guardarExperiencias = async (nuevaLista) => {
    setListaExperiencias(nuevaLista);
    await supabase.from('personajes').update({ experiencias: nuevaLista }).eq('id', personaje.id);
  };
 const guardarCartasDominio = async (nuevaLista) => {
    setListaCartasDominio(nuevaLista);
    await supabase.from('personajes').update({ cartas_dominio: nuevaLista }).eq('id', personaje.id);
  };

const guardarRasgos = async (nuevaLista) => {
  setListaRasgos(nuevaLista);
  await supabase.from('personajes').update({ rasgos: nuevaLista }).eq('id', personaje.id);
};

const guardarDinero = async (nuevoDinero) => {
    setDinero(nuevoDinero);
    await supabase.from('personajes').update({ dinero: nuevoDinero }).eq('id', personaje.id);
  };

  const guardarInventario = async (nuevaLista) => {
    setListaInventario(nuevaLista);
    await supabase.from('personajes').update({ inventario: nuevaLista }).eq('id', personaje.id);
  };

  const guardarNotasInventario = async (nuevasNotas) => {
    setNotasInventario(nuevasNotas);
    await supabase.from('personajes').update({ notas_inventario: nuevasNotas }).eq('id', personaje.id);
  };

const guardarEquipamiento = async (nuevoEq) => {
    setEquipamiento(nuevoEq);
    await supabase.from('personajes').update({ equipamiento: nuevoEq }).eq('id', personaje.id);
  };

  const versionFicha = JSON.stringify(personajeLocal);

  return (
    <div className="dh-character-sheet">
      <button className="dh-btn-close" onClick={() => alCerrar(personaje.id)} title="Quitar del tablero"> ✕</button>
      
      <Cabecera key={`cab-${versionFicha}`} personaje={personajeLocal} alActualizar={actualizarCampo} />
     <div className="subrayado-nombre"></div>
      
      <Estadisticas key={`stats-${versionFicha}`} personaje={personajeLocal} alActualizar={actualizarCampo} />

      <div className="dh-main-columns">
        <div className="dh-col">
          <section className="dh-block">
            <div className="block-header">RECURSOS BÁSICOS</div>
            <RecursosDefensas 
              stats={stats} 
              maximos={maximos} 
              onTogglePip={togglePip} 
              onChangeMax={modificarMaximo}
              soloRecursos={true} 
              personaje={personajeLocal}     
              alActualizar={actualizarCampo}
            />
          </section>

        <section className="dh-block">
           <div className="block-header">ARMAS Y ARMADURA ACTIVAS</div>
           <Armas 
              competencia={personajeLocal.competencia}
              alActualizarCompetencia={actualizarCampo}
              equipamiento={equipamiento} 
              alCambiarEquipamiento={guardarEquipamiento} 
          />
         </section>
          <section className="dh-block">
            <div className="block-header">INVENTARIO</div>
            <Inventario 
              dinero={dinero}
              inventario={listaInventario}
              notas={notasInventario}
              alCambiarDinero={guardarDinero}
              alCambiarInventario={guardarInventario}
              alCambiarNotas={guardarNotasInventario}
            />
          </section>



        </div>

        <div className="dh-col">
          <section className="dh-block">
            <div className="block-header">DEFENSAS</div>
            <RecursosDefensas 
              stats={stats} 
              maximos={maximos} 
              onTogglePip={togglePip} 
              onChangeMax={modificarMaximo}
              soloArmadura={true} 
              personaje={personajeLocal}
              alActualizar={actualizarCampo}
            />
          </section>

          <Experiencias lista={listaExperiencias} alCambiar={guardarExperiencias} />
          <section className="dh-block">
            <div className="block-header">CARTAS DE DOMINIO</div>
            <CartasDeDominio lista={listaCartasDominio} alCambiar={guardarCartasDominio} />
          </section>  

          <section className="dh-block">
            <div className="block-header">RASGOS</div>
            <Rasgos lista={listaRasgos} alCambiar={guardarRasgos} />
          </section>

        </div>
      </div>
    </div>
  );
}