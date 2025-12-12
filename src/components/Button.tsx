import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline';
  onClick?: () => void;
  className?: string;
  href?: string;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '',
  href
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm md:text-base font-bold tracking-wide transition-all duration-300 ease-out border uppercase relative overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";
  
  // Updated colors based on new palette
  // Primary: Orange #ff8a3c
  const variants = {
    primary: "bg-[#ff8a3c] border-[#ff8a3c] text-black hover:bg-[#ff9933] hover:border-[#ff9933] hover:shadow-[0_0_20px_rgba(255,138,60,0.4)]",
    outline: "bg-transparent border-[#ff8a3c] text-[#ff8a3c] hover:bg-[#ff8a3c]/10 hover:text-[#ff9933] hover:shadow-[0_0_15px_rgba(255,138,60,0.2)]"
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
};

export default Button;