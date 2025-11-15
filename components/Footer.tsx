import React from 'react';

const socialLinks = [
  { href: "https://www.linkedin.com/in/m-satheesh-968090258/", icon: "fab fa-linkedin-in" },
  { href: "https://github.com/MSatheesh0", icon: "fab fa-github" },
];

const Footer: React.FC = () => {
  return (
    <footer className="Footer_footer">
      <div className="Footer_footerContent">
        <div className="Footer_socialLinks">
          {socialLinks.map(link => (
            <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="Footer_socialLink">
              <i className={link.icon}></i>
            </a>
          ))}
        </div>
        <p className="Footer_copyright">© {new Date().getFullYear()} Satheesh M. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
