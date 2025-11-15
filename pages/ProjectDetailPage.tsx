import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/portfolioData';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projects.find(p => p.id === projectId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  if (!project) {
    return (
      <div className="ProjectDetailPage_notFound">
        <h1>Project Not Found</h1>
        <Link to="/" className="ProjectDetailPage_backLink">Go back home</Link>
      </div>
    );
  }

  return (
    <section className="ProjectDetailPage_detailPage">
      <Link to="/" className="ProjectDetailPage_backLink">
        <i className="fas fa-arrow-left"></i> Back to Portfolio
      </Link>
      
      <header className="ProjectDetailPage_header">
        <h1 className="ProjectDetailPage_title">{project.title}</h1>
        <p className="ProjectDetailPage_subtitle">{project.subtitle}</p>
        <div className="ProjectDetailPage_meta">
          <span><i className="fas fa-calendar-alt"></i> {project.date}</span>
          <span><i className="fas fa-tag"></i> {project.category}</span>
        </div>
      </header>
      
      <div className="ProjectDetailPage_contentGrid">
        <main className="ProjectDetailPage_mainContent">
          <img src={project.images.main} alt={project.title} className="ProjectDetailPage_mainImage" />
          
          <h2 className="ProjectDetailPage_sectionHeading">Project Overview</h2>
          <p>{project.overview}</p>

          <h2 className="ProjectDetailPage_sectionHeading">Key Features</h2>
          <ul className="ProjectDetailPage_featuresList">
            {project.features.map((feature, index) => (
              <li key={index}>
                <i className="fas fa-check-circle"></i>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          
          <h2 className="ProjectDetailPage_sectionHeading">Technical Implementation</h2>
          <p>{project.implementation}</p>

          <h2 className="ProjectDetailPage_sectionHeading">Gallery</h2>
          <div className="ProjectDetailPage_gallery">
            {project.images.gallery.map((img, index) => (
              <div key={index} className="ProjectDetailPage_galleryItem">
                <img src={img.src} alt={img.title} className="ProjectDetailPage_galleryImg" />
                <div className="ProjectDetailPage_galleryOverlay">
                  <h4>{img.title}</h4>
                  <p>{img.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
        
        <aside className="ProjectDetailPage_sidebar">
          <div className="ProjectDetailPage_sidebarContent">
            <h3 className="ProjectDetailPage_sidebarHeading">Project Details</h3>
            <div className="ProjectDetailPage_detailItem"><strong>Category:</strong><span>{project.category}</span></div>
            <div className="ProjectDetailPage_detailItem"><strong>Team Size:</strong><span>{project.teamSize}</span></div>
            <div className="ProjectDetailPage_detailItem"><strong>My Role:</strong><span>{project.role}</span></div>
            <div className="ProjectDetailPage_detailItem"><strong>Status:</strong><span>{project.status}</span></div>
            <div className="ProjectDetailPage_detailItem">
              <strong>Technologies:</strong>
              <div className="ProjectDetailPage_tags">
                {project.tags.map(tag => (
                  <span key={tag} className="ProjectDetailPage_tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default ProjectDetailPage;
