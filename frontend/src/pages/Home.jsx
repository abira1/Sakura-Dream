import React, { useState, useEffect, useRef } from 'react';
import { menuItems, mockReservation } from '../mockData';
import { Instagram, Facebook, Twitter, Mail, Phone, Coffee, Flower2, CupSoda, Cake, Cookie, Fish, Menu as MenuIcon, X } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

const Home = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visibleItems, setVisibleItems] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const videoRef = useRef(null);
  const menuSectionRef = useRef(null);
  const reserveSectionRef = useRef(null);
  
  // Icon mapping
  const iconComponents = {
    Coffee,
    Flower2,
    Cup: CupSoda,
    Cake,
    Cookie,
    Fish
  };

  const [formData, setFormData] = useState({
    name: '',
    date: '',
    guests: 2
  });

  // Scroll handler for video frame control
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);

      // Control video playback based on scroll
      if (videoRef.current) {
        const scrollPercent = position / (document.documentElement.scrollHeight - window.innerHeight);
        const videoDuration = videoRef.current.duration || 0;
        if (videoDuration > 0) {
          videoRef.current.currentTime = scrollPercent * videoDuration;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute('data-item-id');
            if (itemId && !visibleItems.includes(itemId)) {
              setVisibleItems((prev) => [...prev, itemId]);
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [visibleItems]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.date || !formData.guests) {
      sonnerToast.error("Please fill all fields");
      return;
    }

    try {
      const result = await mockReservation(formData);
      if (result.success) {
        sonnerToast.success(`Reservation Confirmed! Table for ${formData.guests} booked for ${formData.date}`);
        setFormData({ name: '', date: '', guests: 2 });
      }
    } catch (error) {
      sonnerToast.error("Reservation Failed. Please try again later");
    }
  };

  return (
    <div className="sakura-cafe">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="logo text-lg sm:text-2xl font-bold text-sakura-pink tracking-wide whitespace-nowrap">
            桜 Sakura Dream
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-cream hover:text-sakura-pink transition-colors duration-300"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('menu')}
              className="text-cream hover:text-sakura-pink transition-colors duration-300"
            >
              Menu
            </button>
            <button
              onClick={() => scrollToSection('reserve')}
              className="text-cream hover:text-sakura-pink transition-colors duration-300"
            >
              Reserve
            </button>
          </nav>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-cream hover:text-sakura-pink transition-colors duration-300 p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
        
        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-sakura-pink/20">
            <nav className="flex flex-col p-4">
              <button
                onClick={() => scrollToSection('hero')}
                className="text-cream hover:text-sakura-pink transition-colors duration-300 py-3 text-left"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection('menu')}
                className="text-cream hover:text-sakura-pink transition-colors duration-300 py-3 text-left"
              >
                Menu
              </button>
              <button
                onClick={() => scrollToSection('reserve')}
                className="text-cream hover:text-sakura-pink transition-colors duration-300 py-3 text-left"
              >
                Reserve
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section with Video Background */}
      <section id="hero" className="hero-section relative h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            ref={videoRef}
            className="absolute top-1/2 left-1/2 w-[177.77vh] h-[56.25vw] min-w-full min-h-full transform -translate-x-1/2 -translate-y-1/2 object-cover"
            src="https://customer-assets.emergentagent.com/job_5b55854e-6f8c-4ddb-a961-92a2d52368ba/artifacts/u71x998s_Background.mp4"
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 hero-content">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-cream mb-4 tracking-wider leading-tight">
            桜 Dream Cafe
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-cream/90 mb-8 max-w-2xl px-4">
            Where tranquility meets flavor in every sip
          </p>
          <Button
            onClick={() => scrollToSection('menu')}
            className="bg-sakura-pink hover:bg-sakura-pink/90 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300"
          >
            View Menu
          </Button>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" ref={menuSectionRef} className="menu-section py-12 sm:py-20 px-4 sm:px-8 bg-gradient-to-b from-cream via-amber-50 to-cream relative overflow-hidden">
        {/* Japanese Pattern Background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF69B4' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '30px 30px'
        }}></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Traditional Japanese Header */}
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-block relative">
              <h2 className="text-4xl sm:text-6xl font-bold text-center mb-2 vintage-text relative">
                <span className="japanese-accent">お品書き</span>
              </h2>
              <p className="text-2xl sm:text-4xl font-serif text-gray-800 mb-3">Menu</p>
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-sakura-pink to-transparent mx-auto"></div>
            </div>
            <p className="text-center text-gray-700 mt-6 text-base sm:text-lg font-light italic">伝統の味わい • Traditional Flavors</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {menuItems.map((item, index) => {
              const IconComponent = iconComponents[item.icon];
              return (
                <div
                  key={item.id}
                  data-item-id={item.id}
                  className={`menu-card-vintage group relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 sm:p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 active:scale-95 transition-all duration-500 border border-amber-200 ${
                    visibleItems.includes(String(item.id)) ? 'fade-in-visible' : 'fade-in-hidden'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Corner Decorations */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-sakura-pink/40 rounded-tl"></div>
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-sakura-pink/40 rounded-tr"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-sakura-pink/40 rounded-bl"></div>
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-sakura-pink/40 rounded-br"></div>
                  
                  {/* Vintage Paper Texture Overlay */}
                  <div className="absolute inset-0 opacity-20 pointer-events-none rounded-lg" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                  }}></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-center mb-5">
                      <div className="relative">
                        {IconComponent && <IconComponent size={56} className="text-rose-400 sm:w-[64px] sm:h-[64px] filter drop-shadow-md" strokeWidth={1.5} />}
                        {/* Decorative circle behind icon */}
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sakura-pink/20 to-rose-300/20 rounded-full blur-xl scale-150"></div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-center text-gray-800 tracking-wide" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                      {item.name}
                    </h3>
                    
                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-sakura-pink to-transparent mx-auto mb-4"></div>
                    
                    <p className="text-sm sm:text-base text-gray-700 mb-5 text-center leading-relaxed font-light">
                      {item.description}
                    </p>
                    
                    <div className="text-center">
                      <div className="inline-block bg-white/60 px-6 py-2 rounded-full border border-sakura-pink/30 shadow-sm">
                        <span className="text-xl sm:text-2xl font-bold text-rose-600" style={{ fontFamily: "'Noto Serif JP', serif" }}>
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Sakura Petal Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-4 right-8 text-4xl animate-float">🌸</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Traditional Footer Decoration */}
          <div className="mt-16 flex justify-center">
            <div className="text-center">
              <Coffee size={64} className="text-rose-400 mx-auto mb-3 opacity-60" strokeWidth={1.5} />
              <p className="text-sm text-gray-600 font-light italic">Served with tradition and care</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reserve Section */}
      <section id="reserve" ref={reserveSectionRef} className="reserve-section py-12 sm:py-20 px-4 sm:px-8 bg-gradient-to-b from-cream to-sky-blue/10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-bold text-center mb-3 sm:mb-4 text-sky-blue">Reserve a Table</h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 text-base sm:text-lg">Experience the magic in person</p>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-sakura-pink/20">
            <div className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-sky-blue font-semibold">Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-2 border-sakura-pink/30 focus:border-sakura-pink rounded-xl"
                  placeholder="Your name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="date" className="text-sky-blue font-semibold">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="mt-2 border-sakura-pink/30 focus:border-sakura-pink rounded-xl"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="guests" className="text-sky-blue font-semibold">Number of Guests</Label>
                <Input
                  id="guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.guests}
                  onChange={handleInputChange}
                  className="mt-2 border-sakura-pink/30 focus:border-sakura-pink rounded-xl"
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-sakura-pink hover:bg-sakura-pink/90 text-white py-4 sm:py-6 text-base sm:text-lg rounded-full shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Confirm Reservation
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-blue/20 py-8 sm:py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
            <div className="text-center md:text-left">
              <div className="text-xl sm:text-2xl font-bold text-sakura-pink mb-2">桜 Sakura Dream Cafe</div>
              <p className="text-sm sm:text-base text-gray-600">A taste of Japanese serenity</p>
            </div>
            
            <div className="flex gap-6 sm:gap-8">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sky-blue hover:text-sakura-pink transition-colors duration-300 p-2">
                <Instagram size={24} className="sm:w-7 sm:h-7" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-sky-blue hover:text-sakura-pink transition-colors duration-300 p-2">
                <Facebook size={24} className="sm:w-7 sm:h-7" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sky-blue hover:text-sakura-pink transition-colors duration-300 p-2">
                <Twitter size={24} className="sm:w-7 sm:h-7" />
              </a>
            </div>
            
            <div className="flex flex-col gap-2 text-center md:text-left text-sm sm:text-base text-gray-600">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail size={18} className="text-sky-blue sm:w-5 sm:h-5" />
                <span className="break-all">hello@sakuradream.cafe</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Phone size={18} className="text-sky-blue sm:w-5 sm:h-5" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-sky-blue/30 text-xs sm:text-sm text-gray-500">
            © 2025 Sakura Dream Cafe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;