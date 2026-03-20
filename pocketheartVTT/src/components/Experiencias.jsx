import { useState, useEffect } from 'react';
import './Experiencias.css';

export default function Experiencias({ lista, alCambiar }) {
  const [items, setItems] = useState(lista || []);

  // Sincronización con cambios externos
  useEffect(() => {
    setItems(lista || []);
  }, [lista]);

  const actualizarLocal = (index, campo, nuevoValor) => {
    const nuevaLista = [...items];
    nuevaLista[index] = { ...nuevaLista[index], [campo]: nuevoValor };
    setItems(nuevaLista);
  };

  const handleBlur = () => {
    alCambiar(items);
  };

  const agregarExperiencia = () => {
    const nuevaLista = [...items, { nombre: "", valor: 2 }];
    setItems(nuevaLista);
    alCambiar(nuevaLista);
  };

  const eliminarExperiencia = (index) => {
    const nuevaLista = items.filter((_, i) => i !== index);
    setItems(nuevaLista);
    alCambiar(nuevaLista);
  };

  return (
    <section className="dh-block">
      <div className="block-header">EXPERIENCIAS</div>
      
      <div className="experiencias-body">
        {items.map((exp, index) => (
          <div className="experiencia-row-vtt" key={index}>
            <input
              className="input-exp-nombre"
              onBlur={handleBlur}
              onChange={(e) => actualizarLocal(index, 'nombre', e.target.value)}
              placeholder="Agrega la experiencia"
              type="text"
              value={exp.nombre || ''}
            />
            
            <div className="modificador-wrapper">
              <span className="plus-prefix">+</span>
              <input
                className="input-exp-mod"
                onBlur={handleBlur}
                onChange={(e) => actualizarLocal(index, 'valor', parseInt(e.target.value) || 0)}
                type="number"
                value={exp.valor ?? 2}
              />
            </div>

            <button className="btn-del-exp" onClick={() => eliminarExperiencia(index)}>
              ✕
            </button>
          </div>
        ))}

        <button className="btn-agregar-exp" onClick={agregarExperiencia}>
          + Añadir Experiencia
        </button>
      </div>
    </section>
  );
}