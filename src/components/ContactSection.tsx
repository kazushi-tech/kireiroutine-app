import React, { useState } from 'react';
import Button from './Button';

const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formState);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000); // Reset for demo
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background to-slate-950 z-0"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Let's <span className="text-neon-orange">Collaborate</span>
          </h2>
          <p className="text-xl text-gray-400">
            Have a vision for an AI-powered project? Or just want to talk tech and marketing?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Links & Info */}
          <div className="flex flex-col justify-center space-y-8 p-8 border border-white/5 bg-slate-950 backdrop-blur-sm">
             <div>
               <h3 className="text-sm font-bold uppercase tracking-widest text-[#9ca3af] mb-2">Email</h3>
               <a href="mailto:contact@kazushi.dev" className="text-2xl md:text-3xl font-medium text-white hover:text-neon-orange transition-colors">
                 contact@kazushi.dev
               </a>
             </div>
             
             <div>
               <h3 className="text-sm font-bold uppercase tracking-widest text-[#9ca3af] mb-4">Socials</h3>
               <div className="flex space-x-6">
                 <a href="#" className="text-lg text-gray-300 hover:text-neon-cyan underline decoration-neutral-700 underline-offset-4 hover:decoration-neon-cyan transition-all">Twitter / X</a>
                 <a href="#" className="text-lg text-gray-300 hover:text-neon-cyan underline decoration-neutral-700 underline-offset-4 hover:decoration-neon-cyan transition-all">GitHub</a>
                 <a href="#" className="text-lg text-gray-300 hover:text-neon-cyan underline decoration-neutral-700 underline-offset-4 hover:decoration-neon-cyan transition-all">LinkedIn</a>
               </div>
             </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-mono text-gray-500 uppercase">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required
                className="w-full bg-slate-950 border border-white/10 p-4 text-white focus:outline-none focus:border-neon-orange focus:ring-1 focus:ring-neon-orange transition-all"
                placeholder="John Doe"
                onChange={handleChange}
                value={formState.name}
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-mono text-gray-500 uppercase">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                className="w-full bg-slate-950 border border-white/10 p-4 text-white focus:outline-none focus:border-neon-orange focus:ring-1 focus:ring-neon-orange transition-all"
                placeholder="john@example.com"
                onChange={handleChange}
                value={formState.email}
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="text-sm font-mono text-gray-500 uppercase">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows={4}
                required
                className="w-full bg-slate-950 border border-white/10 p-4 text-white focus:outline-none focus:border-neon-orange focus:ring-1 focus:ring-neon-orange transition-all resize-none"
                placeholder="Tell me about your project..."
                onChange={handleChange}
                value={formState.message}
              ></textarea>
            </div>

            <Button className="w-full">
              {submitted ? "Message Sent!" : "Send Message"}
            </Button>
          </form>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;