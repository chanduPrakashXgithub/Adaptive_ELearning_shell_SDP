import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Calendar, Target, Code, Users, Trophy, CheckCircle2 } from 'lucide-react';
import type { InterviewPlan, CompanyProfile, WeeklyPlan } from '@/components/Chatbot/engine';

interface InterviewPlannerProps {
  onPlan: (plan: InterviewPlan) => void;
}

// Company-specific interview preparation data
const COMPANY_PROFILES: Record<string, CompanyProfile> = {
  "Google": {
    focus: ["Algorithms", "Data Structures (Trees, Graphs, DP)", "System Design"],
    tags: ["Graph", "Dynamic Programming", "String", "Math"],
    popularQuestions: ["Word Ladder", "Course Schedule", "Edit Distance", "Median of Two Sorted Arrays"],
    plan: {
      "Week 1": {
        concepts: ["Arrays & Strings", "Hashmap/Hashset", "Sorting & Binary Search"],
        problems: 12,
        notes: "Focus on easy-medium LeetCode problems + hashing basics"
      },
      "Week 2": {
        concepts: ["Trees & Graphs", "Recursion & Backtracking", "Dynamic Programming"],
        problems: 15,
        notes: "Practice Google-specific LeetCode mediums"
      },
      "Week 3": {
        concepts: ["Hard DP", "System Design basics", "Mock Interviews"],
        problems: 10,
        notes: "Mix of hard problems + behavioral + mocks"
      }
    },
    behavioral: ["Googliness", "Teamwork", "Creativity"]
  },
  "Microsoft": {
    focus: ["Arrays", "Strings", "Hashing", "Trees", "OOP"],
    tags: ["Array", "Hashmap", "Binary Search", "Recursion"],
    popularQuestions: ["Longest Palindromic Substring", "Rotate Image", "Binary Tree Zigzag Traversal"],
    plan: {
      "Week 1": {
        concepts: ["Arrays", "Strings", "Basic Recursion"],
        problems: 10,
        notes: "Revise sorting & hashing"
      },
      "Week 2": {
        concepts: ["Binary Trees", "Recursion", "Dynamic Programming"],
        problems: 12,
        notes: "Microsoft tends to repeat recursion/tree problems"
      },
      "Week 3": {
        concepts: ["OOP Design", "Mock Interviews", "Behavioral"],
        problems: 8,
        notes: "Focus on collaboration-driven answers"
      }
    },
    behavioral: ["Collaboration", "Technical Depth"]
  },
  "Amazon": {
    focus: ["Leadership Principles", "Greedy", "Sorting", "Binary Trees", "DP"],
    tags: ["Binary Tree", "Greedy", "Sliding Window"],
    popularQuestions: ["Two Sum", "LRU Cache", "Longest Substring Without Repeating Characters"],
    plan: {
      "Week 1": {
        concepts: ["Arrays & Strings", "Sliding Window"],
        problems: 10,
        notes: "Revise Amazon's common easy-mediums"
      },
      "Week 2": {
        concepts: ["Binary Trees", "Greedy", "Dynamic Programming"],
        problems: 12,
        notes: "Practice Amazon tagged LeetCode"
      },
      "Week 3": {
        concepts: ["Mock Interviews", "Behavioral (STAR)", "System Design Basics"],
        problems: 8,
        notes: "Leadership principles + timed mocks"
      }
    },
    behavioral: ["STAR Method", "Leadership Principles"]
  },
  "Meta": {
    focus: ["Arrays", "Strings", "Backtracking", "Graphs"],
    tags: ["Backtracking", "Matrix", "BFS/DFS"],
    popularQuestions: ["N Queens", "Clone Graph", "Word Search"],
    plan: {
      "Week 1": {
        concepts: ["Arrays & Strings", "Matrix Problems"],
        problems: 10,
        notes: "Focus on array manipulation and string processing"
      },
      "Week 2": {
        concepts: ["Graphs", "Backtracking", "BFS/DFS"],
        problems: 12,
        notes: "Practice Meta's graph and backtracking problems"
      },
      "Week 3": {
        concepts: ["Mock Interviews", "Product Thinking", "System Design"],
        problems: 8,
        notes: "Product-driven mindset + technical depth"
      }
    },
    behavioral: ["Product Thinking", "Impact-driven Mindset"]
  },
  "Apple": {
    focus: ["Low-level system concepts", "Bit Manipulation", "Math", "Trees"],
    tags: ["Bit Manipulation", "Math", "Heap"],
    popularQuestions: ["Single Number III", "Maximum Subarray", "Merge Intervals"],
    plan: {
      "Week 1": {
        concepts: ["Bit Manipulation", "Math Problems"],
        problems: 10,
        notes: "Focus on bit operations and mathematical thinking"
      },
      "Week 2": {
        concepts: ["Trees", "Heaps", "Advanced Data Structures"],
        problems: 12,
        notes: "Practice Apple's tree and heap problems"
      },
      "Week 3": {
        concepts: ["System Concepts", "Mock Interviews", "Low-level Design"],
        problems: 8,
        notes: "System thinking + technical implementation"
      }
    },
    behavioral: ["Innovation", "Attention to Detail"]
  }
};

const MAJOR_COMPANIES = ["Google", "Microsoft", "Amazon", "Meta", "Apple"];

const InterviewPlanner: React.FC<InterviewPlannerProps> = ({ onPlan }) => {
  const [primaryCompany, setPrimaryCompany] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [timeValue, setTimeValue] = useState(3);
  const [timeUnit, setTimeUnit] = useState<'days' | 'weeks'>('weeks');
  const [busy, setBusy] = useState(false);

  const totalDays = useMemo(() => (timeUnit === 'weeks' ? timeValue * 7 : timeValue), [timeUnit, timeValue]);
  const totalWeeks = useMemo(() => Math.max(1, Math.ceil(totalDays / 7)), [totalDays]);

  const selectedCompanyProfile = useMemo(() => {
    return COMPANY_PROFILES[primaryCompany];
  }, [primaryCompany]);

  const generateCompanySpecificPlan = (): InterviewPlan => {
    const weeks = totalWeeks;
    const companyProfile = selectedCompanyProfile;
    
    let plan: WeeklyPlan[] = [];
    
    if (companyProfile && weeks <= 3) {
      // Use company-specific plan for 1-3 weeks
      const weekKeys = [`Week 1`, `Week 2`, `Week 3`].slice(0, weeks);
      plan = weekKeys.map((weekKey, index) => {
        const weekData = companyProfile.plan[weekKey];
        const weekNumber = index + 1;
        
        return {
          week: weekNumber,
          title: weekNumber === 1 ? "Foundations & Easy-Medium Practice" :
                 weekNumber === 2 ? "Intermediate + Company Pattern" :
                 "Advanced + Mock Prep",
          concepts: weekData.concepts,
          problems: weekData.problems,
          notes: weekData.notes,
          tasks: generateDailyTasks(weekNumber, companyProfile, weekData.problems)
        };
      });
    } else {
      // Generate generic plan for longer periods or unknown companies
      const phaseDistribution = distributeWeeksIntoPhases(weeks);
      plan = generateGenericPlan(phaseDistribution, companyProfile);
    }

    // Generate daily schedule
    const dailySchedule = generateDailySchedule(plan, totalDays);

    return {
      role,
      companies: primaryCompany ? [primaryCompany] : [],
      primaryCompany: primaryCompany || 'Generic',
      daysUntil: totalDays,
      weeks: totalWeeks,
      companyProfile,
      plan,
      dailySchedule
    };
  };

  const generateDailyTasks = (weekNumber: number, profile: CompanyProfile, problemCount: number): string[] => {
    const tasksPerWeek = {
      1: [
        `Solve ${Math.ceil(problemCount / 7)} problems daily from ${profile.tags.slice(0, 2).join(', ')}`,
        'Review fundamental concepts (30 min daily)',
        'Practice coding without IDE (whiteboard style)',
        'End-week: Complete 1 timed mock interview'
      ],
      2: [
        `Solve ${Math.ceil(problemCount / 7)} medium problems daily`,
        `Focus on ${profile.tags.slice(0, 3).join(', ')} patterns`,
        'Practice explaining solutions out loud',
        'Mid-week: Review company-specific questions',
        'End-week: Full mock interview with behavioral'
      ],
      3: [
        `Solve ${Math.ceil(problemCount / 7)} hard problems daily`,
        'System design study (1 hour daily)',
        `Practice ${profile.behavioral.join(' & ')} questions`,
        'Daily mock interviews (technical + behavioral)',
        'Final prep: Review all favorite problems'
      ]
    };
    
    return tasksPerWeek[weekNumber as keyof typeof tasksPerWeek] || tasksPerWeek[1];
  };

  const distributeWeeksIntoPhases = (totalWeeks: number) => {
    if (totalWeeks <= 3) return { foundations: 1, intermediate: 1, advanced: 1 };
    if (totalWeeks <= 6) return { 
      foundations: Math.ceil(totalWeeks * 0.4), 
      intermediate: Math.ceil(totalWeeks * 0.4), 
      advanced: Math.floor(totalWeeks * 0.2) 
    };
    return { 
      foundations: Math.ceil(totalWeeks * 0.3), 
      intermediate: Math.ceil(totalWeeks * 0.4), 
      advanced: Math.floor(totalWeeks * 0.3) 
    };
  };

  const generateGenericPlan = (phases: any, profile?: CompanyProfile): WeeklyPlan[] => {
    const plan: WeeklyPlan[] = [];
    let currentWeek = 1;

    // Foundations phase
    for (let i = 0; i < phases.foundations; i++) {
      plan.push({
        week: currentWeek++,
        title: "Foundations & Easy-Medium Practice",
        concepts: ["Arrays & Strings", "Hashmap/Hashset", "Sorting & Binary Search"],
        problems: 10,
        notes: "Build strong fundamentals with easy-medium problems",
        tasks: profile ? generateDailyTasks(1, profile, 10) : [
          'Solve 2-3 easy-medium problems daily',
          'Review data structure fundamentals',
          'Practice problem-solving patterns',
          'End-week mock interview'
        ]
      });
    }

    // Intermediate phase
    for (let i = 0; i < phases.intermediate; i++) {
      plan.push({
        week: currentWeek++,
        title: "Intermediate + Pattern Recognition",
        concepts: ["Trees & Graphs", "Dynamic Programming", "Advanced Algorithms"],
        problems: 12,
        notes: "Focus on medium-hard problems and common patterns",
        tasks: profile ? generateDailyTasks(2, profile, 12) : [
          'Solve 2-3 medium problems daily',
          'Practice algorithm patterns',
          'Study system design basics',
          'Weekly behavioral prep'
        ]
      });
    }

    // Advanced phase
    for (let i = 0; i < phases.advanced; i++) {
      plan.push({
        week: currentWeek++,
        title: "Advanced + Mock Preparation",
        concepts: ["Hard Problems", "System Design", "Mock Interviews"],
        problems: 8,
        notes: "Polish skills with hard problems and intensive mock practice",
        tasks: profile ? generateDailyTasks(3, profile, 8) : [
          'Solve 1-2 hard problems daily',
          'Daily system design practice',
          'Daily mock interviews',
          'Behavioral question mastery'
        ]
      });
    }

    return plan;
  };

  const generateDailySchedule = (weeklyPlan: WeeklyPlan[], totalDays: number) => {
    const schedule = [];
    let currentDay = 1;
    
    for (const week of weeklyPlan) {
      const daysInThisWeek = Math.min(7, totalDays - currentDay + 1);
      const problemsPerDay = Math.ceil(week.problems / daysInThisWeek);
      
      for (let dayInWeek = 0; dayInWeek < daysInThisWeek && currentDay <= totalDays; dayInWeek++) {
        schedule.push({
          day: currentDay++,
          tasks: week.tasks,
          problems: [`${problemsPerDay} problems from: ${week.concepts.join(', ')}`]
        });
      }
    }
    
    return schedule;
  };

  const handleCreate = async () => {
    setBusy(true);
    setTimeout(() => {
      const plan = generateCompanySpecificPlan();
      onPlan(plan);
      setBusy(false);
    }, 800);
  };

  return (
    <Card className="shadow-card bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" /> 
          Personalized Interview Prep Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="company">Primary Target Company</Label>
          <Select value={primaryCompany} onValueChange={setPrimaryCompany}>
            <SelectTrigger>
              <SelectValue placeholder="Select your primary target company" />
            </SelectTrigger>
            <SelectContent>
              {MAJOR_COMPANIES.map((company) => (
                <SelectItem key={company} value={company}>
                  <div className="flex items-center gap-2">
                    <span>{company}</span>
                    <Badge variant="outline" className="text-xs">
                      {COMPANY_PROFILES[company].focus.length} focus areas
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedCompanyProfile && (
            <div className="mt-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Focus Areas:</span>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {selectedCompanyProfile.focus.map((area) => (
                  <Badge key={area} variant="secondary" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">Behavioral Focus:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedCompanyProfile.behavioral.map((trait) => (
                  <Badge key={trait} variant="outline" className="text-xs">
                    {trait}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="role">Target Role</Label>
          <Input 
            id="role" 
            value={role} 
            onChange={(e) => setRole(e.target.value)} 
            placeholder="e.g., Software Engineer, Senior SDE" 
          />
        </div>

        <div className="grid grid-cols-3 gap-3 items-end">
          <div className="col-span-2">
            <Label htmlFor="time">Time Until Interview</Label>
            <div className="flex gap-2">
              <Input 
                id="time" 
                type="number" 
                min={1} 
                max={timeUnit === 'weeks' ? 12 : 84} 
                value={timeValue} 
                onChange={(e) => setTimeValue(Number(e.target.value) || 1)} 
              />
              <Select value={timeUnit} onValueChange={(value: 'days' | 'weeks') => setTimeUnit(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="days">Days</SelectItem>
                  <SelectItem value="weeks">Weeks</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center gap-1 mb-1">
              <Calendar className="w-4 h-4" /> 
              <span className="font-medium">{totalDays}</span> days
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" /> 
              <span className="font-medium">{totalWeeks}</span> weeks
            </div>
          </div>
        </div>

        <Button 
          onClick={handleCreate} 
          disabled={busy || !primaryCompany} 
          className="w-full h-11 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Brain className="w-4 h-4 mr-2" /> 
          {busy ? 'Creating Personalized Plan…' : 'Create Company-Specific Plan'}
        </Button>

        {selectedCompanyProfile && (
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">Popular {primaryCompany} Questions:</span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              {selectedCompanyProfile.popularQuestions.slice(0, 3).map((question) => (
                <div key={question}>• {question}</div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterviewPlanner;