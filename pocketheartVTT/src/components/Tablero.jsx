import './Tablero.css';
import Ficha from './Ficha';
import FearTracker from './Partida/FearTracker'; // <-- RUTA ACTUALIZADA

export default function Tablero({ personajesVisibles = [], alQuitar, nombreSala }) {
  return (
    <main className="tablero-main">
      <h1 className="titulo-tablero">Tablero de {nombreSala}</h1>
      
      {/* SE DIBUJA A LA DERECHA DESDE LA NUEVA CARPETA */}
      <FearTracker /> 
      
      {personajesVisibles.length === 0 ? (
        <div className="tablero-vacio">
          <p>No hay aventureros en el campo de batalla.</p>
          <span>Abre la Bóveda para desplegar personajes.</span>
        </div>
      ) : (
        <div className="tablero-grid">
          {personajesVisibles.map((p) => (
            <Ficha 
              alCerrar={alQuitar} 
              key={p.id} 
              personaje={p} 
            />
          ))}
        </div>
      )}
    </main>
  );
}