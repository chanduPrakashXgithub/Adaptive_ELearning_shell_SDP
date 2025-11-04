import React, { useEffect, useState } from 'react';
import brainNetworkBg from '../../assets/brain-network-bg.jpg';
import libraryStudyBg from '../../assets/library-study-bg.jpg';
import growthLearningBg from '../../assets/growth-learning-bg.jpg';

interface ScrollingBackgroundProps {
  children: React.ReactNode;
}

const ScrollingBackground: React.FC<ScrollingBackgroundProps> = ({ children }) => {
  const [scrollY, setScrollY] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    brainNetworkBg,
    libraryStudyBg,
    growthLearningBg
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrollY(scrollPosition);
      
      // Change background based on scroll position
      const windowHeight = window.innerHeight;
      const imageIndex = Math.floor(scrollPosition / (windowHeight * 0.8));
      setCurrentImageIndex(Math.min(imageIndex, backgroundImages.length - 1));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [backgroundImages.length]);

  return (
    <div className="relative min-h-screen">
      {/* Fixed Background Container */}
      <div className="fixed inset-0 w-full h-full overflow-hidden" style={{ zIndex: -1 }}>
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-90' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              transform: `translateY(${scrollY * 0.3}px) scale(1.05)`,
            }}
          />
        ))}
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Animated Geometric Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large floating circles */}
          {[...Array(5)].map((_, i) => (
            <div
              key={`circle-${i}`}
              className="absolute rounded-full bg-white/10 animate-pulse"
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                left: `${10 + i * 20}%`,
                top: `${10 + i * 15}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + i}s`,
                transform: `translateY(${scrollY * (0.1 + i * 0.05)}px)`,
              }}
            />
          ))}
          
          {/* Small floating particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-white/30 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                transform: `translateY(${scrollY * (0.05 + Math.random() * 0.15)}px)`,
              }}
            />
          ))}
          
          {/* Geometric lines */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`line-${i}`}
              className="absolute bg-gradient-to-r from-transparent via-white/20 to-transparent"
              style={{
                width: '200px',
                height: '1px',
                left: `${i * 15}%`,
                top: `${20 + i * 10}%`,
                transform: `translateY(${scrollY * (0.08 + i * 0.02)}px) rotate(${i * 15}deg)`,
              }}
            />
          ))}
        </div>
        
        {/* Animated Overlay Gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-purple-900/20 transition-all duration-1000"
          style={{
            transform: `translateY(${scrollY * 0.3}px)`,
          }}
        />
      </div>

      {/* Content Overlay with glass morphism */}
      <div className="relative z-10 backdrop-blur-sm">
        <div className="bg-gradient-to-b from-transparent via-white/80 to-white/90">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ScrollingBackground;