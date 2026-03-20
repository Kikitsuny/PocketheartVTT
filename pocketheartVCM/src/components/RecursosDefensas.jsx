import { useState } from 'react';
import './RecursosDefensas.css';

export default function RecursosDefensas({ 
  stats, 
  maximos, 
  onTogglePip, 
  onChangeMax, 
  soloRecursos, 
  soloArmadura,
  personaje,      
  alActualizar    
}) {
  const [esperanzaAbierta, setEsperanzaAbierta] = useState(false);

  const renderFilaPips = (recurso, label, claseColor) => {
    const cantidadHuecos = maximos[recurso] || 6;
    return (
      <div className="resource-row-stack">
        <div className="resource-header-row">
          <small className="resource-label">{label}</small>
          <div className="pip-controls">
            <button onClick={() => onChangeMax(recurso, -1)}><span>-</span></button>
            <button onClick={() => onChangeMax(recurso, 1)}><span>+</span></button>
          </div>
        </div>
        <div className="pips-container">
          {[...Array(cantidadHuecos)].map((_, i) => (
            <div 
              className={`pip ${claseColor} ${i + 1 <= (stats[recurso] || 0) ? 'active' : ''}`}
              key={i} 
              onClick={() => onTogglePip(recurso, i + 1)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="recursos-wrapper">
      {soloRecursos && (
        <div className="bloque-recursos-pips">
          {renderFilaPips('vida', 'HP (VIDA)', 'pip-hp')}
          {renderFilaPips('estres', 'ESTRÉS', 'pip-stress')}
          {renderFilaPips('hope', 'HOPE (ESPERANZA)', 'pip-hope')}

          {/* --- NUEVO: ACORDEÓN DE HABILIDAD DE ESPERANZA --- */}
      {personaje && (
            <div className="esperanza-item-wrapper">
              <div 
                className={`esperanza-item-main ${esperanzaAbierta ? 'activo' : ''}`}
                onClick={() => setEsperanzaAbierta(!esperanzaAbierta)}
              >
                <div className="esperanza-header-info">
                  <small>HABILIDAD DE HOPE</small>
                  <input
                    key={`nesp-${personaje.nombre_esperanza}`}
                    className="input-esperanza-titulo"
                    defaultValue={personaje.nombre_esperanza || ''}
                    onBlur={(e) => alActualizar('nombre_esperanza', e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                    placeholder="Habilidad de Hope..."
                    spellCheck="false"
                  />
                </div>
                <span className="icono-flecha-recursos">{esperanzaAbierta ? '▲' : '▼'}</span>
              </div>

              {esperanzaAbierta && (
                <div className="esperanza-contenido">
                  <textarea 
                    key={`hesp-${personaje.habilidad_esperanza}`}
                    className="input-esperanza-detalles"
                    defaultValue={personaje.habilidad_esperanza || ''}
                    onBlur={(e) => alActualizar('habilidad_esperanza', e.target.value)}
                    placeholder="Describe aquí tu Habilidad (Cuesta 3 Hope)..."
                    rows="3"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {soloArmadura && personaje && (
        <div className="bloque-defensas-manual">
          <div className="fila-manual-vtt">
            <div className="campo-manual">
              <span className="label-manual">EVASIÓN</span>
              <input 
                key={`eva-${personaje.evasion}`} /* <-- NUEVO */
                className="input-vtt-limpio"
                defaultValue={personaje.evasion || 0}
                onBlur={(e) => alActualizar('evasion', parseInt(e.target.value) || 0)}
                type="number"
              />
            </div>

            <div className="campo-manual">
              <span className="label-manual">UMBRALES</span>
              <div className="grupo-umbrales">
                <input 
                  key={`um-${personaje.umbral_menor}`}
                  className="input-vtt-limpio"
                  defaultValue={personaje.umbral_menor || 0}
                  onBlur={(e) => alActualizar('umbral_menor', parseInt(e.target.value) || 0)}
                  type="number"
                />
                <span className="separador-vtt">/</span>
                <input 
                  key={`uM-${personaje.umbral_mayor}`}
                  className="input-vtt-limpio"
                  defaultValue={personaje.umbral_mayor || 0}
                  onBlur={(e) => alActualizar('umbral_mayor', parseInt(e.target.value) || 0)}
                  type="number"
                />
              </div>
            </div>
          </div>
          {renderFilaPips('armadura', 'ARMADURA', 'pip-armor')}
        </div>
      )}
    </div>
  );
}