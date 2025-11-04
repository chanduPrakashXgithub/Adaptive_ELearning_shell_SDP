# Adaptive Learning Platform - Project Documentation

## Project Overview

This is an **Adaptive Learning Management System (LMS)** built with React, TypeScript, Tailwind CSS, and Supabase. The platform provides personalized learning experiences with AI-powered recommendations, progress tracking, and comprehensive assessment tools.

## Core Features

### 1. **Adaptive Learning System**
- **Theory Content**: Rich text educational content with markdown/HTML support
- **Quizzes**: Interactive practice assessments with instant feedback
- **Tests**: Formal evaluations in fullscreen restrictive mode
- **Progress Tracking**: Real-time monitoring of learning journey
- **Time Tracking**: Automatic tracking of time spent on modules

### 2. **User Dashboard**
- **Learning Statistics**: 
  - Courses enrolled
  - Hours learned (calculated from actual time spent)
  - Certificates earned
  - Average quiz/test scores
- **Module Progress**: Visual progress bars for each enrolled module
- **AI Recommendations**: Personalized learning suggestions based on progress
- **Learning Streak**: Daily activity tracking with streak calculation
- **Weekly Activity**: 7-day activity chart showing study patterns
- **Recent Achievements**: Dynamic achievement system

### 3. **Assessment System**
- **Fullscreen Mode**: Exams run in fullscreen with navbar hidden
- **Restrictive Mode**: Prevents tab switching and navigation during tests
- **Question Navigation**: Browse and review questions before submission
- **Automatic Scoring**: Immediate results with percentage scores
- **Progress Persistence**: All attempts saved to database

### 4. **Interview Preparation**
- **Interview Planner**: AI-powered interview prep tool
- **Personalized Plans**: Custom study plans for interviews

### 5. **Study Resources**
- **Posts System**: Curated learning materials
- **Resource Library**: Comprehensive educational content
- **3D Visualizations**: Interactive 3D models for enhanced learning

## Technical Architecture

### Frontend Stack
- **Framework**: React 18.3+ with TypeScript
- **Routing**: React Router DOM v6
- **UI Library**: shadcn/ui components with Radix UI
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: React Hooks (useState, useEffect, custom hooks)
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for analytics visualization
- **3D Graphics**: React Three Fiber for 3D scenes

### Backend (Supabase)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password
- **Real-time**: Real-time subscriptions for live updates
- **Edge Functions**: Serverless functions for content ingestion
- **Storage**: File storage with secure access policies

### Database Schema

#### Core Tables
1. **modules**: Learning modules/courses
   - id, slug, title, description
   - Created/updated timestamps

2. **theory_contents**: Educational content
   - module_id, content (markdown/HTML)
   - Version control, license info
   - Format: markdown/html

3. **quizzes & quiz_questions**: Practice assessments
   - Multiple choice questions
   - Correct answers and explanations
   - Order indexing for question sequence

4. **tests & test_questions**: Formal evaluations
   - Similar structure to quizzes
   - Used in restrictive fullscreen mode

5. **user_module_progress**: Student progress tracking
   - theory_completed, quizzes_attempted, tests_attempted
   - time_spent_seconds, percent_complete
   - last_activity_at timestamp

6. **quiz_attempts & test_attempts**: Assessment results
   - user_id, answers (JSONB), score
   - started_at, completed_at timestamps

7. **user_activity_tracking**: Detailed activity logs
   - activity_type, time_spent_seconds
   - session_start, session_end
   - metadata (JSONB) for additional info

8. **profiles**: User profile information
   - display_name, avatar_url, bio

#### Database Functions
- **calculate_learning_streak**: Calculates user's learning streak
  - Returns: current_streak, best_streak, total_days
  - Security: DEFINER with user UUID parameter

- **update_module_progress_from_activity**: Trigger function
  - Updates progress when activity is logged
  - Automatically calculates completion percentage

### Design System

#### Color Tokens (HSL format)
- **Primary**: Purple (262° 90% 60%)
- **Accent**: Blue (210° 100% 56%)
- **Success**: Green (142° 76% 36%)
- **Warning**: Orange (38° 92% 50%)
- **Destructive**: Red (0° 84% 60%)

#### Semantic Colors
- Educational theme with book-brown, library-green
- Hero gradients from blue to cyan
- Card shadows with depth levels (1-3)
- Glow effects for emphasis

#### Typography & Layout
- Responsive grid layouts
- Mobile-first approach
- Container max-width: 1400px
- Radius: 0.75rem standard

## Key Components

### Custom Hooks
1. **useDashboardData**: Fetches and calculates dashboard statistics
2. **useModuleProgress**: Manages individual module progress
3. **useActivityTracking**: Tracks and calculates learning activity
4. **useToast**: Toast notifications system

### Major Components
1. **Dashboard**: Main learning hub
2. **FullscreenWrapper**: Fullscreen/restrictive mode for assessments
3. **Navbar**: Navigation with authentication
4. **Chatbot**: AI-powered learning assistant
5. **InterviewPlanner**: Interview preparation tool
6. **ContentRenderer**: Renders markdown/HTML content
7. **Scene3D**: 3D visualization components

## Data Flow

### Progress Tracking
1. User starts theory/quiz/test
2. Time tracking begins automatically
3. Activity logged to `user_activity_tracking`
4. Trigger updates `user_module_progress`
5. Dashboard fetches and displays updated stats

### Score Calculation
1. All quiz/test attempts stored with scores
2. Average calculated from all attempts
3. Displayed on dashboard with comparison to previous sessions
4. Stats stored in localStorage for change tracking

### Activity Tracking
1. Daily activity aggregated from `user_activity_tracking`
2. Streak calculated using database function
3. Weekly chart shows last 7 days
4. Hours calculated from total seconds

## Security

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Public read access for modules, quizzes, tests, theory
- Write access restricted to authenticated users

### Authentication
- Supabase Auth with JWT tokens
- Protected routes using ProtectedRoute component
- Session persistence via localStorage

## Assessment Features

### Fullscreen/Restrictive Mode
- Automatically enters fullscreen on test start
- Navbar hidden during assessments
- Keyboard shortcuts blocked (F12, Ctrl+T, Alt+Tab, etc.)
- Context menu disabled
- Tab visibility tracking
- Escape key to exit

### Question Management
- Sequential question presentation
- Answer selection persistence
- Previous/Next navigation
- Progress indicator
- Submit with confirmation

## API Integration

### Content Ingestion
- Edge function: `ingest-content`
- Uses Firecrawl API for web scraping
- Processes and stores educational content
- Requires FIRECRAWL_API_KEY secret

### AI Features
- AI-powered recommendations based on progress
- Personalized learning paths
- Interview preparation assistance

## Performance Optimizations

1. **Lazy Loading**: Components loaded on demand
2. **Memoization**: useMemo for expensive calculations
3. **Batch Updates**: Multiple state updates combined
4. **Real-time Subscriptions**: Only where necessary
5. **Image Optimization**: Responsive images with proper sizing

## Environment & Configuration

### Required Secrets
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- FIRECRAWL_API_KEY

### Config Files
- `tailwind.config.ts`: Tailwind configuration
- `vite.config.ts`: Vite build configuration
- `supabase/config.toml`: Supabase project config

## Deployment

### Build Process
1. `npm run build` - Production build
2. Static files generated in `dist/`
3. Can be deployed to any static hosting

### Supabase Setup
1. Migrations auto-applied from `supabase/migrations/`
2. Edge functions deployed automatically
3. RLS policies enforced at database level

## Future Enhancements

### Planned Features
1. **More Learning Modules**: Expand course catalog
2. **Video Content**: Support for video lessons
3. **Discussion Forums**: Student community features
4. **Certifications**: Formal certificate generation
5. **Mobile App**: Native mobile experience
6. **Advanced Analytics**: Detailed learning insights
7. **Gamification**: Badges, points, leaderboards
8. **Collaborative Learning**: Group study features

### Technical Improvements
1. **Caching Layer**: Redis for performance
2. **CDN Integration**: Faster content delivery
3. **Advanced Search**: Full-text search across content
4. **Offline Mode**: Progressive Web App (PWA)
5. **Accessibility**: WCAG 2.1 AA compliance

## Development Guidelines

### Code Standards
- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting
- Component-based architecture
- Custom hooks for reusable logic

### Best Practices
1. Use semantic HTML
2. Follow design system tokens
3. Implement error boundaries
4. Handle loading states
5. Provide user feedback
6. Optimize for mobile first
7. Ensure accessibility

## Support & Documentation

- **Docs**: Available in `/docs` folder
- **Issues**: Track in GitHub Issues
- **Discussions**: Use GitHub Discussions
- **Contributing**: See CONTRIBUTING.md

## License & Credits

- **License**: MIT (or your chosen license)
- **Framework**: React by Meta
- **UI Components**: shadcn/ui & Radix UI
- **Backend**: Supabase
- **Icons**: Lucide React

---

**Last Updated**: 2025-11-03
**Version**: 1.0.0
**Maintainers**: Development Team
