import { useState } from 'react';
import './CartasDeDominio.css';

export default function CartasDeDominio({ lista, alCambiar }) {
  const [abierta, setAbierta] = useState(null);
  const [viendoMazo, setViendoMazo] = useState(false);

  const activas = lista.filter((c) => c.activa);
  const mazo = lista.filter((c) => !c.activa);

  const actualizarCarta = (id, campo, valor) => {
    const nuevaLista = lista.map((c) =>
      c.id === id ? { ...c, [campo]: valor } : c
    );
    alCambiar(nuevaLista);
  };

  const agregarCarta = (activaInicial) => {
    if (activaInicial && activas.length >= 5) {
      alert("No puedes tener más de 5 cartas activas. Se enviará al Mazo.");
      activaInicial = false;
    }

    const nuevaCarta = {
      id: crypto.randomUUID(),
      activa: activaInicial,
      costo_recall: '',
      dominios: '',
      nivel: '',
      nombre: '',
      otros: '',
      texto: '',
      tipo: ''
    };
    alCambiar([...lista, nuevaCarta]);
  };

  const eliminarCarta = (id) => {
    if (window.confirm("¿Eliminar esta carta de dominio permanentemente?")) {
      alCambiar(lista.filter((c) => c.id !== id));
    }
  };

  const moverCarta = (id, haciaActiva) => {
    if (haciaActiva && activas.length >= 5) {
      alert("Límite de 5 cartas activas alcanzado. Manda una al Mazo primero.");
      return;
    }
    actualizarCarta(id, 'activa', haciaActiva);
    setAbierta(null); // Cierra la ventana al moverla para evitar bugs visuales
  };

  const handleBlur = (id, campo, e) => {
    actualizarCarta(id, campo, e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur();
  };

  const toggleSeccion = (id) => {
    setAbierta(abierta === id ? null : id);
  };

  const renderCarta = (carta) => {
    const camposCortos = [
      { id: 'nivel', label: 'NIVEL' },
      { id: 'dominios', label: 'DOMINIOS' },
      { id: 'costo_recall', label: 'COSTO DE RECALL' },
      { id: 'tipo', label: 'TIPO' }
    ];

    return (
      <div className="carta-item-wrapper" key={carta.id}>
        <div 
          className={`carta-item-main ${abierta === carta.id ? 'activo' : ''}`}
          onClick={() => toggleSeccion(carta.id)}
        >
          <input
            className="input-carta-titulo"
            defaultValue={carta.nombre}
            onBlur={(e) => handleBlur(carta.id, 'nombre', e)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
            placeholder="Nombre de la carta..."
            spellCheck="false"
          />
        </div>

        {abierta === carta.id && (
          <div className="carta-flotante">
            <div className="carta-flotante-header">
              <span>Detalles de Dominio</span>
              <button onClick={() => setAbierta(null)}>✕</button>
            </div>
            
            <div className="carta-flotante-contenido">
              <div className="carta-grid-cuatro">
                {camposCortos.map((campo) => (
                  <div className="carta-dato-grupo" key={campo.id}>
                    <small className="label-carta-gris">{campo.label}</small>
                    <input 
                      className="input-carta-base input-dato-valor"
                      defaultValue={carta[campo.id]}
                      onBlur={(e) => handleBlur(carta.id, campo.id, e)}
                      onKeyDown={handleKeyDown}
                      type={campo.id === 'nivel' || campo.id === 'costo_recall' ? 'number' : 'text'}
                    />
                  </div>
                ))}
              </div>

              <div className="carta-fila-caract">
                <small className="label-carta-gris">TEXTO DE LA CARTA</small>
                <textarea 
                  className="input-carta-base input-caract-valor"
                  defaultValue={carta.texto}
                  onBlur={(e) => handleBlur(carta.id, 'texto', e)}
                  placeholder="Describe los efectos mecánicos..."
                  rows="3"
                />
              </div>

              <div className="carta-fila-caract">
                <small className="label-carta-gris">OTROS</small>
                <textarea 
                  className="input-carta-base input-caract-valor"
                  defaultValue={carta.otros}
                  onBlur={(e) => handleBlur(carta.id, 'otros', e)}
                  placeholder="Notas adicionales..."
                  rows="1"
                />
              </div>

              <div className="carta-acciones-footer">
                <button 
                  className="btn-carta-mover"
                  onClick={() => moverCarta(carta.id, !carta.activa)}
                >
                  {carta.activa ? '↓ Enviar al Mazo' : '↑ Equipar Carta'}
                </button>
                <button 
                  className="btn-carta-eliminar"
                  onClick={() => eliminarCarta(carta.id)}
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="contenedor-cartas">
      <div className="cartas-header-info">
        <span className="cartas-contador">Activas: {activas.length} / 5</span>
        <button className="btn-ver-mazo" onClick={() => setViendoMazo(!viendoMazo)}>
          {viendoMazo ? 'Ver Activas' : `Ver Mazo (${mazo.length})`}
        </button>
      </div>

      <div className="cartas-lista-expandible">
        {!viendoMazo ? (
          <>
            {activas.map(renderCarta)}
            {activas.length < 5 && (
              <button className="btn-agregar-carta" onClick={() => agregarCarta(true)}>
                + Añadir Carta Activa
              </button>
            )}
          </>
        ) : (
          <div className="mazo-contenedor">
            {mazo.length === 0 && <p className="mazo-vacio">El mazo está vacío.</p>}
            {mazo.map(renderCarta)}
            <button className="btn-agregar-carta" onClick={() => agregarCarta(false)}>
              + Añadir al Mazo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}