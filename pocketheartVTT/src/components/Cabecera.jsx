import { useRef, useEffect } from 'react';
import './Cabecera.css';

export default function Cabecera({ personaje, alActualizar }) {
  const nombreRef = useRef(null);

  useEffect(() => {
    if (nombreRef.current) {
      nombreRef.current.style.height = 'auto';
      nombreRef.current.style.height = nombreRef.current.scrollHeight + 'px';
    }
  }, [personaje.nombre]);

  const handleBlur = (e, columna) => {
    const valor = e.target.value;
    if (valor !== String(personaje[columna] || '')) {
      alActualizar(columna, valor);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.target.blur();
    }
  };

  const renderInfoItem = (label, columna) => (
    <div className="info-item-wrapper">
      <div className="info-item-main">
        <small>{label}</small>
        <input
          defaultValue={personaje[columna] || ''}
          onBlur={(e) => handleBlur(e, columna)}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );

  return (
    <header className="dh-header-vtt">
      <div className="dh-nombre-lado">
        <textarea
          className="input-nombre-multiline"
          defaultValue={personaje.nombre}
          onBlur={(e) => handleBlur(e, 'nombre')}
          onKeyDown={handleKeyDown}
          ref={nombreRef}
          rows="1"
          spellCheck="false"
        />
      </div>
      
      <div className="dh-datos-lado">
        {renderInfoItem('NIVEL', 'nivel')}
        {renderInfoItem('CLASE', 'clase')}
        {renderInfoItem('ASCENDENCIA', 'ascendencia')}
        {renderInfoItem('COMUNIDAD', 'comunidad')}
      </div>
    </header>
  );
}