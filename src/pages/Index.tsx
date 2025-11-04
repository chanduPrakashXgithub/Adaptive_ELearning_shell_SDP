import React from 'react';
import Layout from '@/components/Layout/Layout';
import SimpleScene3D from '@/components/3D/SimpleScene3D';
import ImageGallery from '@/components/Gallery/ImageGallery';
import ScrollingBackground from '@/components/Background/ScrollingBackground';
import HeroBackgroundSlideshow from '@/components/Background/HeroBackgroundSlideshow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Lightbulb,
  Target,
  BarChart3,
  Users,
  Shield,
  ChevronRight,
  Star,
  CheckCircle,
  GraduationCap,
  Library,
  PenTool,
  Award
} from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Comprehensive Library',
      description: 'Access thousands of books, articles, and educational resources from world-class institutions.',
      color: 'text-primary',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Lightbulb,
      title: 'Interactive Learning',
      description: 'Engage with dynamic content, quizzes, and hands-on projects that make learning memorable.',
      color: 'text-accent',
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'Study Groups',
      description: 'Join collaborative study sessions and connect with fellow learners worldwide.',
      color: 'text-success',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: BarChart3,
      title: 'Progress Tracking',
      description: 'Monitor your learning journey with detailed analytics and achievement milestones.',
      color: 'text-warning',
      gradient: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Library,
      title: 'Digital Campus',
      description: 'Experience a virtual learning environment that adapts to your schedule and preferences.',
      color: 'text-primary',
      gradient: 'from-teal-500 to-blue-500'
    },
    {
      icon: Award,
      title: 'Certifications',
      description: 'Earn recognized certificates and credentials to advance your career and education.',
      color: 'text-muted-foreground',
      gradient: 'from-rose-500 to-pink-500'
    }
  ];

  const testimonials = [
    {
      name: 'CHANDU PRAKASH',
      role: 'VIT-AP STUDENT',
      content: 'The adaptive learning algorithms helped me master machine learning concepts 3x faster than traditional courses.',
      rating: 5
    },
    {
      name: 'CH.VAMSI',
      role: 'VIT-AP STUDENT',
      content: 'The personalized learning path was exactly what I needed to advance my career. Highly recommended!',
      rating: 5
    },
    {
      name: 'PRANEETHA NISYY',
      role: 'VIT-AP STUDENT',
      content: 'As an educator, I\'m impressed by how this platform adapts to different learning styles and paces.',
      rating: 5
    }
  ];

  return (
    <ScrollingBackground>
      <Layout>
        {/* Hero Section with Background Slideshow */}
        <HeroBackgroundSlideshow>
          <div className="container mx-auto px-4 py-20 lg:py-32 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <Badge variant="secondary" className="mb-6 bg-white/95 dark:bg-gray-900/95 text-primary border border-white/20 dark:border-gray-700/50 hover-scale backdrop-blur-sm">
                  📚 Modern Educational Platform
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-white drop-shadow-lg">
                  Transform Your
                  <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-yellow-200 bg-clip-text text-transparent animate-fade-in">
                    Learning Journey
                  </span>
                </h1>
                <p className="text-xl text-white/95 leading-relaxed drop-shadow-md">
                  Discover a revolutionary educational experience with interactive 3D content,
                  comprehensive study materials, and personalized learning paths designed for modern students.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="bg-white hover:bg-white/90 text-primary hover:scale-105 transition-all duration-300 shadow-lg font-semibold">
                    Start Learning Free
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button size="lg" variant="outline" className="border-white bg-white/20 text-white hover:bg-white/30 hover:border-white hover-scale backdrop-blur-sm font-semibold">
                    Explore Platform
                  </Button>
                </div>
              </div>

              {/* 3D Scene */}
              <div className="relative">
                <SimpleScene3D />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400/30 to-orange-500/30 rounded-full opacity-60 animate-pulse" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </HeroBackgroundSlideshow>

        {/* Features Section */}
        <section className="py-20 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Discover Our Educational Excellence
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Innovative learning tools and resources designed to empower students and educators worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Card key={index} className="group shadow-depth-1 hover:shadow-depth-3 transition-all duration-500 hover:-translate-y-2 border-0 bg-card/90 backdrop-blur-sm">
                    <CardHeader>
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-depth-2 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300 text-card-foreground">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed text-muted-foreground">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Image Gallery Section */}
        <section className="py-20 bg-muted/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Experience Our Learning Environment
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Explore our vibrant educational spaces where students thrive and knowledge comes alive.
              </p>
            </div>

            <ImageGallery />
          </div>
        </section>

        {/* Learning Tools Section */}
        <section className="py-20 bg-background/90 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Interactive Learning Tools
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Access specialized applications designed to enhance your educational journey.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="group shadow-depth-1 hover:shadow-depth-3 transition-all duration-500 hover:-translate-y-2 bg-card/90 backdrop-blur-sm border-0">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 text-white shadow-depth-2 group-hover:scale-110 transition-transform duration-300">
                    <PenTool className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-card-foreground">Digital Notebooks</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Smart note-taking with AI-powered organization and collaborative features for enhanced studying.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    Launch Tool
                  </Button>
                </CardContent>
              </Card>

              <Card className="group shadow-depth-1 hover:shadow-depth-3 transition-all duration-500 hover:-translate-y-2 bg-card/90 backdrop-blur-sm border-0">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mb-4 text-white shadow-depth-2 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-card-foreground">Study Groups</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Virtual collaboration spaces for group projects, discussions, and peer learning experiences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-success group-hover:text-success-foreground transition-all duration-300">
                    Launch Tool
                  </Button>
                </CardContent>
              </Card>

              <Card className="group shadow-depth-1 hover:shadow-depth-3 transition-all duration-500 hover:-translate-y-2 bg-card/90 backdrop-blur-sm border-0">
                <CardHeader>
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center mb-4 text-white shadow-depth-2 group-hover:scale-110 transition-transform duration-300">
                    <Library className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-card-foreground">Resource Library</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Comprehensive collection of educational materials, research papers, and multimedia content.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full group-hover:bg-warning group-hover:text-warning-foreground transition-all duration-300">
                    Launch Tool
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-muted/30 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
                Student Success Stories
              </h2>
              <p className="text-xl text-muted-foreground">
                Discover how our platform has transformed learning experiences for students worldwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="group shadow-depth-1 hover:shadow-depth-3 transition-all duration-500 hover:-translate-y-2 bg-card/90 backdrop-blur-sm border-0">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" style={{ animationDelay: `${i * 0.1}s` }} />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6 italic text-lg leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-lg text-card-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-blue-600/95 via-purple-600/95 to-indigo-700/95 text-white relative overflow-hidden backdrop-blur-sm">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8 animate-pulse">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                Begin Your Educational
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Adventure Today
                </span>
              </h2>
              <p className="text-xl opacity-90 mb-10 leading-relaxed">
                Join a community of passionate learners and unlock your potential with cutting-edge educational technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-depth-2 text-lg px-8">
                  Start Learning Free
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="border-white bg-white/20 text-white hover:bg-white/30 hover:scale-105 transition-all duration-300 text-lg px-8">
                  Explore Platform
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-white/90">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </ScrollingBackground>
  );
};

export default Index;
