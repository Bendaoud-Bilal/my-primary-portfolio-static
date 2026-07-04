import { useState } from 'react';
import config from '../data/developer.json';
import ContactForm from '../components/ContactForm';

const ContactMe = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactsOpen, setContactsOpen] = useState(true);
  const [findMeOpen, setFindMeOpen] = useState(true);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const contact = config.contacts;

  // Generate code preview lines
  const codeLines = [
    { content: [{ text: 'const', cls: 'text-codeline-tag' }, { text: ' button', cls: 'text-codeline-name' }, { text: ' = ', cls: 'text-white' }, { text: 'document', cls: 'text-codeline-tag' }, { text: '.', cls: 'text-white' }, { text: 'querySelector', cls: 'text-codeline-name' }, { text: "(", cls: 'text-white' }, { text: "'#sendBtn'", cls: 'text-codeline-link' }, { text: ');', cls: 'text-white' }] },
    { content: [] },
    { content: [{ text: 'const', cls: 'text-codeline-tag' }, { text: ' message', cls: 'text-codeline-name' }, { text: ' = {', cls: 'text-white' }] },
    { content: [{ text: '  name', cls: 'text-codeline-name' }, { text: ': ', cls: 'text-white' }, { text: `"${formData.name || 'name'}"`, cls: 'text-codeline-link' }, { text: ',', cls: 'text-white' }] },
    { content: [{ text: '  email', cls: 'text-codeline-name' }, { text: ': ', cls: 'text-white' }, { text: `"${formData.email || 'email'}"`, cls: 'text-codeline-link' }, { text: ',', cls: 'text-white' }] },
    { content: [{ text: '  message', cls: 'text-codeline-name' }, { text: ': ', cls: 'text-white' }, { text: `"${formData.message || 'message'}"`, cls: 'text-codeline-link' }, { text: ',', cls: 'text-white' }] },
    { content: [{ text: '  date', cls: 'text-codeline-name' }, { text: ': ', cls: 'text-white' }, { text: `"${new Date().toDateString()}"`, cls: 'text-codeline-link' }] },
    { content: [{ text: '};', cls: 'text-white' }] },
    { content: [] },
    { content: [{ text: 'button', cls: 'text-codeline-name' }, { text: '.', cls: 'text-white' }, { text: 'addEventListener', cls: 'text-codeline-name' }, { text: '(', cls: 'text-white' }, { text: "'click'", cls: 'text-codeline-link' }, { text: ', () ', cls: 'text-white' }, { text: '=>', cls: 'text-codeline-tag' }, { text: ' {', cls: 'text-white' }] },
    { content: [{ text: '  form', cls: 'text-codeline-name' }, { text: '.', cls: 'text-white' }, { text: 'send', cls: 'text-codeline-name' }, { text: '(', cls: 'text-white' }, { text: 'message', cls: 'text-codeline-name' }, { text: ');', cls: 'text-white' }] },
    { content: [{ text: '});', cls: 'text-white' }] },
  ];

  return (
    <main id="contact-me" className="page flex flex-col lg:flex-row">
      {/* Mobile Page Title */}
      <div id="mobile-page-title" className="lg:hidden">
        <h2>_contact-me</h2>
      </div>

      {/* Page Menu */}
      <div id="page-menu" className="w-full h-full flex flex-col border-right">
        {/* Contacts */}
        <div className="submenu flex flex-col">
          <div 
            className="title flex items-center cursor-pointer border-bot px-6 py-0 lg:py-2 h-[35px] lg:h-auto bg-border lg:bg-transparent mb-[3px] lg:mb-0"
            onClick={() => setContactsOpen(!contactsOpen)}
          >
            <img 
              src="/icons/arrow.svg" 
              alt="" 
              className={`mr-[10px] w-[9px] h-[9px] transition-transform ${contactsOpen ? 'rotate-90' : ''}`}
            />
            <h3 className="font-[Fira_Code_Regular] text-white text-[16px]">contacts</h3>
          </div>
          {contactsOpen && (
            <div className="py-[10px]">
              {Object.entries(contact.direct.sources).map(([key, source]) => (
                <div key={key} className="flex items-center py-1 px-6">
                  <img src={`/icons/${key}.svg`} alt="" className="w-4 h-4 mr-[10px]" />
                  <a href="/" className="font-[Fira_Code_Retina] text-menu-text hover:text-white">
                    {source}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Find Me Also In */}
        <div className="submenu flex flex-col border-top">
          <div 
            className="title flex items-center cursor-pointer border-bot px-6 py-0 lg:py-2 h-[35px] lg:h-auto bg-border lg:bg-transparent mb-[3px] lg:mb-0"
            onClick={() => setFindMeOpen(!findMeOpen)}
          >
            <img 
              src="/icons/arrow.svg" 
              alt="" 
              className={`mr-[10px] w-[9px] h-[9px] transition-transform ${findMeOpen ? 'rotate-90' : ''}`}
            />
            <h3 className="font-[Fira_Code_Regular] text-white text-[16px]">find-me-also-in</h3>
          </div>
          {findMeOpen && (
            <div className="py-[10px]">
              {Object.entries(contact.find_me_also_in.sources).map(([key, source]) => (
                <div key={key} className="flex items-center py-1 px-6">
                  <img src={key === 'discord' ? "/icons/discord.svg" : (key === 'instagram' ? "/icons/instagram.svg" : "/icons/link.svg")} alt="" className="w-4 h-4 mr-[10px]" />
                  <a 
                    href={source.url !== '#' ? (source.user ? `${source.url}${source.user}` : source.url) : '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[Fira_Code_Retina] text-menu-text hover:text-white"
                  >
                    {source.title} {source.user && `: ${source.user}`}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col w-full">
        {/* Tab Desktop */}
        <div className="tab-height w-full hidden lg:flex border-right border-bot items-center">
          <div className="flex items-center border-right h-full">
            <p className="font-[Fira_Code_Regular] text-menu-text text-sm px-3">contacts</p>
            <img src="/icons/close.svg" alt="" className="m-3" />
          </div>
        </div>

        {/* Main */}
        <div className="flex lg:grid lg:grid-cols-2 h-full w-full">
          {/* Left - Form */}
          <div id="left" className="h-full w-full flex flex-col border-right items-center p-6 lg:p-[35px_25px]">
            <ContactForm onInputChange={handleInputChange} />
          </div>

          {/* Right - Code Preview with Line Numbers */}
          <div id="right" className="h-full w-full hidden lg:flex">
            <div className="form-content p-[35px_0_0_0] w-full h-full overflow-y-auto text-[15px] flex">
              {/* Line Numbers */}
              <div className="flex flex-col items-end pr-4 pl-6 select-none flex-shrink-0">
                {codeLines.map((_, i) => (
                  <span key={i} className="font-[Fira_Code_Retina] text-menu-text opacity-50 leading-6 text-sm">{i + 1}</span>
                ))}
              </div>
              {/* Code */}
              <div className="flex-1 overflow-x-auto pr-6">
                <pre className="font-[Fira_Code_Retina] text-sm">
                  <code>
                    {codeLines.map((line, i) => (
                      <div key={i} className="leading-6 whitespace-nowrap">
                        {line.content.length === 0 ? '\u00A0' : line.content.map((part, j) => (
                          <span key={j} className={part.cls}>{part.text}</span>
                        ))}
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </div>

            {/* Scroll Bar */}
            <div className="h-full border-left flex justify-center py-1 w-5">
              <div className="w-[14px] h-[7px] bg-menu-text"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ContactMe;
