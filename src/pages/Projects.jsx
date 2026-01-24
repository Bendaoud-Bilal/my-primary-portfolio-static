import { useState, useMemo } from 'react';
import config from '../data/developer.json';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const techs = ['React', 'HTML', 'CSS', 'Vue', 'Angular', 'Gatsby', 'Flutter'];
  const [filters, setFilters] = useState(['all']);
  const [showFilters, setShowFilters] = useState(true);

  const projects = useMemo(() => {
    if (filters.includes('all')) {
      return Object.values(config.projects);
    }
    return Object.values(config.projects).filter(project => 
      filters.some(filter => project.tech.includes(filter))
    );
  }, [filters]);

  const filterProjects = (tech) => {
    setFilters(prev => {
      if (prev.includes(tech)) {
        const newFilters = prev.filter(item => item !== tech);
        return newFilters.length === 0 ? ['all'] : newFilters;
      } else {
        const newFilters = prev.filter(item => item !== 'all');
        return [...newFilters, tech];
      }
    });
  };

  const isChecked = (tech) => filters.includes(tech);

  return (
    <main className="flex flex-col flex-auto lg:flex-row overflow-hidden">
      {/* Mobile Page Title */}
      <div id="mobile-page-title" className="lg:hidden">
        <h2>_projects</h2>
      </div>

      {/* Mobile Section Title */}
      <div 
        id="section-content-title" 
        className="flex lg:hidden items-center cursor-pointer"
        onClick={() => setShowFilters(!showFilters)}
      >
        <img 
          src="/icons/arrow.svg" 
          alt="" 
          className={`section-arrow ${showFilters ? 'rotate-90' : ''}`}
        />
        <span className="font-[Fira_Code_Regular] text-white text-sm">projects</span>
      </div>

      {/* Filter Menu */}
      {showFilters && (
        <div id="filter-menu" className="w-full flex-col border-right font-[Fira_Code_Regular] text-menu-text lg:flex">
          {/* Title Desktop */}
          <div id="section-content-title" className="hidden lg:flex items-center min-w-full">
            <img src="/icons/arrow.svg" alt="" className="section-arrow mx-3" />
            <p className="font-[Fira_Code_Regular] text-white text-sm">projects</p>
          </div>

          {/* Filter Options */}
          <nav className="w-full flex-col py-2 px-6">
            {techs.map(tech => (
              <div key={tech} className="flex items-center py-2">
                <input 
                  type="checkbox"
                  id={tech}
                  checked={isChecked(tech)}
                  onChange={() => filterProjects(tech)}
                  className="custom-checkbox"
                />
                <img 
                  src={`/icons/techs/${tech}.svg`} 
                  alt="" 
                  className={`tech-icon w-5 h-5 mx-4 ${isChecked(tech) ? 'opacity-100' : 'opacity-40'}`}
                />
                <label 
                  htmlFor={tech}
                  className={`cursor-pointer ${isChecked(tech) ? 'text-white' : ''}`}
                >
                  {tech}
                </label>
              </div>
            ))}
          </nav>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col w-full overflow-hidden">
        {/* Tab Desktop */}
        <div className="tab-height w-full hidden lg:flex border-bot items-center">
          <div className="flex items-center border-right h-full">
            <p className="font-[Fira_Code_Regular] text-menu-text text-sm px-3">
              {filters.join('; ')};
            </p>
            <img src="/icons/close.svg" alt="" className="m-3" />
          </div>
        </div>

        {/* Tab Mobile */}
        <div className="flex lg:hidden items-center flex-wrap p-6 pt-6 pb-2">
          <span className="text-white">// </span>
          <p className="font-[Fira_Code_Regular] text-white text-sm px-3">projects</p>
          <span className="text-menu-text"> / </span>
          <p className="font-[Fira_Code_Regular] text-menu-text text-sm px-3">
            {filters.join('; ')};
          </p>
        </div>

        {/* Projects Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 max-w-full h-full overflow-auto lg:self-center p-6 lg:p-0 ${projects.length === 0 ? 'hidden' : ''}`}>
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>

        {/* Not Found */}
        {projects.length === 0 && (
          <div className="flex flex-col font-[Fira_Code_Retina] text-menu-text my-5 h-full justify-center items-center">
            <span className="flex justify-center text-4xl pb-3">X__X</span>
            <span className="text-white flex justify-center text-xl">No matching projects</span>
            <span className="flex justify-center">for these technologies</span>
          </div>
        )}
      </div>
    </main>
  );
};

export default Projects;
