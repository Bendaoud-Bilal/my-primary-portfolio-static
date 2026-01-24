import { Link } from 'react-router-dom';
import config from '../data/developer.json';

const Footer = () => {
  const social = config.contacts.social;

  return (
    <footer className="flex md:justify-between border-top text-menu-text font-[Fira_Code_Retina] h-10 min-h-10 text-[13px]">
      {/* Social icons */}
      <div className="w-full flex justify-between md:justify-start">
        <span className="h-full flex justify-center items-center border-right px-5">
          find me in:
        </span>
        <div id="social-icons" className="flex">
          <a 
            href={`${social.twitter.url}${social.twitter.user}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex justify-center items-center w-[50px] h-full border-right hover:bg-[#1e2d3d74]"
          >
            <img src="/icons/social/twitter.svg" alt="twitter" className="w-5 h-5 opacity-40 hover:opacity-100" />
          </a>
          <a 
            href={`${social.facebook.url}${social.facebook.user}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex justify-center items-center w-[50px] h-full border-right hover:bg-[#1e2d3d74]"
          >
            <img src="/icons/social/facebook.svg" alt="facebook" className="w-5 h-5 opacity-40 hover:opacity-100" />
          </a>
          <a 
            href={`${social.github.url}${social.github.user}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="flex md:hidden justify-center items-center w-[50px] h-full border-right hover:bg-[#1e2d3d74]"
          >
            <img src="/icons/social/github.svg" alt="github" className="w-5 h-5 opacity-40 hover:opacity-100" />
          </a>
        </div>
      </div>

      {/* Github user */}
      <a 
        href={`${social.github.url}${social.github.user}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="hidden md:flex items-center px-5 border-left hover:bg-[#1e2d3d74]"
      >
        @{social.github.user}
        <img src="/icons/social/github.svg" alt="github" className="w-5 h-5 ml-2" />
      </a>
    </footer>
  );
};

export default Footer;
