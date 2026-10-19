import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Send, Check } from 'lucide-react';
import { SwahivoLogo } from '../common/SwahivoLogo';

import { DealershipService } from '../../services/dealershipService';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setIsSubmitting(true);
      await DealershipService.subscribeNewsletter(email);
      setIsSubmitting(false);
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="bg-[#081725] text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-slate-800/80">
          
          {/* Column 1: Brand & Socials */}
          <div className="space-y-5">
            <Link to="/">
              <SwahivoLogo variant="light" size="lg" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your trusted car dealership in Tanzania. New cars, used cars, accessories and more.
            </p>
            {/* Social Icons matching design */}
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-[#ef172b] flex items-center justify-center text-slate-300 hover:text-white transition-all"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.808C10.596 0 9 1.583 9 4.615V8z"/></svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-[#ef172b] flex items-center justify-center text-slate-300 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-[#ef172b] flex items-center justify-center text-slate-300 hover:text-white transition-all"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a
                href="https://wa.me/255770565656"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-[#25D366] flex items-center justify-center text-slate-300 hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link to="/" className="hover:text-[#ef172b] transition-colors py-1">Home</Link>
              <Link to="/about" className="hover:text-[#ef172b] transition-colors py-1">About</Link>
              <Link to="/cars" className="hover:text-[#ef172b] transition-colors py-1">Cars</Link>
              <Link to="/blog" className="hover:text-[#ef172b] transition-colors py-1">Blog</Link>
              <Link to="/accessories" className="hover:text-[#ef172b] transition-colors py-1">Accessories</Link>
              <Link to="/contact" className="hover:text-[#ef172b] transition-colors py-1">Contact</Link>
              <Link to="/services" className="hover:text-[#ef172b] transition-colors py-1">Services</Link>
              <Link to="/faq" className="hover:text-[#ef172b] transition-colors py-1">FAQ</Link>
              <Link to="/finance" className="hover:text-[#ef172b] transition-colors py-1">Finance</Link>
              <Link to="/privacy" className="hover:text-[#ef172b] transition-colors py-1">Privacy Policy</Link>
            </div>
          </div>

          {/* Column 3: Contact Us */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Contact Us</h4>
            <div className="flex items-start space-x-3 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-[#ef172b] flex-shrink-0 mt-0.5" />
              <span>Kiembe Samaki - Zanzibar Tanzania</span>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <Phone className="w-4 h-4 text-[#ef172b] flex-shrink-0" />
              <a href="tel:+255770565656" className="hover:text-white transition-colors">+255 770 565656</a>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-[#ef172b] flex-shrink-0" />
              <a href="mailto:auto.link@yahoo.com" className="hover:text-white transition-colors">auto.link@yahoo.com</a>
            </div>
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-[#ef172b] flex-shrink-0" />
              <span>Mon - Sat: 8:00 AM - 6:00 PM</span>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-5">Newsletter</h4>
            <p className="text-xs text-slate-400">
              Get the latest cars and offers.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex rounded-xl overflow-hidden shadow-inner bg-slate-900 border border-slate-700">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none bg-transparent"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#ef172b] hover:bg-[#d01122] text-white text-xs font-semibold flex items-center justify-center transition-colors"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : 'Subscribe'}
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400">
                  Thank you! You have subscribed to Swahivo updates.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Copyright & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 Swahivo Car Dealership. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms & Conditions</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link to="/sitemap" className="hover:text-slate-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
