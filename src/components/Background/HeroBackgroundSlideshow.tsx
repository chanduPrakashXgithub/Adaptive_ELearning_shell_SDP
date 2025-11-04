import React, { useEffect, useState } from 'react';

interface HeroBackgroundSlideshowProps {
  children: React.ReactNode;
}

const HeroBackgroundSlideshow: React.FC<HeroBackgroundSlideshowProps> = ({ children }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    'https://res.cloudinary.com/di76jopyu/image/upload/v1757481863/pang-yuhao-_kd5cxwZOK4-unsplash_siu1le.jpg',
    'https://res.cloudinary.com/di76jopyu/image/upload/v1757481876/kumas_taverne-SiOJXlWeWc0-unsplash_erfwb3.jpg',
    'https://res.cloudinary.com/di76jopyu/image/upload/v1757481877/growtika-nGoCBxiaRO0-unsplash_ubwxiu.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 6000); // Change every 6 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image Slideshow */}
      <div className="absolute inset-0 w-full h-full">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
        ))}
        
        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/40" />
        
        {/* Additional overlay for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen">
        {children}
      </div>
    </section>
  );
};

export default HeroBackgroundSlideshow;