import { useState, useEffect } from 'react';
import config from '../data/developer.json';
import GameConsole from '../components/GameConsole';
import TypingCycle from '../components/TypingCycle';

// Same breakpoint as the CSS / Tailwind `lg` (desktop starts at 1024px)
const MOBILE_QUERY = '(max-width: 1023.98px)';
const ROLE = [config.role];

const Home = () => {
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(MOBILE_QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
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
          <h2>
            <span aria-hidden="true">&gt;&nbsp;</span>
            <TypingCycle
              phrases={ROLE}
              once
              startDelay={1000}
              typingSpeed={45}
              className="role-typing"
            />
          </h2>

          <p className="roles-cycle">
            <TypingCycle phrases={config.taglines} />
          </p>
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
          <GameConsole />
        </section>
      )}
    </main>
  );
};

export default Home;
