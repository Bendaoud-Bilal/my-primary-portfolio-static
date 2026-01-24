import { useState } from 'react';
import config from '../data/developer.json';

const AboutMe = () => {
  const [currentSection, setCurrentSection] = useState('personal-info');
  const [currentFolder, setCurrentFolder] = useState('bio');

  const sections = config.about.sections;

  const focusSection = (sectionKey) => {
    setCurrentSection(sectionKey);
    const firstFolder = Object.keys(sections[sectionKey].info)[0];
    setCurrentFolder(firstFolder);
  };

  const focusFolder = (folderKey) => {
    setCurrentFolder(folderKey);
  };

  return (
    <main id="about-me" className="page flex flex-col lg:flex-row">
      {/* Mobile Page Title */}
      <div id="mobile-page-title" className="lg:hidden">
        <h2>_about-me</h2>
      </div>

      {/* Page Menu */}
      <div id="page-menu" className="w-full flex border-right">
        {/* Desktop Section Icons */}
        <div id="sections" className="hidden lg:block w-20 h-full border-right">
          {Object.entries(sections).map(([key, section]) => (
            <div 
              key={key}
              className={`my-6 cursor-pointer flex justify-center ${currentSection === key ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              onClick={() => focusSection(key)}
            >
              <img src={section.icon} alt={`${section.title}-section`} />
            </div>
          ))}
        </div>

        {/* Section Content */}
        <div id="section-content" className="hidden lg:block w-full h-full border-right">
          {/* Title */}
          <div id="section-content-title" className="hidden lg:flex items-center min-w-full">
            <img src="/icons/arrow.svg" alt="" className="section-arrow mx-3 open" />
            <p className="font-[Fira_Code_Regular] text-white text-sm">
              {sections[currentSection]?.title}
            </p>
          </div>

          {/* Folders */}
          <div>
            {Object.entries(sections[currentSection]?.info || {}).map(([key, folder], index) => (
              <div 
                key={key}
                className="grid grid-cols-2 items-center my-2 font-[Fira_Code_Regular] text-menu-text cursor-pointer hover:text-white"
                onClick={() => focusFolder(key)}
              >
                <div className="flex col-span-2">
                  <img 
                    src="/icons/diple.svg" 
                    alt="" 
                    className={`mx-3 w-2 max-w-fit ${currentFolder === key ? 'open' : ''}`}
                    style={{ transform: currentFolder === key ? 'rotate(90deg)' : 'none' }}
                  />
                  <img src={`/icons/folder${index + 1}.svg`} alt="" className="mr-3" />
                  <p className={currentFolder === key ? 'text-white' : ''}>{key}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div id="section-content-title-contact" className="flex items-center min-w-full border-top cursor-pointer">
            <img src="/icons/arrow.svg" alt="" className="section-arrow mx-3 open" />
            <p className="font-[Fira_Code_Regular] text-white text-sm">
              {config.contacts.direct.title}
            </p>
          </div>
          <div className="hidden lg:flex lg:flex-col my-2">
            {Object.entries(config.contacts.direct.sources).map(([key, source]) => (
              <div key={key} className="flex items-center mb-2">
                <img src={`/icons/${key}.svg`} alt="" className="mx-4" />
                <a href="/" className="font-[Fira_Code_Retina] text-menu-text hover:text-white">
                  {source}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Section Content */}
        <div id="section-content-mobile" className="lg:hidden w-full font-[Fira_Code_Regular]">
          {Object.entries(sections).map(([sectionKey, section]) => (
            <div key={sectionKey}>
              <div 
                id="section-content-title"
                className="flex lg:hidden mb-1 items-center cursor-pointer"
                onClick={() => focusSection(sectionKey)}
              >
                <img 
                  src="/icons/arrow.svg" 
                  alt="" 
                  className={`section-arrow ${currentSection === sectionKey ? 'open' : ''}`}
                />
                <p className="text-white text-sm">{section.title}</p>
              </div>

              {currentSection === sectionKey && (
                <div className="px-6 py-2">
                  {Object.entries(section.info).map(([folderKey, folder], index) => (
                    <div 
                      key={folderKey}
                      className="flex items-center my-2 font-[Fira_Code_Regular] text-menu-text cursor-pointer hover:text-white"
                      onClick={() => focusFolder(folderKey)}
                    >
                      <img src="/icons/diple.svg" alt="" className="mx-3 w-2" />
                      <img src={`/icons/folder${index + 1}.svg`} alt="" className="mr-3" />
                      <p className={currentFolder === folderKey ? 'text-white' : ''}>{folderKey}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Contact Mobile */}
          <div id="section-content-title" className="flex items-center min-w-full">
            <img src="/icons/arrow.svg" alt="" className="section-arrow" />
            <p className="font-[Fira_Code_Regular] text-white text-sm">
              {config.contacts.direct.title}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 h-full w-full overflow-hidden">
        {/* Left */}
        <div id="left" className="w-full flex flex-col border-right overflow-hidden">
          {/* Tab Desktop */}
          <div className="tab-height w-full hidden lg:flex border-bot items-center flex-shrink-0">
            <div className="flex items-center border-right h-full">
              <p className="font-fira text-menu-text text-sm px-3 truncate">
                {sections[currentSection]?.title}
              </p>
              <img src="/icons/close.svg" alt="" className="mx-3" />
            </div>
          </div>

          {/* Tab Mobile */}
          <div className="flex lg:hidden font-fira p-6 items-end flex-shrink-0">
            <span className="text-white">// </span>
            <h3 className="text-white px-2 truncate">{sections[currentSection]?.title}</h3>
            <span className="text-menu-text"> / </span>
            <h3 className="text-menu-text pl-2 truncate">{currentFolder}</h3>
          </div>

          {/* Text Content */}
          <div className="flex flex-1 w-full lg:border-right overflow-hidden min-h-0">
            <div className="w-full h-full ml-5 mr-10 lg:my-5 overflow-auto">
              <div className="font-fira text-menu-text text-sm leading-6">
                <pre className="whitespace-pre-wrap break-words">
                  <code>
                    <span className="text-codeline-tag">/**</span>
                    <br />
                    <span 
                      className="text-menu-text"
                      dangerouslySetInnerHTML={{ 
                        __html: sections[currentSection]?.info[currentFolder]?.description
                          ?.replace(/<br>/g, '\n * ')
                          ?.replace(/<br\/>/g, '\n * ') || ''
                      }}
                    />
                    <br />
                    <span className="text-codeline-tag">*/</span>
                  </code>
                </pre>
              </div>
            </div>

            {/* Scroll Bar */}
            <div className="h-full border-left hidden lg:flex justify-center py-1 w-5 flex-shrink-0">
              <div className="w-[14px] h-[7px] bg-menu-text"></div>
            </div>
          </div>
        </div>

        {/* Right - Code Snippets */}
        <div id="right" className="max-w-full flex flex-col overflow-hidden">
          <div className="tab-height w-full hidden lg:flex border-bot items-center flex-shrink-0"></div>

          <div className="flex flex-col lg:px-6 lg:py-4 w-full overflow-hidden p-6">
            <h3 className="text-white lg:text-menu-text mb-4 text-sm">
              // Code snippet showcase:
            </h3>
            <div className="flex flex-col overflow-auto">
              <p className="text-menu-text font-fira text-sm">
                // Check out the gists section on GitHub for code snippets
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutMe;
