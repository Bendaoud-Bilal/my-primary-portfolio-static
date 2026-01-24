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

      <section className="hero flex-1 flex flex-col justify-center p-6 lg:p-10 overflow-hidden">
        <div className="head pb-8 lg:pb-12">
          <span className="text-base lg:text-lg leading-none text-hello-name font-fira">
            Hi all, I am
          </span>
          <h1 className="text-4xl lg:text-[3.5rem] leading-none text-hello-name font-fira py-3 lg:py-4">
            {config.name}
          </h1>
          <span className="flex text-lg lg:text-[2rem] leading-none text-codeline-tag font-fira">
            &gt;&nbsp;
            <h2 className="line-1 anim-typewriter max-w-fit">
              {config.role}
            </h2>
          </span>
        </div>

        <div id="info" className="flex flex-col py-6 lg:py-10">
          <span className="text-xs lg:text-sm leading-none text-hello-gray font-fira pb-3 lg:pb-4">
            // complete the game to continue
          </span>
          <span className={`text-xs lg:text-sm leading-none text-hello-gray font-fira pb-3 lg:pb-4 ${isMobile ? 'hidden' : ''}`}>
            // you can also see it on my Github page
          </span>
          <span className={`text-xs lg:text-sm leading-none text-hello-gray font-fira pb-3 lg:pb-4 ${!isMobile ? 'hidden' : ''}`}>
            // find my profile on Github:
          </span>
          <p className="font-fira text-hello-name text-sm lg:text-base">
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
        <section data-aos="fade-up" className="game flex flex-col flex-1 h-full justify-center items-center z-20 pr-10">
          <SnakeGame />
        </section>
      )}
    </main>
  );
};

export default Home;
