import React, { useState } from 'react';
import Button from './Button';

type FormErrors = {
  name?: string;
  email?: string;
  message?: string;
};

const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formState.name.trim()) {
      newErrors.name = 'お名前を入力してください';
    }
    
    if (!formState.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    
    if (!formState.message.trim()) {
      newErrors.message = 'メッセージを入力してください';
    } else if (formState.message.length < 10) {
      newErrors.message = 'メッセージは10文字以上で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('Form Submitted:', formState);
    setSubmitted(true);
    setFormState({ name: '', email: '', message: '' });
    // Keep success message visible
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (errors[e.target.name as keyof FormErrors]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  return (
    <section id="contact" className="pt-16 pb-24 md:pt-20 md:pb-28 relative overflow-hidden bg-background">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background to-slate-950 z-0"></div>
      
      <div className="container mx-auto px-8 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Let's <span className="text-neon-orange">Collaborate</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            個人開発レベルのWebアプリ制作、AIニュース/自動化ワークフロー構築、
            Web広告まわりのご相談など、お気軽にご連絡ください。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          
          {/* Links & Info */}
          <div className="flex flex-col justify-center space-y-8 p-8 border border-white/5 bg-slate-900 backdrop-blur-sm rounded-xl">
             <div>
               <h3 className="text-sm font-bold uppercase tracking-widest text-[#9ca3af] mb-2">Email</h3>
               <a href="mailto:contact@kazushi.dev" className="text-2xl md:text-3xl font-medium text-white hover:text-neon-orange transition-colors focus:outline-none focus-visible:underline focus-visible:underline-offset-4">
                 contact@kazushi.dev
               </a>
             </div>

             {/* Services - NEW */}
             <div>
               <h3 className="text-sm font-bold uppercase tracking-widest text-[#9ca3af] mb-3">Services</h3>
               <ul className="space-y-2 text-slate-300">
                 <li className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>
                   Portfolio / Personal website
                 </li>
                 <li className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>
                   Personal tools & PWA
                 </li>
                 <li className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>
                   AI automation / workflow
                 </li>
                 <li className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>
                   Ad analytics & optimization
                 </li>
               </ul>
             </div>

             {/* Response time - NEW */}
             <div>
               <h3 className="text-sm font-bold uppercase tracking-widest text-[#9ca3af] mb-2">Response Time</h3>
               <p className="text-slate-300">
                 通常1〜2営業日以内に返信します。
               </p>
             </div>
             
             <div>
               <h3 className="text-sm font-bold uppercase tracking-widest text-[#9ca3af] mb-4">Socials</h3>
               <div className="flex space-x-6">
                 <a href="#" className="text-lg text-gray-300 hover:text-neon-cyan underline decoration-neutral-700 underline-offset-4 hover:decoration-neon-cyan transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan">Twitter / X</a>
                 <a href="#" className="text-lg text-gray-300 hover:text-neon-cyan underline decoration-neutral-700 underline-offset-4 hover:decoration-neon-cyan transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan">GitHub</a>
                 <a href="#" className="text-lg text-gray-300 hover:text-neon-cyan underline decoration-neutral-700 underline-offset-4 hover:decoration-neon-cyan transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan">LinkedIn</a>
               </div>
             </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {submitted && (
              <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                <p className="font-medium">Thanks! I'll get back to you within 1–2 business days.</p>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-mono text-gray-500 uppercase">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className={`w-full bg-slate-900 border p-4 text-white focus:outline-none transition-all rounded ${
                  errors.name 
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-white/10 focus:border-neon-orange focus:ring-1 focus:ring-neon-orange'
                }`}
                placeholder="山田 太郎"
                onChange={handleChange}
                value={formState.name}
              />
              {errors.name && (
                <p className="text-sm text-red-400 mt-1">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-mono text-gray-500 uppercase">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className={`w-full bg-slate-900 border p-4 text-white focus:outline-none transition-all rounded ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-white/10 focus:border-neon-orange focus:ring-1 focus:ring-neon-orange'
                }`}
                placeholder="example@email.com"
                onChange={handleChange}
                value={formState.email}
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="message" className="text-sm font-mono text-gray-500 uppercase">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows={5}
                className={`w-full bg-slate-900 border p-4 text-white focus:outline-none transition-all resize-none rounded ${
                  errors.message 
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' 
                    : 'border-white/10 focus:border-neon-orange focus:ring-1 focus:ring-neon-orange'
                }`}
                placeholder="作りたいもの、予算感、希望時期など分かる範囲で教えてください。"
                onChange={handleChange}
                value={formState.message}
              ></textarea>
              {errors.message && (
                <p className="text-sm text-red-400 mt-1">{errors.message}</p>
              )}
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
