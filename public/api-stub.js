// Simple API stub for demonstration
// In a real application, this would be replaced with actual backend endpoints

// Mock API endpoint for course recommendations
if (typeof window !== 'undefined') {
  // Override fetch for the recommend endpoint
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (url === '/api/recommend') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          nextLessonId: 42,
          recommendationReason: 'AI analysis based on learning progress',
          adaptiveInsights: {
            difficulty: 'intermediate',
            estimatedCompletionTime: '35 minutes',
            suggestedTopics: ['neural networks', 'gradient descent']
          }
        })
      });
    }
    return originalFetch.apply(this, arguments);
  };
}

console.log('API stub loaded - /api/recommend endpoint is now available');