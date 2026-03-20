import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="dh-footer">
      <div className="dh-footer-content">
        {/* Sección Legal - Se mantendrá a la izquierda */}
        <div className="dh-footer-legal">
          <p>
            This work includes material from the <strong>Daggerheart Playtest Manuscript </strong> 
            and/or other materials published by <strong>Darrington Press LLC</strong> and is used here 
            under the Daggerheart Community License.
          </p>
          <p>
            Daggerheart and Darrington Press are trademarks of Darrington Press LLC. 
            This project is not an official Darrington Press product.
          </p>
        </div>

        {/* Sección de Autoría - Se moverá a la derecha */}
        <div className="dh-footer-brand">
          <p className="copyright">
            © {currentYear} <strong>@Kikitsuny</strong>
          </p>
          <a 
            href="https://kikitsuny.neocities.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn-footer-link"
          >KIKITSUNY</a>
        </div>
      </div>
    </footer>
  );
}