import { useState } from 'react';
import './Armas.css';

export default function Armas({ 
  competencia, 
  alActualizarCompetencia, 
  equipamiento, 
  alCambiarEquipamiento 
}) {
  const [abierto, setAbierto] = useState(null);

  const eqSeguro = equipamiento || { principal: {}, secundaria: {}, armadura: {} };

  const handleBlur = (slot, campo, e) => {
    const nuevoValor = e.target.value;
    const valorActual = eqSeguro[slot]?.[campo] || '';
    
    if (nuevoValor !== String(valorActual)) {
      const nuevoEq = {
        ...eqSeguro,
        [slot]: {
          ...eqSeguro[slot],
          [campo]: nuevoValor
        }
      };
      alCambiarEquipamiento(nuevoEq);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur();
  };

  const toggleSeccion = (seccion) => {
    setAbierto(abierto === seccion ? null : seccion);
  };

  const renderBloque = (slot, titulo, campos) => {
    const datos = eqSeguro[slot] || {};

    return (
      <div className="arma-item-wrapper" key={slot}>
        <div 
          className={`arma-item-main ${abierto === slot ? 'activo' : ''}`}
          onClick={() => toggleSeccion(slot)}
        >
          <small>{titulo}</small>
          <input
            className="input-arma-titulo"
            defaultValue={datos.nombre || ''}
            onBlur={(e) => handleBlur(slot, 'nombre', e)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            placeholder={`Nombre de ${titulo.toLowerCase()}...`}
            spellCheck="false"
          />
        </div>

        {abierto === slot && (
          <div className="arma-flotante">
            <div className="arma-flotante-header">
              <span>Detalles</span>
              <button onClick={() => setAbierto(null)}>✕</button>
            </div>
            
            <div className="arma-flotante-contenido">
              <div className="arma-grid-datos">
                {campos.map((campo) => (
                  <div className="arma-dato-grupo" key={campo.id}>
                    <small className="label-arma-gris">{campo.label}</small>
                    <input 
                      className="input-arma-base input-dato-valor"
                      defaultValue={datos[campo.id] || ''}
                      onBlur={(e) => handleBlur(slot, campo.id, e)}
                      onKeyDown={handleKeyDown}
                      type="text"
                    />
                  </div>
                ))}
              </div>

              <div className="arma-fila-caract">
                <small className="label-arma-gris">CARACTERÍSTICAS</small>
                <textarea 
                  className="input-arma-base input-caract-valor"
                  defaultValue={datos.caract || ''}
                  onBlur={(e) => handleBlur(slot, 'caract', e)}
                  placeholder="Detalles adicionales, efectos, etc..."
                  rows="2"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const camposArma = [
    { id: 'rasgos', label: 'RASGOS' },
    { id: 'alcance', label: 'ALCANCE' },
    { id: 'dano', label: 'DAÑO' },
    { id: 'tipo', label: 'TIPO' }
  ];

  const camposArmadura = [
    { id: 'puntuacion', label: 'PUNTUACIÓN BASE' },
    { id: 'umbrales', label: 'UMBRALES' }
  ];

  return (
    <div className="contenedor-armas">
      <div className="competencia-container-vtt">
        <span className="label-competencia-vtt">COMPETENCIA</span>
        <div className="modificador-competencia-wrapper">
          <input 
            className="input-competencia-vtt"
            defaultValue={competencia || 1}
            onBlur={(e) => {
              const val = Math.min(6, Math.max(1, parseInt(e.target.value) || 1));
              alActualizarCompetencia('competencia', val);
            }}
            onKeyDown={handleKeyDown}
            type="number"
          />
        </div>
      </div>

      <hr className="separador-armas-vtt" />

      <div className="armas-lista-expandible">
        {renderBloque('principal', 'ARMA PRINCIPAL', camposArma)}
        {renderBloque('secundaria', 'ARMA SECUNDARIA', camposArma)}
        {renderBloque('armadura', 'ARMADURA EQUIPADA', camposArmadura)}
      </div>
    </div>
  );
}