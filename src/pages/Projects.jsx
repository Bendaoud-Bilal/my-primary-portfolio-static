import { useState, useMemo } from 'react';
import config from '../data/developer.json';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const techs = ['Python', 'FastAPI', 'Django', 'React', 'Tailwind CSS', 'PyQt5', 'JavaScript'];
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
    <main className="flex flex-col flex-auto lg:flex-row overflow-hidden h-full w-full">
      {/* Mobile Page Title */}
      <div id="mobile-page-title" className="lg:hidden flex-shrink-0">
        <h2>_projects</h2>
      </div>

      {/* Mobile Section Title */}
      <div 
        id="section-content-title" 
        className="flex lg:hidden items-center cursor-pointer bg-[#1E2D3D] px-6 py-2 border-bot flex-shrink-0"
        onClick={() => setShowFilters(!showFilters)}
      >
        <img 
          src="/icons/arrow.svg" 
          alt="" 
          className={`section-arrow w-2 h-2 mr-3 transition-transform ${showFilters ? 'rotate-90' : ''}`}
        />
        <span className="font-[Fira_Code_Regular] text-white text-sm">projects</span>
      </div>

      {/* Filter Menu (Sidebar) */}
      <div 
        className={`${showFilters ? 'flex' : 'hidden lg:flex'} flex-col w-full lg:w-[275px] flex-shrink-0 border-right font-[Fira_Code_Regular] text-menu-text overflow-hidden bg-transparent`}
      >
        {/* Title Desktop */}
        <div id="section-content-title" className="hidden lg:flex items-center min-w-full px-4 border-bot h-[35px]">
          <img src="/icons/arrow.svg" alt="" className="section-arrow open w-2 h-2 mr-3" />
          <p className="font-[Fira_Code_Regular] text-white text-sm">projects</p>
        </div>

        {/* Filter Selection */}
        <nav className="w-full flex flex-col py-4 px-6 gap-3 overflow-y-auto">
          {techs.map(tech => {
            const slug = tech.toLowerCase().replace(' ', '-');
            const active = isChecked(tech);
            return (
              <label key={tech} className="flex items-center group cursor-pointer select-none">
                <div className="relative flex items-center h-5">
                  <input 
                    type="checkbox"
                    className="custom-checkbox w-5 h-5"
                    checked={active}
                    onChange={() => filterProjects(tech)}
                  />
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <img 
                    src={`/icons/techs/${slug}.svg`} 
                    alt="" 
                    className={`tech-icon w-5 h-5 transition-opacity ${active ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}
                  />
                  <span className={`text-sm transition-colors ${active ? 'text-white' : 'text-menu-text group-hover:text-white'}`}>
                    {tech}
                  </span>
                </div>
              </label>
            );
          })}
        </nav>
      </div>

      {/* Projects Display Area */}
      <div className="flex flex-col w-full overflow-hidden bg-transparent">
        
        {/* Active Filters Tab (Desktop) */}
        {filters[0] !== 'all' && (
          <div className="tab-height w-full hidden lg:flex border-bot items-center px-4 flex-shrink-0">
            <div className="flex items-center border-right h-full pr-4">
              <p className="font-[Fira_Code_Regular] text-menu-text text-sm mr-6">
                {filters.join('; ')}
              </p>
              <img 
                src="/icons/close.svg" 
                alt="clear" 
                className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100" 
                onClick={() => setFilters(['all'])}
              />
            </div>
          </div>
        )}

        {/* Active Filters Mobile */}
        <div id="tab" className="flex lg:hidden items-center px-6 py-8 flex-shrink-0 flex-wrap gap-2">
            <span className="text-white font-[Fira_Code_Retina]">// </span>
            <span className="text-white font-[Fira_Code_Retina] text-sm mr-2">projects</span>
            <span className="text-menu-text font-[Fira_Code_Retina] text-sm mr-2"> / </span>
            <span className="text-menu-text font-[Fira_Code_Retina] text-sm">
                {filters.join('; ')}
            </span>
        </div>

        {/* Projects Grid */}
        <div id="projects-case" className="flex-1 w-full overflow-auto custom-scrollbar p-6 lg:p-12">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-12 animate-fade-in">
              {projects.map((project, index) => (
                <ProjectCard key={index} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col font-[Fira_Code_Retina] text-menu-text h-full justify-center items-center py-20 animate-fade-in">
              <span className="text-4xl pb-4 opacity-50">X__X</span>
              <h2 className="text-white text-xl mb-2">No matching projects</h2>
              <p>for these technologies</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Projects;
