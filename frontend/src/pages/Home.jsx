import React, { useState, useEffect, useRef } from 'react';
import { menuItems, mockReservation } from '../mockData';
import { Instagram, Facebook, Twitter, Mail, Phone, Coffee, Flower2, CupSoda, Cake, Cookie, Fish } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

const Home = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [visibleItems, setVisibleItems] = useState([]);
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
      <header className="fixed top-0 left-0 right-0 z-50 px-8 py-4 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="logo text-2xl font-bold text-sakura-pink tracking-wide">
            桜 Sakura Dream Cafe
          </div>
          <nav className="flex gap-8">
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
        </div>
      </header>

      {/* Hero Section with Video Background */}
      <section id="hero" className="hero-section relative h-screen overflow-hidden">
        {/* YouTube Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <iframe
            ref={videoRef}
            className="absolute top-1/2 left-1/2 w-[177.77vh] h-[56.25vw] min-w-full min-h-full transform -translate-x-1/2 -translate-y-1/2"
            src="https://www.youtube.com/embed/oylirMJXN08?si=cU8Zk1kZP_IFC5Uu&controls=0&start=7&autoplay=1&mute=1&loop=1&playlist=oylirMJXN08&enablejsapi=1"
            title="Cafe Background"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 hero-content">
          <h1 className="text-6xl md:text-8xl font-bold text-cream mb-4 tracking-wider">
            桜 Dream Cafe
          </h1>
          <p className="text-xl md:text-2xl text-cream/90 mb-8 max-w-2xl">
            Where tranquility meets flavor in every sip
          </p>
          <Button
            onClick={() => scrollToSection('menu')}
            className="bg-sakura-pink hover:bg-sakura-pink/90 text-white px-8 py-6 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            View Menu
          </Button>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" ref={menuSectionRef} className="menu-section py-20 px-8 bg-cream">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4 text-sky-blue">Our Menu</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Handcrafted with love and tradition</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {menuItems.map((item, index) => {
              const IconComponent = iconComponents[item.icon];
              return (
                <div
                  key={item.id}
                  data-item-id={item.id}
                  className={`menu-card bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border-2 border-sakura-pink/20 ${
                    visibleItems.includes(String(item.id)) ? 'fade-in-visible' : 'fade-in-hidden'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-center mb-4">
                    {IconComponent && <IconComponent size={60} className="text-sakura-pink" />}
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-sky-blue">{item.name}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <div className="text-2xl font-bold text-sakura-pink">{item.price}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reserve Section */}
      <section id="reserve" ref={reserveSectionRef} className="reserve-section py-20 px-8 bg-gradient-to-b from-cream to-sky-blue/10">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-5xl font-bold text-center mb-4 text-sky-blue">Reserve a Table</h2>
          <p className="text-center text-gray-600 mb-12 text-lg">Experience the magic in person</p>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-xl border-2 border-sakura-pink/20">
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
                className="w-full bg-sakura-pink hover:bg-sakura-pink/90 text-white py-6 text-lg rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Confirm Reservation
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-sky-blue/20 py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <div className="text-2xl font-bold text-sakura-pink mb-2">桜 Sakura Dream Cafe</div>
              <p className="text-gray-600">A taste of Japanese serenity</p>
            </div>
            
            <div className="flex gap-6">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sky-blue hover:text-sakura-pink transition-colors duration-300">
                <Instagram size={28} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-sky-blue hover:text-sakura-pink transition-colors duration-300">
                <Facebook size={28} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-sky-blue hover:text-sakura-pink transition-colors duration-300">
                <Twitter size={28} />
              </a>
            </div>
            
            <div className="flex flex-col gap-2 text-gray-600">
              <div className="flex items-center gap-2">
                <Mail size={20} className="text-sky-blue" />
                <span>hello@sakuradream.cafe</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={20} className="text-sky-blue" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-sky-blue/30 text-gray-500">
            © 2025 Sakura Dream Cafe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;