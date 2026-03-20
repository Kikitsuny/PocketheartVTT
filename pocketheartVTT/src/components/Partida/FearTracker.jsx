import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import './FearTracker.css';

export default function FearTracker() {
  const { idSala } = useParams();
  const [fear, setFear] = useState(0);

  useEffect(() => {
   const fetchFear = async () => {
      // Usamos limit(1).maybeSingle() para evitar el pánico de las filas duplicadas
      const { data } = await supabase
        .from('partida')
        .select('fear')
        .eq('sala_id', idSala)
        .limit(1)
        .maybeSingle();

      if (data) {
        setFear(data.fear);
      } else {
        // Intentamos insertar. Si la base de datos lo rechaza (porque otra pestaña ya lo hizo), no pasa nada
        const { error } = await supabase
          .from('partida')
          .insert([{ sala_id: idSala, fear: 0 }]);
          
        if (error && error.code !== '23505') { // 23505 es el código de "Ya existe (Unique)"
           console.error("Error al crear la sala de Fear:", error);
        }
      }
    };

    fetchFear();

    // Nos suscribimos SOLO a los cambios de esta sala
    const canal = supabase
      .channel(`cambios-fear-${idSala}`)
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'partida', 
          filter: `sala_id=eq.${idSala}` 
        },
        (payload) => {
          if (payload.new && payload.new.fear !== undefined) {
            setFear(payload.new.fear);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [idSala]);

  const actualizarFear = async (nuevoValor) => {
    const val = Math.max(0, parseInt(nuevoValor) || 0);
    if (val === fear) return; 

    setFear(val); 

    const { data } = await supabase
      .from('partida')
      .update({ fear: val })
      .eq('sala_id', idSala)
      .select();

    // Solo insertamos si realmente no se actualizó nada
    if (!data || data.length === 0) {
      await supabase
        .from('partida')
        .insert([{ sala_id: idSala, fear: val }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur();
  };

  return (
    <div className="fear-tracker-wrapper">
      <small className="fear-label">FEAR</small>
      <div className="fear-controls">
        <button 
          className="btn-fear-ajuste" 
          onClick={() => actualizarFear(fear - 1)}
        >
          -
        </button>
        <input
          key={`fear-vtt-${fear}`} 
          className="fear-input"
          defaultValue={fear}
          onBlur={(e) => actualizarFear(e.target.value)}
          onKeyDown={handleKeyDown}
          type="number"
        />
        <button 
          className="btn-fear-ajuste" 
          onClick={() => actualizarFear(fear + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}