'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Check, Square, Plus, X } from 'lucide-react';

interface Note {
  id: string;
  text: string;
  isChecked: boolean;
  createdAt: string;
}

interface NotepadProps {
  selectedDate?: Date;
}

export default function Notepad({ selectedDate }: NotepadProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const { user } = useAuth();
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentDate = selectedDate || new Date();
  const isToday = currentDate.toDateString() === new Date().toDateString();

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user, selectedDate]);

  const loadNotes = () => {
    if (!user) return;
    
    const dateStr = currentDate.toISOString().split('T')[0];
    const storageKey = user.id === 'demo-user' 
      ? `demo_notes_${dateStr}`
      : `notes_${user.id}_${dateStr}`;
    
    const savedNotes = localStorage.getItem(storageKey);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      setNotes([]);
    }
  };

  const saveNotes = (updatedNotes: Note[]) => {
    if (!user || !isToday) return; // Only save if viewing today
    
    const dateStr = currentDate.toISOString().split('T')[0];
    const storageKey = user.id === 'demo-user' 
      ? `demo_notes_${dateStr}`
      : `notes_${user.id}_${dateStr}`;
    
    localStorage.setItem(storageKey, JSON.stringify(updatedNotes));
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      text: newNote,
      isChecked: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setNewNote('');
  };

  const toggleNote = (id: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, isChecked: !note.isChecked } : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const updateNoteText = (id: string, text: string) => {
    const updatedNotes = notes.map(note => 
      note.id === id ? { ...note, text } : note
    );
    setNotes(updatedNotes);
    
    // Debounce saving
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveNotes(updatedNotes);
    }, 500);
  };

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      border: '1px solid #f3f4f6',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
    }}>
      {/* Background gradient */}
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '96px',
        height: '96px',
        backgroundColor: '#fbbf24',
        opacity: '0.03',
        borderRadius: '50%',
        transform: 'translate(16px, -16px)'
      }}></div>
      
      <div style={{position: 'relative', zIndex: '10'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px'}}>
          <div>
            <h3 style={{fontSize: '20px', fontWeight: '700', color: '#111827', marginBottom: '4px'}}>Morning Notes</h3>
            {!isToday && (
              <p style={{fontSize: '14px', color: '#6b7280', fontWeight: '500'}}>
                {currentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - Read Only
              </p>
            )}
          </div>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{fontSize: '18px'}}>📝</span>
          </div>
        </div>

        {/* Add new note - only show for today */}
        {isToday && (
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '20px'
          }}>
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addNote()}
            placeholder="Add a note or task..."
            style={{
              flex: 1,
              padding: '12px 16px',
              fontSize: '16px',
              borderRadius: '12px',
              border: '2px solid #e5e7eb',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              backgroundColor: '#f9fafb'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#fbbf24';
              e.currentTarget.style.backgroundColor = '#fffbeb';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.backgroundColor = '#f9fafb';
            }}
          />
          <button
            onClick={addNote}
            style={{
              padding: '12px 20px',
              backgroundColor: '#fbbf24',
              color: 'white',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '16px',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px 0 rgba(251, 191, 36, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f59e0b';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(251, 191, 36, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fbbf24';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(251, 191, 36, 0.25)';
            }}
          >
            <Plus style={{width: '18px', height: '18px'}} />
            Add
          </button>
          </div>
        )}

        {/* Notes list */}
        <div style={{
          maxHeight: '300px',
          overflowY: 'auto',
          paddingRight: '8px'
        }}>
          {notes.length === 0 ? (
            <p style={{
              textAlign: 'center',
              color: '#9ca3af',
              fontSize: '14px',
              padding: '40px 0',
              fontWeight: '500'
            }}>
              Start your day by adding notes or tasks
            </p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '16px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '12px',
                    border: '1px solid #f3f4f6',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                >
                  <button
                    onClick={() => isToday && toggleNote(note.id)}
                    disabled={!isToday}
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      border: note.isChecked ? 'none' : '2px solid #d1d5db',
                      backgroundColor: note.isChecked ? '#10b981' : 'transparent',
                      cursor: isToday ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {note.isChecked && <Check style={{width: '16px', height: '16px', color: 'white'}} />}
                  </button>
                  <input
                    type="text"
                    value={note.text}
                    onChange={(e) => isToday && updateNoteText(note.id, e.target.value)}
                    readOnly={!isToday}
                    style={{
                      flex: 1,
                      border: 'none',
                      backgroundColor: 'transparent',
                      fontSize: '16px',
                      color: note.isChecked ? '#9ca3af' : '#374151',
                      textDecoration: note.isChecked ? 'line-through' : 'none',
                      outline: 'none',
                      fontWeight: '500'
                    }}
                  />
                  {isToday && (
                    <button
                      onClick={() => deleteNote(note.id)}
                    style={{
                      padding: '4px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#9ca3af',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '6px',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#fee2e2';
                      e.currentTarget.style.color = '#ef4444';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#9ca3af';
                    }}
                  >
                    <X style={{width: '16px', height: '16px'}} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Note about auto-save */}
        <p style={{
          fontSize: '12px',
          color: '#9ca3af',
          marginTop: '16px',
          textAlign: 'center',
          fontWeight: '500'
        }}>
          Notes auto-save and reset daily
        </p>
      </div>
    </div>
  );
}