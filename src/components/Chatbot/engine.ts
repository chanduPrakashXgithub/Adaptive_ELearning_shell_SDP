export interface ChatbotModule {
  id: number | string;
  title: string;
  progress?: number;
  status?: string;
  topics?: string[];
}

export interface WeeklyPlan {
  week: number;
  title: string;
  concepts: string[];
  problems: number;
  notes: string;
  tasks: string[];
}

export interface CompanyProfile {
  focus: string[];
  tags: string[];
  popularQuestions: string[];
  plan: Record<string, {
    concepts: string[];
    problems: number;
    notes: string;
  }>;
  behavioral: string[];
}

export interface InterviewPlan {
  role: string;
  companies: string[];
  primaryCompany: string;
  daysUntil: number;
  weeks: number;
  companyProfile?: CompanyProfile;
  plan: WeeklyPlan[];
  dailySchedule: Array<{
    day: number;
    tasks: string[];
    problems: string[];
  }>;
}

export interface BotContext {
  modules?: ChatbotModule[];
  interviewPlan?: InterviewPlan | null;
}

const containsAny = (text: string, keywords: string[]): boolean => {
  const t = text.toLowerCase();
  return keywords.some(k => t.includes(k.toLowerCase()));
};

const findMentionedModule = (text: string, modules?: ChatbotModule[]) => {
  if (!modules || modules.length === 0) return undefined;
  const lower = text.toLowerCase();
  return modules.find(m => lower.includes(m.title.toLowerCase()) || (m.topics || []).some(tp => lower.includes(tp.toLowerCase())));
};

export function generateDynamicResponse(userMessage: string, ctx: BotContext): string | null {
  const msg = userMessage.trim();
  if (!msg) return null;

  const { modules = [], interviewPlan } = ctx;

  // Interview planning questions
  if (containsAny(msg, ['interview', 'prepare', 'plan', 'roadmap'])) {
    if (interviewPlan) {
      const firstWeek = interviewPlan.plan[0];
      return `Your ${interviewPlan.daysUntil}-day interview plan for ${interviewPlan.role} (${interviewPlan.companies.join(', ')}): Week 1 focus on ${firstWeek.concepts.join(', ')}. Would you like a day-by-day checklist?`;
    }
    return 'Tell me your target role, companies, and the interview date, and I will craft a focused plan for you.';
  }

  // Recommendations based on current modules
  if (containsAny(msg, ['what next', 'recommend', 'next', 'suggest'])) {
    const notStarted = modules.filter(m => (m.progress ?? 0) === 0 || (m.status || '') === 'Not Started');
    const inProgress = modules.filter(m => (m.progress ?? 0) > 0 && (m.progress ?? 0) < 100);
    const pick = inProgress.sort((a, b) => (a.progress ?? 0) - (b.progress ?? 0))[0] || notStarted[0] || modules[0];
    if (pick) {
      const topics = (pick.topics && pick.topics.length) ? ` (start with: ${pick.topics.slice(0, 3).join(', ')})` : '';
      return `I recommend continuing "${pick.title}"${topics}. Want me to create a 3-day micro-plan for it?`;
    }
  }

  // Doubts about a module or topic
  if (containsAny(msg, ['doubt', 'confused', 'explain', 'understand', 'help'])) {
    const mentioned = findMentionedModule(msg, modules);
    if (mentioned) {
      const t = mentioned.topics && mentioned.topics.length ? mentioned.topics[0] : 'key concept';
      return `For ${mentioned.title}, break it down: 1) Revisit the definition of ${t}. 2) Work a simple example. 3) Implement a tiny exercise. 4) Do 3 quiz questions. Want practice questions on ${t}?`;
    }
    return 'Tell me which module or topic you are stuck on, and I will break it down with examples and quick practice.';
  }

  // Quizzes
  if (containsAny(msg, ['quiz', 'questions', 'practice'])) {
    const mentioned = findMentionedModule(msg, modules) || modules[0];
    if (mentioned) {
      const t1 = mentioned.topics?.[0] || 'core concepts';
      return `Here are quick practice prompts for ${mentioned.title}:
1) Define ${t1} in your own words.
2) Solve a small problem using ${t1}.
3) Identify a real-world use-case for ${t1}. Want more?`;
    }
  }

  // Progress
  if (containsAny(msg, ['progress', 'how am i doing', 'status'])) {
    if (modules.length) {
      const completed = modules.filter(m => (m.progress ?? 0) >= 100).length;
      const avg = Math.round(modules.reduce((sum, m) => sum + (m.progress ?? 0), 0) / modules.length);
      return `You have ${completed}/${modules.length} modules completed. Average progress: ${avg}%. Keep it up!`;
    }
  }

  return null;
}
