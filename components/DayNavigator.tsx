'use client';

import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DayNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DayNavigator({ selectedDate, onDateChange }: DayNavigatorProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const isToday = selectedDate.toDateString() === today.toDateString();
  const isFuture = selectedDate > today;
  
  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };
  
  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    if (newDate <= today) {
      onDateChange(newDate);
    }
  };
  
  const goToToday = () => {
    onDateChange(today);
  };
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '16px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      marginBottom: '24px'
    }}>
      <button
        onClick={goToPreviousDay}
        style={{
          padding: '8px',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f3f4f6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <ChevronLeft style={{width: '20px', height: '20px', color: '#374151'}} />
      </button>
      
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minWidth: '200px',
        justifyContent: 'center'
      }}>
        <Calendar style={{width: '18px', height: '18px', color: '#6b7280'}} />
        <div style={{textAlign: 'center'}}>
          <p style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            margin: '0'
          }}>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </p>
          {isToday && (
            <p style={{
              fontSize: '12px',
              color: '#10b981',
              fontWeight: '600',
              margin: '2px 0 0 0'
            }}>
              Today
            </p>
          )}
        </div>
      </div>
      
      <button
        onClick={goToNextDay}
        disabled={isFuture}
        style={{
          padding: '8px',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: '8px',
          cursor: isFuture ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          opacity: isFuture ? 0.3 : 1
        }}
        onMouseEnter={(e) => {
          if (!isFuture) {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <ChevronRight style={{width: '20px', height: '20px', color: '#374151'}} />
      </button>
      
      {!isToday && (
        <button
          onClick={goToToday}
          style={{
            marginLeft: '8px',
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#3b82f6';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Today
        </button>
      )}
    </div>
  );
}