import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from './components/Header';
import Footer from './components/Footer';
import MobileMenu from './components/MobileMenu';
import Home from './pages/Home';
import AboutMe from './pages/AboutMe';
import Projects from './pages/Projects';
import ContactMe from './pages/ContactMe';

function App() {
  useEffect(() => {
    AOS.init({
      disable: false,
      startEvent: 'DOMContentLoaded',
      initClassName: 'aos-init',
      animatedClassName: 'aos-animate',
      useClassNames: false,
      disableMutationObserver: false,
      debounceDelay: 50,
      throttleDelay: 99,
      offset: 120,
      delay: 0,
      duration: 400,
      easing: 'ease',
      once: false,
      mirror: false,
      anchorPlacement: 'top-bottom',
    });
  }, []);

  return (
    <Router>
      <MobileMenu />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/contact-me" element={<ContactMe />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
