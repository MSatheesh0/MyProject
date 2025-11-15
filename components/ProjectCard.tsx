import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';
import useScrollAnimation from '../hooks/useScrollAnimation';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useScrollAnimation(cardRef);
  
  return (
    <div ref={cardRef} className={`ProjectCard_card ${isInView ? 'ProjectCard_card--visible' : ''}`}>
      <div className="ProjectCard_cardContent">
        <div className="ProjectCard_cardHeader" style={{ background: project.gradient }}>
          <h3>{project.shortName}</h3>
        </div>
        <div className="ProjectCard_cardBody">
          <h4>{project.title}</h4>
          <p>{project.description}</p>
          <div className="ProjectCard_tags">
            {project.tags.slice(0, 3).map(tag => (
              <span key={tag} className="ProjectCard_tag">{tag}</span>
            ))}
          </div>
          <Link to={`/project/${project.id}`} className="ProjectCard_detailsLink">
            View Project <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
