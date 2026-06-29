import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { School, ArrowLeft, Award, Calendar, BookOpen, AlertCircle, User } from 'lucide-react';

interface Student {
  id: string;
  rollNumber: string;
  name: string;
  marks: number;
  honorScore: number;
  attendance: number;
}

export function StudentProfile() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    const docRef = doc(db, 'students', id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        setStudent({ id: snapshot.id, ...snapshot.data() } as Student);
      } else {
        setError('Student not found.');
      }
      setLoading(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, `students/${id}`);
      setError('Error loading student data.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="py-8 px-4 max-w-3xl mx-auto">
        <div className="bg-red-900/50 border border-red-500 p-6 rounded-3xl flex items-center gap-4 text-red-200">
          <AlertCircle size={24} className="text-red-400" />
          <p>{error || 'Student not found.'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] w-full mx-auto space-y-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
        <ArrowLeft size={20} />
        Back to Dashboard
      </Link>
      
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-xl">
        <div className="bg-white/5 p-6 border-b border-white/10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-2 border-white/20 shrink-0">
            <User size={48} className="text-white/60" strokeWidth={1.5} />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold text-white mb-1">{student.name}</h1>
            <p className="text-slate-300 text-lg">Roll No: {student.rollNumber}</p>
          </div>
        </div>
        
        <div className="p-8 bg-transparent">
          <h2 className="text-xl font-bold text-white mb-6 border-b border-white/20 pb-2">Academic Performance</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-sm flex flex-col items-center text-center">
              <div className="bg-sky-500/20 p-3 rounded-full text-sky-400 mb-3">
                <BookOpen size={28} />
              </div>
              <h3 className="text-slate-300 font-medium mb-1">Total Marks</h3>
              <div className="text-3xl font-bold text-white">
                {student.marks}%
              </div>
              <div className={`mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${
                student.marks >= 30 ? 'bg-emerald-500/20 text-emerald-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {student.marks >= 30 ? 'Pass' : 'Fail'}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-sm flex flex-col items-center text-center">
              <div className="bg-amber-500/20 p-3 rounded-full text-amber-400 mb-3">
                <Award size={28} />
              </div>
              <h3 className="text-slate-300 font-medium mb-1">Honor Score</h3>
              <div className="text-3xl font-bold text-white">
                {student.honorScore}
              </div>
              <div className="mt-2 text-xs font-medium text-slate-400">
                Out of 100
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-sm flex flex-col items-center text-center">
              <div className="bg-emerald-500/20 p-3 rounded-full text-emerald-400 mb-3">
                <Calendar size={28} />
              </div>
              <h3 className="text-slate-300 font-medium mb-1">Attendance</h3>
              <div className="text-3xl font-bold text-white">
                {student.attendance}%
              </div>
              <div className={`mt-2 text-xs font-medium px-2.5 py-1 rounded-full ${
                student.attendance >= 75 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
              }`}>
                {student.attendance >= 75 ? 'On Track' : 'Low Attendance'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
