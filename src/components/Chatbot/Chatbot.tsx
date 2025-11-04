import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Lightbulb,
  BookOpen,
  Target,
  BarChart3
} from 'lucide-react';
import { generateDynamicResponse } from './engine';

interface Message {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

interface ChatbotProps {
  modules?: Array<{ id: number | string; title: string; progress?: number; status?: string; topics?: string[] }>;
  interviewPlan?: any;
}

const Chatbot: React.FC<ChatbotProps> = ({ modules = [], interviewPlan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi there! I'm your AI learning assistant 🤖 I'm here to help with your studies, recommend learning paths, and have friendly chats. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
      suggestions: ["Show my progress", "Recommend next course", "Study tips", "Quick quiz"]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = {
    greeting: [
      "Hello! How can I assist you with your learning journey today?",
      "Hi there! Ready to learn something new?",
      "Hey! I'm here to help you succeed. What's on your mind?"
    ],
    progress: [
      "You're doing great! You've completed 2 out of 4 courses. Keep up the excellent work! 📈",
      "Your learning streak is impressive! You've studied for 8.1 hours this week. Ready for the next challenge?"
    ],
    recommendations: [
      "Based on your progress in AI fundamentals, I recommend diving into 'Deep Learning Fundamentals' next. It builds perfectly on what you've learned! 🧠",
      "You seem to enjoy hands-on projects. How about trying our 'Neural Networks' course with interactive labs?",
      "Since you're excelling in theory, let's add some practical experience with our coding challenges!"
    ],
    tips: [
      "💡 Study tip: Try the Pomodoro Technique - 25 minutes focused study, 5 minute break. It's scientifically proven to improve retention!",
      "🎯 Pro tip: Teach someone else what you've learned. It's the fastest way to identify knowledge gaps!",
      "📝 Remember to take handwritten notes. Studies show it improves comprehension by 23%!"
    ],
    motivation: [
      "You're amazing! Every expert was once a beginner. Keep pushing forward! 🌟",
      "Learning is a journey, not a destination. You're already on the right path! 🚀",
      "Progress over perfection! You're building skills that will last a lifetime! 💪"
    ]
  };

  const staticGenerateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('progress') || message.includes('how am i doing')) {
      return botResponses.progress[Math.floor(Math.random() * botResponses.progress.length)];
    }
    if (message.includes('recommend') || message.includes('next') || message.includes('course')) {
      return botResponses.recommendations[Math.floor(Math.random() * botResponses.recommendations.length)];
    }
    if (message.includes('tip') || message.includes('help') || message.includes('study')) {
      return botResponses.tips[Math.floor(Math.random() * botResponses.tips.length)];
    }
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    }
    if (message.includes('motivation') || message.includes('encourage') || message.includes('difficult')) {
      return botResponses.motivation[Math.floor(Math.random() * botResponses.motivation.length)];
    }
    
    // Default responses for general conversation
    const defaultResponses = [
      "That's interesting! Can you tell me more about what you're working on?",
      "I'm here to help! What specific area would you like to focus on?",
      "Great question! Let me think about how I can best assist you with that.",
      "I love your curiosity! Learning is all about asking questions. What else would you like to know?",
      "That sounds challenging! I'm here to help you work through it. What's your biggest concern?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async (messageContent?: string) => {
    const content = messageContent || inputValue.trim();
    if (!content) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const dynamic = generateDynamicResponse(content, { modules, interviewPlan });
      const botResponse = dynamic || staticGenerateBotResponse(content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        isBot: true,
        timestamp: new Date(),
        suggestions: content.toLowerCase().includes('recommend') || !!dynamic ? ["More courses", "Study schedule", "Learning path"] : 
                    content.toLowerCase().includes('progress') ? ["Detailed analytics", "Set goals", "Achievements"] :
                    ["Ask another question", "Study tips", "Course recommendations"]
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full w-14 h-14 bg-hero-gradient shadow-lg hover:shadow-glow transition-all duration-500 hover:scale-110"
          >
            <Bot className="w-6 h-6" />
          </Button>
        )}
        
        {/* Chat Window */}
        {isOpen && (
          <div className="fixed bottom-20 right-6 z-50 animate-scale-in">
            <Card className="w-80 h-[500px] shadow-card-hover flex flex-col bg-background border-2">
              <CardHeader className="flex flex-row items-center justify-between p-4 bg-hero-gradient text-primary-foreground rounded-t-lg">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <CardTitle className="text-sm">AI Learning Assistant</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-primary-foreground hover:bg-white/20 transition-colors duration-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0 bg-background">
                <ScrollArea className="flex-1 p-4 max-h-80">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex transition-all duration-500 ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                        <div className={`flex gap-2 max-w-[85%] transition-all duration-500 ${message.isBot ? 'flex-row animate-fade-in' : 'flex-row-reverse animate-fade-in'}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${
                            message.isBot ? 'bg-primary text-primary-foreground' : 'bg-accent text-accent-foreground'
                          }`}>
                            {message.isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className={`rounded-lg p-3 text-sm transition-all duration-300 hover:scale-[1.02] ${
                              message.isBot 
                                ? 'bg-muted text-foreground' 
                                : 'bg-primary text-primary-foreground'
                            }`}>
                              {message.content}
                            </div>
                            {message.suggestions && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-6 px-2 transition-all duration-300 hover:scale-105 hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start animate-fade-in">
                        <div className="flex gap-2 max-w-[85%]">
                          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="bg-muted text-foreground rounded-lg p-3 text-sm">
                            <div className="flex gap-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDuration: '1s'}} />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s', animationDuration: '1s'}} />
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.4s', animationDuration: '1s'}} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>
                
                <div className="p-4 border-t bg-background">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask me anything..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1 transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                    />
                    <Button 
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isTyping}
                      size="sm"
                      className="transition-all duration-300 hover:scale-105"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex gap-1 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 px-2 transition-all duration-300 hover:scale-105 hover:bg-primary/10"
                      onClick={() => handleSuggestionClick("Show my progress")}
                    >
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Progress
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 px-2 transition-all duration-300 hover:scale-105 hover:bg-accent/10"
                      onClick={() => handleSuggestionClick("Study tips")}
                    >
                      <Lightbulb className="w-3 h-3 mr-1" />
                      Tips
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-6 px-2 transition-all duration-300 hover:scale-105 hover:bg-success/10"
                      onClick={() => handleSuggestionClick("Recommend courses")}
                    >
                      <BookOpen className="w-3 h-3 mr-1" />
                      Courses
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default Chatbot;