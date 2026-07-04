const ProjectCard = ({ project, index }) => {
  return (
    <div id="project" className="flex flex-col mb-8 w-full max-w-[400px] justify-self-center">
      {/* Project Label */}
      <div className="flex items-center text-sm mb-4">
        <h3 className="text-[#4D5BCE] font-[Fira_Code_Bold] mr-3 italic">
          Project {index + 1}
        </h3>
        <h4 className="font-[Fira_Code_Retina] text-menu-text truncate">
          // {project.title}
        </h4>
      </div>

      {/* Card Content */}
      <div className="bg-[#011221] border border-border rounded-[15px] overflow-hidden flex flex-col transition-transform hover:translate-y-[-4px]">
        {/* Preview Image & Tech Icons */}
        <div className="relative h-[150px] overflow-hidden border-bot">
          {/* Tech Icons Overlay */}
          <div className="absolute right-3 top-3 flex gap-2 z-10">
            {project.tech.map((tech) => (
              <img 
                key={tech}
                src={`/icons/techs/filled/${tech.toLowerCase().replace(' ', '-')}.svg`} 
                alt={tech}
                className="w-6 h-6 hover:scale-110 transition-transform"
                title={tech}
              />
            ))}
          </div>
          {/* Main Image */}
          <img 
            src={project.img} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Description & Link */}
        <div className="p-6 flex flex-col gap-6">
          <p className="text-menu-text font-[Fira_Code_Retina] text-sm leading-6 h-[72px] overflow-hidden line-clamp-3">
            {project.description}
          </p>
          <a 
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-[Fira_Code_Retina] py-2 px-4 w-fit text-xs rounded-lg bg-[#1C2B3A] hover:bg-[#263B50] transition-colors"
          >
            view-project
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
