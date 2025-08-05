'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

const questions = [
  {
    id: 1,
    question: "If you had no commitments, what time would you naturally go to bed?",
    options: [
      { value: "20:00-21:00", text: "8:00-9:00 PM" },
      { value: "21:00-22:00", text: "9:00-10:00 PM" },
      { value: "22:00-23:00", text: "10:00-11:00 PM" },
      { value: "23:00-00:00", text: "11:00 PM-12:00 AM" },
      { value: "00:00-01:00", text: "12:00-1:00 AM" },
    ]
  },
  {
    id: 2,
    question: "What time do you naturally wake up without an alarm?",
    options: [
      { value: "05:00-06:00", text: "5:00-6:00 AM" },
      { value: "06:00-07:00", text: "6:00-7:00 AM" },
      { value: "07:00-08:00", text: "7:00-8:00 AM" },
      { value: "08:00-09:00", text: "8:00-9:00 AM" },
      { value: "09:00-10:00", text: "9:00-10:00 AM" },
    ]
  },
  {
    id: 3,
    question: "When do you feel most alert and productive?",
    options: [
      { value: "early", text: "Early morning (5:00-9:00 AM)" },
      { value: "morning", text: "Morning (9:00 AM-12:00 PM)" },
      { value: "afternoon", text: "Afternoon (12:00-5:00 PM)" },
      { value: "evening", text: "Evening (5:00-9:00 PM)" },
      { value: "night", text: "Night (9:00 PM-12:00 AM)" },
    ]
  },
  {
    id: 4,
    question: "If you had to do 2 hours of physical exercise, when would you prefer to do it?",
    options: [
      { value: "06:00-08:00", text: "6:00-8:00 AM" },
      { value: "08:00-10:00", text: "8:00-10:00 AM" },
      { value: "10:00-12:00", text: "10:00 AM-12:00 PM" },
      { value: "15:00-17:00", text: "3:00-5:00 PM" },
      { value: "19:00-21:00", text: "7:00-9:00 PM" },
    ]
  },
  {
    id: 5,
    question: "How do you typically feel for the first 30 minutes after waking up?",
    options: [
      { value: "very-alert", text: "Very alert and ready to go" },
      { value: "fairly-alert", text: "Fairly alert" },
      { value: "fairly-tired", text: "Fairly tired" },
      { value: "very-tired", text: "Very tired and sluggish" },
    ]
  }
];

export default function Onboarding() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const handleAnswer = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const calculateChronoWindow = (answers: { [key: number]: string }): string => {
    let score = 0;
    
    // Scoring based on circadian research
    const bedtimeScores: { [key: string]: number } = {
      "20:00-21:00": 1, "21:00-22:00": 2, "22:00-23:00": 3, "23:00-00:00": 4, "00:00-01:00": 5
    };
    const waketimeScores: { [key: string]: number } = {
      "05:00-06:00": 1, "06:00-07:00": 2, "07:00-08:00": 3, "08:00-09:00": 4, "09:00-10:00": 5
    };
    const alertnessScores: { [key: string]: number } = {
      "early": 1, "morning": 2, "afternoon": 3, "evening": 4, "night": 5
    };
    const exerciseScores: { [key: string]: number } = {
      "06:00-08:00": 1, "08:00-10:00": 2, "10:00-12:00": 3, "15:00-17:00": 4, "19:00-21:00": 5
    };
    const morningScores: { [key: string]: number } = {
      "very-alert": 1, "fairly-alert": 2, "fairly-tired": 4, "very-tired": 5
    };

    score += bedtimeScores[answers[1]] || 3;
    score += waketimeScores[answers[2]] || 3;
    score += alertnessScores[answers[3]] || 3;
    score += exerciseScores[answers[4]] || 3;
    score += morningScores[answers[5]] || 3;

    // Determine chronotype and optimal wake window
    if (score <= 8) return "05:30-06:00";
    if (score <= 12) return "06:00-06:30";
    if (score <= 16) return "06:30-07:00";
    if (score <= 20) return "07:00-07:30";
    return "07:30-08:00";
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    const chronoWindow = calculateChronoWindow(answers);

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email!,
        chrono_window: chronoWindow,
      });

    if (error) {
      console.error('Error saving profile:', error);
    } else {
      router.push('/dashboard');
    }
    setLoading(false);
  };

  const isComplete = Object.keys(answers).length === questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Chronotype Analysis</h1>
          <p className="text-gray-300">Determining your optimal wake window</p>
          <div className="mt-4 w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        <div className="bg-gray-800/50 p-8 rounded-lg border border-gray-700">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              {questions[currentQuestion]?.question}
            </h2>
          </div>

          <div className="space-y-3">
            {questions[currentQuestion]?.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className="w-full p-4 text-left border border-gray-600 rounded-lg hover:border-primary hover:bg-gray-700/50 transition-colors text-white"
              >
                {option.text}
              </button>
            ))}
          </div>

          {isComplete && (
            <div className="mt-8 text-center">
              <p className="text-gray-300 mb-4">Analysis complete! Ready to optimize your wake sequence.</p>
              <button
                onClick={handleComplete}
                disabled={loading}
                className="bg-primary text-black px-8 py-3 rounded-lg font-semibold hover:bg-blue-400 transition-colors disabled:opacity-50"
              >
                {loading ? 'Initializing...' : 'Launch Dashboard'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}