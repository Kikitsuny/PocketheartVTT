import { useState } from 'react';
import './Rasgos.css';

export default function Rasgos({ lista = [], alCambiar }) {
  const [tabActiva, setTabActiva] = useState('clase'); // 'clase', 'ascendencia', 'comunidad'
  const [abierto, setAbierto] = useState(null);

  const itemsFiltrados = lista.filter((r) => r.categoria === tabActiva);

  const actualizarRasgo = (id, campo, valor) => {
    alCambiar(lista.map((r) => (r.id === id ? { ...r, [campo]: valor } : r)));
  };

  const agregarRasgo = () => {
    const nuevo = {
      id: crypto.randomUUID(),
      categoria: tabActiva,
      nombre: '',
      otros: '',
      texto: ''
    };
    alCambiar([...lista, nuevo]);
  };

  const eliminarRasgo = (id) => {
    if (window.confirm("¿Eliminar este rasgo permanentemente?")) {
      alCambiar(lista.filter((r) => r.id !== id));
    }
  };

  const handleBlur = (id, campo, e) => actualizarRasgo(id, campo, e.target.value);
  const handleKeyDown = (e) => { if (e.key === 'Enter') e.target.blur(); };
  const toggleSeccion = (id) => setAbierto(abierto === id ? null : id);

  const renderTabBtn = (id, label) => (
    <button
      className={`btn-tab-rasgo ${tabActiva === id ? 'activa' : ''}`}
      onClick={() => { setTabActiva(id); setAbierto(null); }}
      type="button"
    >
      {label}
    </button>
  );

  return (
    <div className="contenedor-rasgos">
      <div className="rasgos-tabs-header">
        {renderTabBtn('clase', 'CLASE')}
        {renderTabBtn('ascendencia', 'ASCENDENCIA')}
        {renderTabBtn('comunidad', 'COMUNIDAD')}
      </div>

      <div className="rasgos-lista-expandible">
        {itemsFiltrados.map((rasgo) => (
          <div className="rasgo-item-wrapper" key={rasgo.id}>
            <div 
              className={`rasgo-item-main ${abierto === rasgo.id ? 'activo' : ''}`}
              onClick={() => toggleSeccion(rasgo.id)}
            >
              <input
                className="input-rasgo-titulo"
                defaultValue={rasgo.nombre}
                onBlur={(e) => handleBlur(rasgo.id, 'nombre', e)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
                placeholder={`Nombre del rasgo...`}
                spellCheck="false"
              />
            </div>

            {abierto === rasgo.id && (
              <div className="rasgo-flotante">
                <div className="rasgo-flotante-header">
                  <span>Detalles del Rasgo</span>
                  <button onClick={() => setAbierto(null)}>✕</button>
                </div>
                
                <div className="rasgo-flotante-contenido">
                  <div className="rasgo-fila-caract">
                    <small className="label-rasgo-gris">DESCRIPCIÓN</small>
                    <textarea 
                      className="input-rasgo-base input-caract-valor"
                      defaultValue={rasgo.texto}
                      onBlur={(e) => handleBlur(rasgo.id, 'texto', e)}
                      placeholder="Describe los efectos mecánicos..."
                      rows="4"
                    />
                  </div>

                  <div className="rasgo-fila-caract">
                    <small className="label-rasgo-gris">EFECTO</small>
                    <textarea 
                      className="input-rasgo-base input-caract-valor"
                      defaultValue={rasgo.otros}
                      onBlur={(e) => handleBlur(rasgo.id, 'otros', e)}
                      placeholder="Anotaciones adicionales..."
                      rows="2"
                    />
                  </div>

                  <div className="rasgo-acciones-footer">
                    <button 
                      className="btn-rasgo-eliminar"
                      onClick={() => eliminarRasgo(rasgo.id)}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        <button className="btn-agregar-rasgo" onClick={agregarRasgo}>
          + Añadir Rasgo de {tabActiva.charAt(0).toUpperCase() + tabActiva.slice(1)}
        </button>
      </div>
    </div>
  );
}