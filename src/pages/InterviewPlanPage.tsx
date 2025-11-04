import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import InterviewPlanDisplay from '@/components/InterviewPlanner/InterviewPlanDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { InterviewPlan } from '@/components/Chatbot/engine';

const InterviewPlanPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan as InterviewPlan;

  if (!plan) {
    navigate('/dashboard');
    return null;
  }

  const handleReset = () => {
    navigate('/dashboard');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <h1 className="text-3xl font-bold bg-hero-gradient bg-clip-text text-transparent">
            Interview Preparation Plan
          </h1>
          <p className="text-muted-foreground mt-2">
            Your personalized roadmap to ace your {plan.primaryCompany} interview
          </p>
        </div>
        
        <InterviewPlanDisplay plan={plan} onReset={handleReset} />
      </div>
    </Layout>
  );
};

export default InterviewPlanPage;