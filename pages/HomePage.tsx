import React, { useEffect, useRef, useState } from 'react';
import { skills, tools, education, experience, projects, certifications, technicalEvents } from '../data/portfolioData';
import { EMAILJS_CONFIG, FIREBASE_CONFIG } from '../constants';
import useTypingEffect from '../hooks/useTypingEffect';
import Section from '../components/Section';
import SkillItem from '../components/SkillItem';
import Timeline from '../components/Timeline';
import ProjectCard from '../components/ProjectCard';

// Declare global variables from CDN scripts
declare const emailjs: any;
declare const firebase: any;

const HomePage: React.FC = () => {
  const typingPhrases = [
    "Information Tech Student",
    "Full Stack Developer",
    "Web Developer",
    "Problem Solver",
    "Team Player",
    "Future Software Engineer",
    "IoT Enthusiast"
  ];
  const typedText = useTypingEffect(typingPhrases, 100, 50, 2000);
  const contactFormRef = useRef<HTMLFormElement>(null);
  const [formStatus, setFormStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);


  useEffect(() => {
    if (!firebase.apps.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    emailjs.init(EMAILJS_CONFIG.USER_ID);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!contactFormRef.current) return;
    
    setFormStatus(null);
    
    try {
      await emailjs.sendForm(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, contactFormRef.current);
      
      const db = firebase.firestore();
      const formData = new FormData(contactFormRef.current);
      const contactData = {
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
      };
      await db.collection('contacts').add(contactData);

      setFormStatus({ type: 'success', message: 'Message sent successfully!' });
      contactFormRef.current?.reset();
    } catch (error) {
        console.error('Failed to send message:', error);
        setFormStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section id="about" className="HomePage_hero">
        <div className="HomePage_animatedBg"></div>
        <div className="HomePage_floatingShapes">
          <span></span><span></span><span></span><span></span><span></span>
        </div>
        <div className="HomePage_heroContent">
            <div className="HomePage_heroText">
              <h1 className="HomePage_heroName">Satheesh M</h1>
              <h2 className="HomePage_heroSubtitle">
                <span className="HomePage_typingText">{typedText}</span>
                <span className="HomePage_cursor"></span>
              </h2>
              <p className="HomePage_heroDescription">
                Detail-oriented Information Technology student with expertise in web development, cybersecurity, and IoT solutions. Passionate about creating secure, efficient digital experiences through innovative technology.
              </p>
              <div className="HomePage_heroButtons">
                <a href="#contact" className={`HomePage_btn HomePage_btnPrimary`}>Get In Touch</a>
                <a href="#projects" className={`HomePage_btn HomePage_btnSecondary`}>View Projects</a>
                <a href="https://drive.google.com/file/d/1qwClnr5uxx8_mpaXLlE2458a9UuCcQiJ/view?usp=sharing" target="_blank" rel="noopener noreferrer" className={`HomePage_btn HomePage_btnSecondary`}>Resume</a>
              </div>
            </div>
            <div className="HomePage_heroImageContainer">
              <img src="https://i.imgur.com/h5TqL72.jpeg" alt="Satheesh M" className="HomePage_heroImage" />
            </div>
        </div>
      </section>

      {/* Sections */}
      <Section id="skills" title="Technical Skills">
        <div className="HomePage_grid">
          {skills.map(skill => <SkillItem key={skill.name} skill={skill} />)}
        </div>
      </Section>

      <Section id="education" title="Education">
        <Timeline items={education} />
      </Section>
      
      <Section id="experience" title="Experience">
        <Timeline items={experience} />
      </Section>
      
      <Section id="projects" title="Projects">
        <div className="HomePage_grid">
          {projects.map(project => <ProjectCard key={project.id} project={project} />)}
        </div>
      </Section>

      <Section id="certifications" title="Certifications">
        <div className="HomePage_cardsContainer">
            {certifications.map((cert, index) => (
                <div key={index} className="HomePage_infoCard">
                    <h3 className="HomePage_infoCardTitle">{cert.title}</h3>
                    <h4 className="HomePage_infoCardSubtitle">{cert.institution}</h4>
                    <span className="HomePage_infoCardDate">{cert.date}</span>
                    <p>{cert.description}</p>
                </div>
            ))}
        </div>
      </Section>

      <Section id="tools" title="Tools & Technologies">
        <div className="HomePage_grid">
          {tools.map(tool => <SkillItem key={tool.name} skill={tool} />)}
        </div>
      </Section>

      <Section id="events" title="Technical Events">
      <div className="HomePage_cardsContainer">
            {technicalEvents.map((event, index) => (
                <div key={index} className="HomePage_infoCard">
                    <h3 className="HomePage_infoCardTitle">{event.title}</h3>
                    <h4 className="HomePage_infoCardSubtitle">{event.institution}</h4>
                    <span className="HomePage_infoCardDate">{event.date}</span>
                    <p>{event.description}</p>
                </div>
            ))}
        </div>
      </Section>

      <Section id="contact" title="Get In Touch">
        <form ref={contactFormRef} onSubmit={handleContactSubmit} className="HomePage_contactForm">
            <div className="HomePage_formGroup">
                <input type="text" className="HomePage_formControl" name="name" placeholder="Your Name" required />
            </div>
            <div className="HomePage_formGroup">
                <input type="email" className="HomePage_formControl" name="email" placeholder="Your Email" required />
            </div>
            <div className="HomePage_formGroup">
                <input type="text" className="HomePage_formControl" name="subject" placeholder="Subject" required />
            </div>
            <div className="HomePage_formGroup">
                <textarea className="HomePage_formControl" name="message" placeholder="Your Message" required></textarea>
            </div>
            <button type="submit" className={`HomePage_btn HomePage_btnPrimary`}>Send Message</button>
            {formStatus && (
              <div className={`HomePage_formStatus ${formStatus.type === 'success' ? 'success' : 'error'}`}>
                {formStatus.message}
              </div>
            )}
        </form>
      </Section>
    </>
  );
};

export default HomePage;
