import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { ChatIcon } from './chatbot/icons';
import styles from './Header.module.css';

const navLinks = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
];

interface HeaderProps {
  currentTheme: string;
  toggleTheme: () => void;
  onChatbotClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentTheme, toggleTheme, onChatbotClick }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const location = useLocation();

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScroll && currentScroll > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScroll = currentScroll;

      const sections = navLinks.map(link => document.querySelector(link.href));
      let currentSection = '';
      sections.forEach(section => {
        if (section instanceof HTMLElement && window.scrollY >= section.offsetTop - 100) {
          currentSection = section.id;
        }
      });
      setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (location.pathname !== '/') {
      return;
    }
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <header className={`${styles.header} ${isHidden ? styles.hidden : ''}`}>
      <nav className={styles.nav}>
        {navLinks.map(link => (
          <a
            key={link.href}
            href={location.pathname === '/' ? link.href : `/${link.href}`}
            onClick={(e) => handleNavClick(e, link.href)}
            className={`${styles.navLink} ${activeSection === link.href.substring(1) ? styles.active : ''}`}
          >
            {link.label}
          </a>
        ))}
        <button
          onClick={onChatbotClick}
          className={styles.chatbotButton}
          aria-label="Open AI Assistant"
          title="Chat with AI Assistant"
        >
          <ChatIcon />
        </button>
        <ThemeToggle currentTheme={currentTheme} toggleTheme={toggleTheme} />
      </nav>
    </header>
  );
};

export default Header;
