import { useState, useEffect } from 'react';
import './Popup.css';

export default function Popup({
  isOpen,
  onClose,
  onConfirm,
  titulo,
  mensaje,
  textoConfirmar = "Aceptar",
  textoCancelar = "Cancelar",
  tipo = "confirmacion", // Puede ser: 'confirmacion', 'input', 'estricto'
  valorEsperado = "",    // Texto que se debe teclear en modo 'estricto'
  placeholder = "",      // Texto fantasma del input
  esPeligro = false      // Si es true, el borde y el botón se pintan de rojo
}) {
  const [inputValue, setInputValue] = useState('');

  // Limpia el input cada vez que se abre la ventana
  useEffect(() => {
    if (isOpen) setInputValue('');
  }, [isOpen]);

  // Si no está abierto, no renderizamos nada
  if (!isOpen) return null;

  const alAceptar = () => {
    // Si es un input, le mandamos el texto de vuelta a la función padre
    if (tipo === 'input') {
      if (!inputValue.trim()) return; 
      onConfirm(inputValue.trim());
    } else {
      onConfirm(); // Confirmación normal o estricta
    }
  };

  // Lógica para bloquear el botón si el modo es estricto
  const botonBloqueado = tipo === 'estricto' && inputValue !== valorEsperado;

  // Manejador para detectar la tecla "Enter"
  const manejarEnter = (e) => {
    if (e.key === 'Enter' && !botonBloqueado) {
      alAceptar();
    }
  };

  // Color dinámico del título y el borde
  const colorTema = esPeligro ? 'var(--color-peligro)' : 'var(--color-primario)';

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ borderColor: colorTema }}>
        <h3 style={{ color: colorTema }}>{titulo}</h3>
        
        <div className="modal-mensaje">{mensaje}</div>
        
        {(tipo === 'input' || tipo === 'estricto') && (
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={manejarEnter}
            placeholder={placeholder}
            className="input-popup"
            autoFocus
          />
        )}
        
        <div className="modal-botones">
          <button onClick={onClose} className="btn-cancelar">
            {textoCancelar}
          </button>
          
          <button 
            onClick={alAceptar} 
            className={esPeligro ? "btn-destruir-final" : "btn-confirmar-normal"}
            disabled={botonBloqueado}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}