import './Sidebar.css';
import { FaFileExport, FaFileImport, FaTrashCan, FaHouse } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

export default function Sidebar({ 
  abierto, 
  setAbierto, 
  personajes, 
  alCrear, 
  alBorrar, 
  alDesplegar,
  nombreSala,
  alExportar,
  alImportar,
  alLimpiar
}) {
  const navigate = useNavigate();

  return (
    <>
      {/* Botón de Menú (Bóveda) */}
      <button 
        className={`btn-toggle-menu ${abierto ? 'abierto' : ''}`} 
        onClick={() => setAbierto(!abierto)}
        title="Bóveda de Personajes"
      >
        {abierto ? '✕' : '☰'}
      </button>

      {/* Botón de Home */}
      <button 
        className={`btn-home-nav ${abierto ? 'menu-abierto' : ''}`} 
        onClick={() => navigate('/')}
        title="Volver al Inicio"
      >
        <FaHouse size={24} />
      </button>

      {/* Menú Lateral */}
      <aside className={`sidebar ${abierto ? 'visible' : ''}`}>
        <h2>Bóveda de {nombreSala}</h2>
        
        <button className="btn-add" onClick={alCrear}>+ Nuevo Personaje</button>

        <div className="lista-reserva">
          {personajes.map((p) => (
            <div className="item-fila-boveda" key={p.id}>
              <div className="btn-nombre-personaje" onClick={() => alDesplegar(p)}>
                <span className="nombre-txt">{p.nombre}</span>
                <span className="clase-txt">{p.clase}</span>
              </div>
              
              <button 
                className="btn-delete-perm" 
                onClick={(e) => alBorrar(e, p.id, p.nombre)}
                title="Borrar personaje"
              >
                x
              </button>
            </div>
          ))}
        </div>

        {/* Controles de Sala */}
        <div className="sidebar-controles-sala">
          <hr className="separador-sidebar" />
          
          <button className="btn-sidebar btn-exportar" onClick={alExportar} title="Recomendamos guardar la partida con regularidad.">
            <FaFileExport style={{ marginRight: '8px', fontSize: '1.1em' }} /> 
            Guardar (Exportar)
          </button>
          
          <label className="btn-sidebar btn-importar">
            <FaFileImport style={{ marginRight: '8px', fontSize: '1.1em' }} /> 
            Cargar (Importar)
            <input 
              type="file" 
              accept=".json" 
              onChange={alImportar} 
              style={{ display: 'none' }} 
            />
          </label>
          
          <button className="btn-sidebar btn-limpiar" onClick={alLimpiar} title="Destruir sala y volver al inicio.">
            <FaTrashCan style={{ marginRight: '8px', fontSize: '1.1em' }} /> 
            Finalizar Sala
          </button>
        </div>
      </aside>
    </>
  );
}