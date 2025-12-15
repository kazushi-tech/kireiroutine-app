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
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 text-sm md:text-base font-bold tracking-wide transition-all duration-300 ease-out border uppercase relative overflow-hidden group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";
  
  // Updated colors based on new palette
  const variants = {
    primary: "bg-emerald-400 border-emerald-400 text-slate-950 hover:bg-emerald-300 hover:border-emerald-300 hover:shadow-[0_0_20px_rgba(52,211,153,0.4)]",
    outline: "bg-transparent border-emerald-400 text-emerald-300 hover:bg-emerald-400/10 hover:text-emerald-200 hover:shadow-[0_0_15px_rgba(52,211,153,0.25)]"
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
