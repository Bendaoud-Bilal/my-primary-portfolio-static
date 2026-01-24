import { NavLink } from 'react-router-dom';
import config from '../data/developer.json';
import GithubCorner from './GithubCorner';

const Header = () => {
  return (
    <header id="navbar" className="w-full hidden lg:flex flex-col">
      <nav className="w-full flex justify-between border-bot">
        <GithubCorner url="https://github.com/alexdeploy/developer-portfolio-v2" />
        <div className="flex">
          <NavLink 
            id="nav-logo" 
            to="/"
            className="text-menu-text font-[Fira_Code_Retina] px-6 h-full flex items-center border-right hover:bg-[#1e2d3d74] hover:text-white"
          >
            {config.logo_name}
          </NavLink>

          <NavLink 
            to="/" 
            end
            className={({ isActive }) => 
              `text-menu-text font-[Fira_Code_Retina] px-6 h-full flex items-center border-right hover:bg-[#1e2d3d74] hover:text-white ${isActive ? 'border-b-2 border-b-[#FEA55F] !text-white' : ''}`
            }
          >
            _hello
          </NavLink>

          <NavLink 
            to="/about-me"
            className={({ isActive }) => 
              `text-menu-text font-[Fira_Code_Retina] px-6 h-full flex items-center border-right hover:bg-[#1e2d3d74] hover:text-white ${isActive ? 'border-b-2 border-b-[#FEA55F] !text-white' : ''}`
            }
          >
            _about-me
          </NavLink>

          <NavLink 
            to="/projects"
            className={({ isActive }) => 
              `text-menu-text font-[Fira_Code_Retina] px-6 h-full flex items-center border-right hover:bg-[#1e2d3d74] hover:text-white ${isActive ? 'border-b-2 border-b-[#FEA55F] !text-white' : ''}`
            }
          >
            _projects
          </NavLink>
        </div>

        <NavLink 
          to="/contact-me"
          className={({ isActive }) => 
            `text-menu-text font-[Fira_Code_Retina] px-6 h-full flex items-center border-left hover:bg-[#1e2d3d74] hover:text-white ${isActive ? 'border-b-2 border-b-[#FEA55F] !text-white' : ''}`
          }
        >
          _contact-me
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
