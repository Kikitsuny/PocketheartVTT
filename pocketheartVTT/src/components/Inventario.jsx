import { useState } from 'react';
import './Inventario.css';

export default function Inventario({ 
  dinero, 
  inventario, 
  notas, 
  alCambiarDinero, 
  alCambiarInventario, 
  alCambiarNotas 
}) {
  const [abierto, setAbierto] = useState(null);

  const agregarItem = () => {
    const nuevoItem = {
      id: crypto.randomUUID(),
      detalles: '',
      nombre: ''
    };
    alCambiarInventario([...inventario, nuevoItem]);
  };

  const eliminarItem = (id) => {
    if (window.confirm("¿Eliminar este objeto del inventario?")) {
      alCambiarInventario(inventario.filter((i) => i.id !== id));
    }
  };

  const handleBlurDinero = (campo, e) => {
    const nuevoValor = parseInt(e.target.value) || 0;
    alCambiarDinero({ ...dinero, [campo]: nuevoValor });
  };

  const handleBlurItem = (id, campo, e) => {
    const nuevaLista = inventario.map((i) =>
      i.id === id ? { ...i, [campo]: e.target.value } : i
    );
    alCambiarInventario(nuevaLista);
  };

  const handleBlurNotas = (e) => {
    alCambiarNotas(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur();
  };

  const toggleSeccion = (id) => {
    setAbierto(abierto === id ? null : id);
  };

  return (
    <div className="contenedor-inventario">
      
      {/* SECCIÓN DE DINERO */}
      <div className="dinero-contenedor">
        <div className="dinero-grupo">
          <label className="label-dinero">PUÑADOS</label>
          <input 
          key={`pun-${dinero?.punados}`}
            className="input-dinero"
            defaultValue={dinero?.punados || 0}
            onBlur={(e) => handleBlurDinero('punados', e)}
            onKeyDown={handleKeyDown}
            type="number"
          />
        </div>
        <div className="dinero-grupo">
          <label className="label-dinero">BOLSAS</label>
          <input key={`bol-${dinero?.bolsas}`}
          
            className="input-dinero"
            defaultValue={dinero?.bolsas || 0}
            onBlur={(e) => handleBlurDinero('bolsas', e)}
            onKeyDown={handleKeyDown}
            type="number"
          />
        </div>
        <div className="dinero-grupo">
          <label className="label-dinero">COFRES</label>
          <input 
          key={`cof-${dinero?.cofres}`}
            className="input-dinero input-"
            defaultValue={dinero?.cofres || 0}
            onBlur={(e) => handleBlurDinero('cofres', e)}
            onKeyDown={handleKeyDown}
            type="number"
          />
        </div>
      </div>

      <hr className="separador-inventario" />

      {/* SECCIÓN DE OBJETOS */}
      <div className="inventario-lista">
        {inventario.map((item) => (
          <div className="inventario-item-wrapper" key={item.id}>
            <div 
              className={`inventario-item-main ${abierto === item.id ? 'activo' : ''}`}
              onClick={() => toggleSeccion(item.id)}
            >
              <input
                className="input-inventario-titulo"
                defaultValue={item.nombre}
                onBlur={(e) => handleBlurItem(item.id, 'nombre', e)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
                placeholder="Nombre del objeto..."
                spellCheck="false"
              />
            </div>

            {abierto === item.id && (
              <div className="inventario-flotante">
                <div className="inventario-flotante-header">
                  <span>Detalles del Objeto</span>
                  <button onClick={() => setAbierto(null)}>✕</button>
                </div>
                
                <div className="inventario-flotante-contenido">
                  <textarea 
                    className="input-inventario-base input-inventario-detalles"
                    defaultValue={item.detalles}
                    onBlur={(e) => handleBlurItem(item.id, 'detalles', e)}
                    placeholder="Descripción, efectos, cantidades..."
                    rows="4"
                  />
                  <div className="inventario-acciones-footer">
                    <button 
                      className="btn-inventario-eliminar"
                      onClick={() => eliminarItem(item.id)}
                    >
                      Borrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <button className="btn-agregar-item" onClick={agregarItem}>
          + Añadir Objeto
        </button>
      </div>

      <hr className="separador-inventario" />

      {/* SECCIÓN DE NOTAS ADICIONALES (Estilo Acordeón) */}
      <div className="inventario-item-wrapper notas-wrapper">
        <div 
          className={`inventario-item-main notas-main ${abierto === 'notas' ? 'activo' : ''}`}
          onClick={() => toggleSeccion('notas')}
        >
          <span className="titulo-notas">Notas </span>
          <span className="icono-flecha">{abierto === 'notas' ? '▲' : '▼'}</span>
        </div>

        {abierto === 'notas' && (
          <div className="inventario-notas-contenido">
            <textarea 
            key={`not-${notas}`}
              className="input-inventario-base input-inventario-detalles input-notas-expanded"
              defaultValue={notas}
              onBlur={handleBlurNotas}
              placeholder="Apunta aquí todo lo que necesites..."
              rows="6"
            />
          </div>
        )}
      </div>

    </div>
  );
}