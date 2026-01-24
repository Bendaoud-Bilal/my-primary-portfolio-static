import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import config from '../data/developer.json';

const MobileMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const goHome = () => {
    if (menuOpen) {
      setMenuOpen(false);
    }
    navigate('/');
  };

  const handleLinkClick = () => {
    setMenuOpen(false);
  };

  return (
    <div id="mobile-menu" className="w-full z-10 lg:hidden">
      {/* Header */}
      <div id="mobile-header" className="w-full h-16 flex justify-between items-center border-bot">
        <button 
          onClick={goHome}
          className="text-menu-text font-[Fira_Code_Retina] flex h-full items-center mx-5 bg-transparent border-0"
        >
          {config.logo_name}
        </button>
        {!menuOpen ? (
          <img 
            src="/icons/burger.svg" 
            alt="Open menu" 
            onClick={toggleMobileMenu}
            className="w-5 h-5 mx-5 my-auto cursor-pointer"
          />
        ) : (
          <img 
            src="/icons/burger-close.svg" 
            alt="Close menu" 
            onClick={toggleMobileMenu}
            className="w-5 h-5 mx-5 my-auto cursor-pointer"
          />
        )}
      </div>

      {/* Mobile menu */}
      <div id="menu" className={`bg-mobile-menu-blue z-10 ${menuOpen ? 'block' : 'hidden'}`}>
        <NavLink 
          to="/" 
          end
          onClick={handleLinkClick}
          className={({ isActive }) => 
            `block text-menu-text font-[Fira_Code_Retina] px-6 py-4 border-bot hover:text-white ${isActive ? 'text-white' : ''}`
          }
        >
          _hello
        </NavLink>

        <NavLink 
          to="/about-me"
          onClick={handleLinkClick}
          className={({ isActive }) => 
            `block text-menu-text font-[Fira_Code_Retina] px-6 py-4 border-bot hover:text-white ${isActive ? 'text-white' : ''}`
          }
        >
          _about-me
        </NavLink>

        <NavLink 
          to="/projects"
          onClick={handleLinkClick}
          className={({ isActive }) => 
            `block text-menu-text font-[Fira_Code_Retina] px-6 py-4 border-bot hover:text-white ${isActive ? 'text-white' : ''}`
          }
        >
          _projects
        </NavLink>

        <NavLink 
          to="/contact-me"
          onClick={handleLinkClick}
          className={({ isActive }) => 
            `block text-menu-text font-[Fira_Code_Retina] px-6 py-4 border-bot hover:text-white ${isActive ? 'text-white' : ''}`
          }
        >
          _contact-me
        </NavLink>
      </div>
    </div>
  );
};

export default MobileMenu;
