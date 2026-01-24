const ProjectCard = ({ project, index }) => {
  return (
    <div className="lg:mx-5 min-w-[400px] mb-[5px] max-md:min-w-full md:w-full md:min-w-full md:px-[5px] lg:px-[20px]">
      <span className="flex text-sm my-3">
        <h3 className="text-purplefy font-[Fira_Code_Bold] mr-3">Project {index + 1}</h3>
        <h4 className="font-[Fira_Code_Retina] text-menu-text">// {project.title}</h4>
      </span>

      <div className="flex flex-col border border-border bg-[#011221] rounded-[15px] max-w-[400px]">
        <div className="max-h-[120px] relative overflow-hidden">
          <div className="absolute flex right-3 top-3">
            {project.tech.map((tech) => (
              <img 
                key={tech}
                src={`/icons/techs/filled/${tech}.svg`} 
                alt={tech}
                className="w-6 h-6 mx-1 hover:opacity-75"
              />
            ))}
          </div>
          <img 
            src={project.img} 
            alt={project.title}
            className="rounded-t-[15px]"
          />
        </div>

        <div className="pb-8 pt-6 px-6 border-top">
          <p className="text-menu-text font-[Fira_Code_Retina] text-sm mb-5">
            {project.description}
          </p>
          <a 
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-[Fira_Code_Retina] py-2 px-4 w-fit text-xs rounded-lg bg-[#1C2B3A] hover:bg-[#263B50]"
          >
            view-project
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
