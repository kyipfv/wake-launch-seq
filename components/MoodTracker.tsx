'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MoodEntry {
  mood: string;
  emoji: string;
  timestamp: string;
  note?: string;
}

const MOODS = [
  { mood: 'excellent', emoji: '😄', color: 'from-green-400 to-green-600', label: 'Excellent' },
  { mood: 'good', emoji: '😊', color: 'from-blue-400 to-blue-600', label: 'Good' },
  { mood: 'okay', emoji: '😐', color: 'from-yellow-400 to-yellow-600', label: 'Okay' },
  { mood: 'tired', emoji: '😴', color: 'from-orange-400 to-orange-600', label: 'Tired' },
  { mood: 'stressed', emoji: '😰', color: 'from-red-400 to-red-600', label: 'Stressed' }
];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    const savedMoods = localStorage.getItem('moodHistory');
    if (savedMoods) {
      setMoodHistory(JSON.parse(savedMoods));
    }
  }, []);

  const saveMood = () => {
    if (!selectedMood) return;

    const moodData = MOODS.find(m => m.mood === selectedMood);
    if (!moodData) return;

    const newEntry: MoodEntry = {
      mood: selectedMood,
      emoji: moodData.emoji,
      timestamp: new Date().toISOString(),
      note: note.trim() || undefined
    };

    const updatedHistory = [newEntry, ...moodHistory].slice(0, 30); // Keep last 30 entries
    setMoodHistory(updatedHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    
    setSelectedMood(null);
    setNote('');
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  const getTodayMoods = () => {
    const today = new Date().toDateString();
    return moodHistory.filter(entry => 
      new Date(entry.timestamp).toDateString() === today
    );
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const todayMoods = getTodayMoods();

  return (
    <div className="apple-card">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Mood Tracker</h3>
        <p className="text-gray-600">How are you feeling right now?</p>
      </div>

      {/* Mood Selection */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {MOODS.map(({ mood, emoji, color, label }) => (
          <motion.button
            key={mood}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedMood(mood)}
            className={`relative p-4 rounded-xl transition-all ${
              selectedMood === mood 
                ? `bg-gradient-to-br ${color} shadow-lg` 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            <div className="text-3xl mb-1">{emoji}</div>
            <div className={`text-xs font-medium ${
              selectedMood === mood ? 'text-white' : 'text-gray-700'
            }`}>
              {label}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Note Input */}
      <AnimatePresence>
        {selectedMood && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={saveMood}
          disabled={!selectedMood}
          className={`apple-button ${
            selectedMood ? 'apple-button-primary' : 'opacity-50 cursor-not-allowed'
          }`}
        >
          Save Mood
        </button>

        <AnimatePresence>
          {savedMessage && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-green-600 font-medium"
            >
              ✓ Mood saved!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Today's Moods Summary */}
      {todayMoods.length > 0 && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Today's Moods</h4>
            <span className="text-sm text-gray-600">{todayMoods.length} entries</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {todayMoods.map((entry, index) => (
              <div key={index} className="flex items-center gap-1 px-3 py-1 bg-white rounded-full">
                <span className="text-lg">{entry.emoji}</span>
                <span className="text-xs text-gray-600">{formatTime(entry.timestamp)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Toggle */}
      <button
        onClick={() => setShowHistory(!showHistory)}
        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
      >
        {showHistory ? 'Hide' : 'Show'} History ({moodHistory.length})
      </button>

      {/* Mood History */}
      <AnimatePresence>
        {showHistory && moodHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 max-h-64 overflow-y-auto"
          >
            <div className="space-y-2">
              {moodHistory.map((entry, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-2xl">{entry.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 capitalize">{entry.mood}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(entry.timestamp)} • {formatTime(entry.timestamp)}
                      </span>
                    </div>
                    {entry.note && (
                      <p className="text-sm text-gray-600 mt-1">{entry.note}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}