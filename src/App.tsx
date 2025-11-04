import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CourseViewer from "./pages/CourseViewer";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdaptiveQuizzes from "./pages/adaptive/Quizzes";
import AdaptiveTests from "./pages/adaptive/Tests";
import AdaptiveTheory from "./pages/adaptive/Theory";
import TakeQuiz from "./pages/adaptive/TakeQuiz";
import TakeTest from "./pages/adaptive/TakeTest";
import AdminContentIngestion from "./pages/AdminContentIngestion";
import InterviewPlanPage from "./pages/InterviewPlanPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses/:id" element={<CourseViewer />} />
            <Route path="/dashboard/adaptive/quizzes" element={<AdaptiveQuizzes />} />
            <Route path="/dashboard/adaptive/tests" element={<AdaptiveTests />} />
            <Route path="/dashboard/adaptive/theory" element={<AdaptiveTheory />} />
            <Route path="/dashboard/adaptive/quiz/:quizId" element={<TakeQuiz />} />
            <Route path="/dashboard/adaptive/test/:testId" element={<TakeTest />} />
            <Route path="/admin/content-ingestion" element={<AdminContentIngestion />} />
            <Route path="/dashboard/interview-plan" element={<InterviewPlanPage />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
