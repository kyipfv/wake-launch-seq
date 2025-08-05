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
      router.push('/home');
    }
    setLoading(false);
  };

  const isComplete = Object.keys(answers).length === questions.length;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 via-purple-700/20 to-blue-500/20"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-gradient-to-r from-orange-400 to-blue-500 shadow-2xl">
              <div className="text-4xl">🧠</div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">Chronotype Analysis</h1>
            <p className="text-gray-400 text-xl mb-8">Determining your optimal wake window</p>
            
            {/* Progress Bar */}
            <div className="w-full max-w-md mx-auto">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Progress</span>
                <span className="text-sm text-orange-400 font-semibold">
                  {currentQuestion + 1} of {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-800">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-2xl bg-gradient-to-r from-orange-400/20 to-blue-500/20 border border-orange-400/30">
                <div className="text-2xl">❓</div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                {questions[currentQuestion]?.question}
              </h2>
            </div>

            <div className="space-y-4">
              {questions[currentQuestion]?.options.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(option.value)}
                  className="w-full p-5 text-left bg-gray-800/60 border border-gray-700 rounded-2xl hover:border-orange-400/50 hover:bg-gray-800/80 transition-all duration-300 text-white text-lg group transform hover:scale-105"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 rounded-full border-2 border-gray-600 group-hover:border-orange-400 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-orange-400 transition-colors duration-300"></div>
                    </div>
                    <span className="group-hover:text-orange-100 transition-colors duration-300">
                      {option.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {isComplete && (
              <div className="mt-12 p-8 bg-gradient-to-r from-orange-500/10 to-blue-500/10 rounded-2xl border border-orange-400/30 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center shadow-2xl">
                  <div className="text-3xl">✨</div>
                </div>
                <p className="text-gray-300 text-xl mb-6 font-medium">
                  Analysis complete! Ready to optimize your wake sequence.
                </p>
                <button
                  onClick={handleComplete}
                  disabled={loading}
                  className="py-4 px-8 bg-gradient-to-r from-orange-500 to-blue-600 text-white text-lg font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Initializing Dashboard...</span>
                    </div>
                  ) : (
                    'Launch Dashboard 🚀'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}