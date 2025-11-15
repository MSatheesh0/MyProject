import React from 'react';

interface ThemeToggleProps {
  currentTheme: string;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ currentTheme, toggleTheme }) => {
  return (
    <button
      className="ThemeToggle_themeToggle"
      onClick={toggleTheme}
      aria-label={`Switch to ${currentTheme === 'light' ? 'dark' : 'light'} mode`}
    >
      <i className={`fas ${currentTheme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
    </button>
  );
};

export default ThemeToggle;
