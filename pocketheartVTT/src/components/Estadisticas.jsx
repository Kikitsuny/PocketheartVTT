import './Estadisticas.css';

export default function Estadisticas({ personaje, alActualizar }) {
  if (!personaje) return null;

  const statsConfig = [
    { label: 'AGILIDAD', key: 'agilidad' },
    { label: 'FUERZA', key: 'fuerza' },
    { label: 'FINESSE', key: 'finesse' },
    { label: 'INSTINTO', key: 'instinto' },
    { label: 'PRESENCIA', key: 'presencia' },
    { label: 'CONOCIMIENTO', key: 'conocimiento' }
  ];

  const handleBlur = (e, columna) => {
    const valor = parseInt(e.target.value) || 0;
    if (valor !== personaje[columna]) {
      alActualizar(columna, valor);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur();
  };

  return (
    <section className="dh-stats-row">
      {statsConfig.map((stat) => (
        <div className="stat-box" key={stat.key}>
          <small>{stat.label}</small>
          <div className="stat-input-wrapper">
            <input
              className="stat-value-input"
              defaultValue={personaje[stat.key] || 0}
              onBlur={(e) => handleBlur(e, stat.key)}
              onKeyDown={handleKeyDown}
              type="number"
            />
          </div>
        </div>
      ))}
    </section>
  );
}