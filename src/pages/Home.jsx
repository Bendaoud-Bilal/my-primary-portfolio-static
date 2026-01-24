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
    <main id="hello">
      {/* Gradients */}
      <div className="css-blurry-gradient-blue"></div>
      <div className="css-blurry-gradient-green"></div>

      <section className="hero">
        <div className="head">
          <span>Hi all, I am</span>
          <h1>{config.name}</h1>
          <span className="diple flex">
            &gt;&nbsp;
            <h2 className="line-1 anim-typewriter max-w-fit">
              {config.role}
            </h2>
          </span>
        </div>

        <div id="info">
          <span className="action">
            // complete the game to continue
          </span>
          <span className={isMobile ? 'hide' : ''}>
            // you can also see it on my Github page
          </span>
          <span className={!isMobile ? 'hide' : ''}>
            // find my profile on Github:
          </span>
          <p className="code">
            <span className="identifier">const </span>
            <span className="variable-name">githubLink </span>
            <span className="operator">= </span>
            <a 
              className="string"
              href={`https://github.com/${config.contacts.social.github.user}`}
            >
              "https://github.com/{config.contacts.social.github.user}"
            </a>
          </p>
        </div>
      </section>

      {!isMobile && (
        <section data-aos="fade-up" className="game">
          <SnakeGame />
        </section>
      )}
    </main>
  );
};

export default Home;
