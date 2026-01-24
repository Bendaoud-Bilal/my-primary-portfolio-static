import { useState } from 'react';

const ContactForm = ({ onInputChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (onInputChange) {
      onInputChange(name, value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="font-[Fira_Code_Retina] text-menu-text text-sm w-full max-w-md">
      <div className="flex flex-col">
        <label htmlFor="name-input" className="mb-3">_name:</label>
        <input 
          type="text" 
          id="name-input" 
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="p-2 mb-5 placeholder-slate-600 bg-[#011221] border-2 border-border rounded-[7px] text-white focus:outline-none focus:border-menu-text"
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="email-input" className="mb-3">_email:</label>
        <input 
          type="email" 
          id="email-input" 
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="p-2 mb-5 placeholder-slate-600 bg-[#011221] border-2 border-border rounded-[7px] text-white focus:outline-none focus:border-menu-text"
          required
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="message-input" className="mb-3">_message:</label>
        <textarea 
          id="message-input" 
          name="message"
          value={formData.message}
          onChange={handleChange}
          className="placeholder-slate-600 bg-[#011221] border-2 border-border rounded-[7px] resize-none h-[150px] p-[10px] text-white focus:outline-none focus:border-menu-text"
          required
        />
      </div>
      <button 
        type="submit"
        className="font-[Fira_Code_Retina] text-white text-sm bg-border rounded-[7px] mt-5 py-2 px-4 cursor-pointer hover:bg-[#263B50]"
      >
        submit-message
      </button>
    </form>
  );
};

export default ContactForm;
