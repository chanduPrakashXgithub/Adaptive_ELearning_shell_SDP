import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, BookOpen, Users, GraduationCap } from 'lucide-react';
import studentsLearning from '@/assets/students-learning.jpg';
import studyBg from '@/assets/books-study.jpg';
import learningBg from '@/assets/learning-bg.jpg';
import studentActivities from '@/assets/student-activities.jpg';

const ImageGallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = [
    {
      src: studentsLearning,
      title: 'Collaborative Learning',
      description: 'Students working together in modern study environments',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      src: studyBg,
      title: 'Knowledge Foundation',
      description: 'Building strong academic foundations through comprehensive resources',
      icon: BookOpen,
      color: 'from-green-500 to-emerald-500'
    },
    {
      src: learningBg,
      title: 'Interactive Learning',
      description: 'Engaging educational experiences that inspire growth',
      icon: GraduationCap,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      src: studentActivities,
      title: 'Student Success',
      description: 'Empowering students to achieve their academic goals',
      icon: Users,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-6">
      {/* Main Display */}
      <Card className="relative overflow-hidden shadow-depth-3 hover:shadow-depth-3 transition-all duration-500 group">
        <div className="relative h-96 overflow-hidden">
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${images[currentIndex].color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              {React.createElement(images[currentIndex].icon, { className: "w-5 h-5" })}
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Educational
              </Badge>
            </div>
            <h3 className="text-2xl font-bold mb-2">{images[currentIndex].title}</h3>
            <p className="text-white/90">{images[currentIndex].description}</p>
          </div>
        </div>
        
        {/* Navigation Buttons */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </Card>

      {/* Thumbnail Strip */}
      <div className="flex gap-3 justify-center">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`relative h-20 w-32 rounded-lg overflow-hidden transition-all duration-300 ${
              index === currentIndex 
                ? 'ring-2 ring-primary scale-105 shadow-depth-2' 
                : 'hover:scale-102 opacity-70 hover:opacity-100'
            }`}
          >
            <img
              src={image.src}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${image.color} opacity-20`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;