import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import Sala from './Sala';
import Footer from './components/Footer';

export default function App() {
  // Comentario normal de JS: El contenedor principal para que el flexbox empuje el footer abajo
  return (
   <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sala/:idSala" element={<Sala />} />
        </Routes>
      </div>

      <Footer />
      
    </div>
  );
}