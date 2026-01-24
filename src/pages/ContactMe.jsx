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
                  <img src="/icons/link.svg" alt="" className="w-4 h-4 mr-[10px]" />
                  <a 
                    href={`${source.url}${source.user}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[Fira_Code_Retina] text-menu-text hover:text-white"
                  >
                    {source.title}
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

          {/* Right - Code Preview */}
          <div id="right" className="h-full w-full hidden lg:flex">
            <div className="form-content p-[75px_50px_0_75px] w-full h-full overflow-y-auto text-[15px]">
              <pre className="font-[Fira_Code_Retina] text-menu-text">
                <code>
                  <span className="text-codeline-tag">const</span>{' '}
                  <span className="text-codeline-name">button</span>{' '}
                  <span className="text-white">=</span>{' '}
                  <span className="text-codeline-tag">document</span>
                  <span className="text-white">.</span>
                  <span className="text-codeline-name">querySelector</span>
                  <span className="text-white">(</span>
                  <span className="text-codeline-link">'#sendBtn'</span>
                  <span className="text-white">);</span>
                  {'\n\n'}
                  <span className="text-codeline-tag">const</span>{' '}
                  <span className="text-codeline-name">message</span>{' '}
                  <span className="text-white">=</span>{' '}
                  <span className="text-white">{'{'}</span>
                  {'\n'}
                  {'  '}<span className="text-codeline-name">name</span>
                  <span className="text-white">:</span>{' '}
                  <span className="text-codeline-link">"{formData.name || 'name'}"</span>
                  <span className="text-white">,</span>
                  {'\n'}
                  {'  '}<span className="text-codeline-name">email</span>
                  <span className="text-white">:</span>{' '}
                  <span className="text-codeline-link">"{formData.email || 'email'}"</span>
                  <span className="text-white">,</span>
                  {'\n'}
                  {'  '}<span className="text-codeline-name">message</span>
                  <span className="text-white">:</span>{' '}
                  <span className="text-codeline-link">"{formData.message || 'message'}"</span>
                  <span className="text-white">,</span>
                  {'\n'}
                  {'  '}<span className="text-codeline-name">date</span>
                  <span className="text-white">:</span>{' '}
                  <span className="text-codeline-link">"{new Date().toDateString()}"</span>
                  {'\n'}
                  <span className="text-white">{'}'};</span>
                  {'\n\n'}
                  <span className="text-codeline-name">button</span>
                  <span className="text-white">.</span>
                  <span className="text-codeline-name">addEventListener</span>
                  <span className="text-white">(</span>
                  <span className="text-codeline-link">'click'</span>
                  <span className="text-white">,</span>{' '}
                  <span className="text-white">()</span>{' '}
                  <span className="text-codeline-tag">=&gt;</span>{' '}
                  <span className="text-white">{'{'}</span>
                  {'\n'}
                  {'  '}<span className="text-codeline-name">form</span>
                  <span className="text-white">.</span>
                  <span className="text-codeline-name">send</span>
                  <span className="text-white">(</span>
                  <span className="text-codeline-name">message</span>
                  <span className="text-white">);</span>
                  {'\n'}
                  <span className="text-white">{'}'});</span>
                </code>
              </pre>
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
