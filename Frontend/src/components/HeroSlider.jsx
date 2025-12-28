import React, { useState, useEffect } from 'react';

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    productImage: "https://resource.logitechg.com/w_692,c_lpad,ar_4:3,q_auto:best,f_auto,b_rgb:000000/content/dam/gaming/en/products/g502-lightspeed-gaming-mouse/g502-lightspeed-hero.png",
    title: "Pro Gaming Gear",
    subtitle: "RGB Mechanical Keyboards & Precision Mice.",
    cta: "Shop Accessories",
    category: "Accessories",
    align: "text-left"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
    title: "Power Your Work",
    subtitle: "High-performance workstations for professionals.",
    cta: "Shop Laptops",
    category: "Laptops",
    align: "text-center"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070&auto=format&fit=crop",
    title: "Upgrade Your Core",
    subtitle: "SSDs, RAM, and Batteries for instant speed.",
    cta: "Shop Storage",
    category: "Storage",
    align: "text-right"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=2070&auto=format&fit=crop",
    title: "Stay Connected",
    subtitle: "Hubs, Cables, and Chargers for every device.",
    cta: "Shop Adapters",
    category: "Adapters",
    align: "text-center"
  }
];

const HeroSlider = ({ onClickCategory }) => {
  const [current, setCurrent] = useState(0);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); 
    return () => clearInterval(timer);
  }, [current]);

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900 group">
      
      {slides.map((slide, index) => (
        <div 
          key={slide.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* Background Image (Darkened) */}
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <img 
            src={slide.image} 
            alt={slide.title} 
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-[10000ms]"
          />

          {/* Slide Content */}
          <div className="absolute inset-0 z-20 container mx-auto px-6 h-full flex items-center">
            
            {/* SPECIAL LAYOUT FOR SLIDE 1 (Product Image) */}
            {slide.productImage ? (
              <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                {/* Text Side */}
                <div className="md:w-1/2 text-left text-white animate-slide-up">
                  <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full mb-4 tracking-wider">NEW ARRIVAL</span>
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-xl">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 text-gray-200 font-medium max-w-lg">
                    {slide.subtitle}
                  </p>
                  <button 
                    onClick={() => onClickCategory && onClickCategory(slide.category)}
                    className="bg-white text-gray-900 hover:bg-gray-200 font-bold py-3 px-8 rounded-full transition transform hover:scale-105 shadow-xl flex items-center gap-2"
                  >
                    {slide.cta}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                  </button>
                </div>
                
                {/* Image Side (Floating) */}
                <div className="md:w-1/2 flex justify-center animate-float hidden md:flex">
                   <img 
                     src={slide.productImage} 
                     alt="Product" 
                     className="w-full max-w-md object-contain drop-shadow-2xl filter hover:brightness-110 transition duration-500" 
                   />
                </div>
              </div>
            ) : (
              /* STANDARD LAYOUT FOR OTHER SLIDES */
              <div className={`w-full flex ${
                slide.align === 'text-left' ? 'justify-start' : 
                slide.align === 'text-right' ? 'justify-end' : 'justify-center'
              }`}>
                <div className={`max-w-2xl text-white ${
                  slide.align === 'text-left' ? 'text-left' : 
                  slide.align === 'text-right' ? 'text-right' : 'text-center'
                }`}>
                  <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg animate-slide-up">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 text-gray-200 drop-shadow-md font-medium">
                    {slide.subtitle}
                  </p>
                  <button 
                    onClick={() => onClickCategory && onClickCategory(slide.category)}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105 shadow-xl"
                  >
                    {slide.cta}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      ))}

      {/* CONTROLS (Arrows) */}
      <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white transition opacity-0 group-hover:opacity-100 border border-white/20">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/30 backdrop-blur-sm text-white transition opacity-0 group-hover:opacity-100 border border-white/20">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
      </button>

      {/* DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? "bg-red-600 w-8" : "bg-white/50 w-2 hover:bg-white"
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroSlider;