import React, { useRef } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ id, title, children, className = '' }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useScrollAnimation(sectionRef);

  return (
    <section 
      id={id} 
      ref={sectionRef}
      className={`Section_section ${className} ${isInView ? 'Section_section--visible' : ''}`}
    >
      <h2 className="Section_sectionTitle">
        {title}
        <span className="Section_titleUnderline"></span>
      </h2>
      <div className="Section_content">
        {children}
      </div>
    </section>
  );
};

export default Section;
