import { useState, useMemo } from 'react';
import config from '../data/developer.json';
import GistCard from '../components/GistCard';

const AboutMe = () => {
  const [currentSection, setCurrentSection] = useState('personal-info');
  const [currentFolder, setCurrentFolder] = useState('bio');
  const [showContactsMobile, setShowContactsMobile] = useState(false);
  const [openFoldersMobile, setOpenFoldersMobile] = useState(['personal-info']);

  const sections = config.about.sections;

  const focusSection = (sectionKey) => {
    setCurrentSection(sectionKey);
    const firstFolder = Object.keys(sections[sectionKey].info)[0];
    setCurrentFolder(firstFolder);
  };

  const focusFolder = (folderKey) => {
    setCurrentFolder(folderKey);
  };

  const toggleSectionMobile = (sectionKey) => {
    setOpenFoldersMobile(prev => 
      prev.includes(sectionKey) 
        ? prev.filter(k => k !== sectionKey) 
        : [...prev, sectionKey]
    );
  };

  // Generate commented text for the description
  const contentDescription = useMemo(() => {
    const description = sections[currentSection]?.info[currentFolder]?.description || '';
    const cleaned = description
      .replace(/<br>/g, '\n')
      .replace(/<br\/>/g, '\n')
      .replace(/^\n/, '');
    
    const lines = cleaned.split('\n');
    return ['/**', ...lines.map(l => ` * ${l.trim()}`), ' */'];
  }, [currentSection, currentFolder, sections]);

  return (
    <main id="about-me" className="page flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Page Title */}
      <div id="mobile-page-title" className="lg:hidden flex-shrink-0">
        <h2>_about-me</h2>
      </div>

      {/* Page Menu */}
      <div id="page-menu" className="w-full flex border-right flex-shrink-0">
        {/* Desktop Section Icons */}
        <div id="sections" className="hidden lg:flex flex-col w-20 h-full border-right bg-transparent items-center py-4">
          {Object.entries(sections).map(([key, section]) => (
            <div 
              key={key}
              className={`my-6 cursor-pointer flex justify-center transition-opacity ${currentSection === key ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              onClick={() => focusSection(key)}
            >
              <img src={'/' + section.icon} alt={`${section.title}-section`} className="w-6 h-6" />
            </div>
          ))}
        </div>

        {/* Section Content (Desktop) */}
        <div id="section-content" className="hidden lg:flex flex-col w-full h-full border-right overflow-hidden">
          {/* Title */}
          <div id="section-content-title" className="flex items-center min-w-full px-4 border-bot">
            <img src="/icons/arrow.svg" alt="" className="section-arrow open w-2 h-2 mr-3" />
            <p className="font-[Fira_Code_Regular] text-white text-sm">
              {sections[currentSection]?.title}
            </p>
          </div>

          {/* Folders List */}
          <div className="flex flex-col py-2 overflow-y-auto">
            {Object.entries(sections[currentSection]?.info || {}).map(([key, folder], index) => (
              <div key={key} className="flex flex-col">
                <div 
                  className="flex items-center py-2 px-4 cursor-pointer group"
                  onClick={() => focusFolder(key)}
                >
                  <img 
                    src="/icons/diple.svg" 
                    alt="" 
                    className={`mr-3 w-2 transition-transform ${currentFolder === key ? 'rotate-90' : ''}`}
                  />
                  <img src={`/icons/folder${index + 1}.svg`} alt="" className="mr-3 w-4" />
                  <p className={`font-[Fira_Code_Regular] group-hover:text-white transition-colors ${currentFolder === key ? 'text-white' : 'text-menu-text'}`}>
                    {key}
                  </p>
                </div>
                {/* Support for files inside folders if defined in developer.json */}
                {folder.files && currentFolder === key && (
                  <div className="flex flex-col ml-8 py-1">
                    {Object.keys(folder.files).map(fileName => (
                      <div key={fileName} className="flex items-center py-1 cursor-pointer hover:text-white group">
                        <img src="/icons/markdown.svg" alt="" className="mr-3 w-4 opacity-60 group-hover:opacity-100" />
                        <p className="font-[Fira_Code_Regular] text-menu-text group-hover:text-white text-xs">{fileName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div 
            className="flex items-center min-w-full border-top border-bot px-4 py-2 mt-auto cursor-pointer"
            onClick={() => {}}
          >
            <img src="/icons/arrow.svg" alt="" className="section-arrow open w-2 h-2 mr-3" />
            <p className="font-[Fira_Code_Regular] text-white text-sm">
              {config.contacts.direct.title}
            </p>
          </div>
          <div className="flex flex-col py-3 px-4 gap-2">
            {Object.entries(config.contacts.direct.sources).map(([key, source]) => (
              <div key={key} className="flex items-center">
                <img src={`/icons/${key}.svg`} alt="" className="w-4 h-4 mr-3" />
                <a href="/" className="font-[Fira_Code_Retina] text-menu-text hover:text-white text-xs truncate">
                  {source}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Section Content (Mobile) */}
        <div className="lg:hidden w-full flex flex-col font-[Fira_Code_Regular] overflow-y-auto">
          {Object.entries(sections).map(([sectionKey, section]) => (
            <div key={sectionKey} className="flex flex-col">
              <div 
                className="flex items-center min-w-full px-6 py-2 bg-[#1E2D3D] border-bot cursor-pointer"
                onClick={() => toggleSectionMobile(sectionKey)}
              >
                <img 
                  src="/icons/arrow.svg" 
                  alt="" 
                  className={`section-arrow transition-transform w-2 h-2 mr-3 ${openFoldersMobile.includes(sectionKey) ? 'rotate-90' : ''}`}
                />
                <p className="text-white text-sm">{section.title}</p>
              </div>

              {openFoldersMobile.includes(sectionKey) && (
                <div className="flex flex-col py-2 px-6 gap-2">
                  {Object.entries(section.info).map(([folderKey, folder], index) => (
                    <div key={folderKey} className="flex flex-col">
                      <div 
                        className="flex items-center py-1 cursor-pointer group"
                        onClick={() => {
                          setCurrentSection(sectionKey);
                          setCurrentFolder(folderKey);
                        }}
                      >
                        <img src="/icons/diple.svg" alt="" className={`mr-3 w-2 transition-transform ${currentFolder === folderKey && currentSection === sectionKey ? 'rotate-90' : ''}`} />
                        <img src={`/icons/folder${index + 1}.svg`} alt="" className="mr-3 w-4" />
                        <p className={`text-sm group-hover:text-white ${currentFolder === folderKey && currentSection === sectionKey ? 'text-white' : 'text-menu-text'}`}>
                          {folderKey}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Contact Mobile */}
          <div 
            className="flex items-center min-w-full px-6 py-2 bg-[#1E2D3D] border-bot cursor-pointer mt-1"
            onClick={() => setShowContactsMobile(!showContactsMobile)}
          >
            <img 
              src="/icons/arrow.svg" 
              alt="" 
              className={`section-arrow transition-transform w-2 h-2 mr-3 ${showContactsMobile ? 'rotate-90' : ''}`} 
            />
            <p className="text-white text-sm">{config.contacts.direct.title}</p>
          </div>
          {showContactsMobile && (
            <div className="flex flex-col py-3 px-10 gap-3 bg-transparent">
              {Object.entries(config.contacts.direct.sources).map(([key, source]) => (
                <div key={key} className="flex items-center">
                  <img src={`/icons/${key}.svg`} alt="" className="w-4 h-4 mr-4" />
                  <a href="/" className="text-menu-text text-sm truncate">{source}</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:grid lg:grid-cols-2 h-full w-full overflow-hidden">
        
        {/* Left Column - Description Text */}
        <div id="left" className="h-full flex flex-col border-right overflow-hidden min-w-0">
          
          {/* Tab Header (Desktop) */}
          <div className="tab-height w-full hidden lg:flex border-bot items-center px-4 flex-shrink-0">
            <div className="flex items-center border-right h-full pr-4">
              <p className="font-[Fira_Code_Regular] text-menu-text text-sm mr-6">
                {sections[currentSection]?.title}
              </p>
              <img src="/icons/close.svg" alt="close" className="w-3 h-3 opacity-60" />
            </div>
          </div>

          {/* Tab Header (Mobile) */}
          <div className="lg:hidden flex items-center p-6 gap-2 flex-shrink-0">
            <span className="text-white font-[Fira_Code_Retina]">// </span>
            <span className="text-white font-[Fira_Code_Retina] text-sm">{sections[currentSection]?.title}</span>
            <span className="text-menu-text font-[Fira_Code_Retina] text-sm"> / </span>
            <span className="text-menu-text font-[Fira_Code_Retina] text-sm">{currentFolder}</span>
          </div>

          {/* Description Viewport */}
          <div className="flex flex-1 overflow-hidden min-h-0">
            <div className="flex-1 overflow-auto custom-scrollbar p-6 lg:p-8">
              <div className="flex gap-6 lg:gap-10 font-[Fira_Code_Retina] text-sm leading-7 text-menu-text">
                {/* Line Numbers with Comments (Asterisks) */}
                <div className="hidden lg:flex flex-col items-end flex-shrink-0 select-none opacity-40 pr-2">
                  {contentDescription.map((_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                
                {/* Actual Commented Text */}
                <div className="flex-1">
                  <pre className="whitespace-pre-wrap break-words">
                    <code>
                      {contentDescription.map((line, i) => (
                        <div key={i} className={i === 0 || i === contentDescription.length - 1 ? 'text-[#4D5BCE]' : 'text-menu-text'}>
                          {line}
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Dummy Desktop Scrollbar Handle */}
            <div className="hidden lg:flex flex-col w-5 border-left items-center pt-1 flex-shrink-0">
              <div className="w-[14px] h-[7px] bg-[#607B96]"></div>
            </div>
          </div>
        </div>

        {/* Right Column - Snippets Showcase */}
        <div id="right" className="h-full flex flex-col overflow-hidden min-w-0">
          
          {/* Tab Empty Space */}
          <div className="tab-height w-full hidden lg:flex border-bot flex-shrink-0"></div>

          {/* Snippets Container */}
          <div className="flex-1 overflow-auto p-6 lg:p-8 custom-scrollbar">
            <h3 className="text-white lg:text-menu-text mb-6 text-sm">
              // Code snippet showcase:
            </h3>
            
            <div className="flex flex-col gap-4">
              {Object.entries(config.gists).map(([key, id]) => (
                <GistCard key={key} id={id} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AboutMe;
