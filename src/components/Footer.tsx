import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 bg-background border-t border-white/10 text-center">
      <p className="text-neutral-600 text-sm">
        © {new Date().getFullYear()} Kazushi. Built with React, Tailwind & Three.js.
      </p>
    </footer>
  );
};

export default Footer;