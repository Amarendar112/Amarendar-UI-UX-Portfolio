const Footer = () => {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 0' }}>
      <div className="container">
        <div className="footer">
          <div className="footer__copy">
            Designed with ❤️, Logic, and a lot of Chai. &nbsp;·&nbsp; Copyright ©{new Date().getFullYear()} Jaalthari Amarendar.
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
