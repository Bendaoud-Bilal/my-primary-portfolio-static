import { useState, useEffect } from 'react';
import config from '../data/developer.json';
import SnakeGame from '../components/SnakeGame';

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <main id="hello" className="flex h-full w-full flex-1 pl-0 lg:pl-[17rem] overflow-hidden relative">
      {/* Gradients */}
      <div className="css-blurry-gradient-blue"></div>
      <div className="css-blurry-gradient-green"></div>

      <section className="hero w-full lg:w-1/2 flex flex-col justify-center p-4 lg:p-6 lg:pr-4 overflow-hidden">
        <div className="head pb-6 lg:pb-10">
          <span className="text-sm lg:text-base leading-tight text-hello-name font-fira block">
            Hi all, I am
          </span>
          <h1 className="text-2xl lg:text-4xl xl:text-5xl leading-tight text-hello-name font-fira py-2 lg:py-3 break-words">
            {config.name}
          </h1>
          <span className="flex text-base lg:text-xl xl:text-2xl leading-tight text-codeline-tag font-fira">
            &gt;&nbsp;
            <h2 className="line-1 anim-typewriter truncate">
              {config.role}
            </h2>
          </span>
        </div>

        <div id="info" className="flex flex-col py-4 lg:py-6 overflow-hidden">
          <span className="text-xs lg:text-sm leading-relaxed text-hello-gray font-fira pb-2 lg:pb-3">
            // complete the game to continue
          </span>
          <span className={`text-xs lg:text-sm leading-relaxed text-hello-gray font-fira pb-2 lg:pb-3 ${isMobile ? 'hidden' : ''}`}>
            // you can also see it on my Github page
          </span>
          <span className={`text-xs lg:text-sm leading-relaxed text-hello-gray font-fira pb-2 lg:pb-3 ${!isMobile ? 'hidden' : ''}`}>
            // find my profile on Github:
          </span>
          <p className="font-fira text-hello-name text-xs lg:text-sm break-all">
            <span className="text-[#6172ff]">const </span>
            <span className="text-codeline-name">githubLink </span>
            <span className="text-white">= </span>
            <a 
              href={`https://github.com/${config.contacts.social.github.user}`}
              className="text-codeline-link underline underline-offset-4"
            >
              "https://github.com/{config.contacts.social.github.user}"
            </a>
          </p>
        </div>
      </section>

      {!isMobile && (
        <section data-aos="fade-up" className="game flex flex-col w-1/2 h-full justify-center items-center z-20 p-4">
          <SnakeGame />
        </section>
      )}
    </main>
  );
};

export default Home;
