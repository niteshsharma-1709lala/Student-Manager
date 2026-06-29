import React, { useState, useEffect } from 'react';
import { Trash2, TrendingUp, ExternalLink } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

interface Student {
  id: string;
  rollNumber: string;
  name: string;
  marks: number;
  honorScore: number;
  attendance: number;
}

export function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [marks, setMarks] = useState('');
  const [honorScore, setHonorScore] = useState('');
  const [attendance, setAttendance] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'students'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Student[];
      setStudents(studentData);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'students');
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!rollNumber.trim() || !name.trim() || !marks.trim() || !honorScore.trim() || !attendance.trim()) {
      setError('All fields are required.');
      return;
    }

    const marksNumber = parseFloat(marks);
    const honorScoreNumber = parseFloat(honorScore);
    const attendanceNumber = parseFloat(attendance);

    if (isNaN(marksNumber) || marksNumber < 0 || marksNumber > 100) {
      setError('Marks must be a valid number between 0 and 100.');
      return;
    }
    if (isNaN(honorScoreNumber) || honorScoreNumber < 0 || honorScoreNumber > 100) {
      setError('Honor Score must be a valid number between 0 and 100.');
      return;
    }
    if (isNaN(attendanceNumber) || attendanceNumber < 0 || attendanceNumber > 100) {
      setError('Attendance must be a valid number between 0 and 100.');
      return;
    }

    const isDuplicate = students.some(
      (s) => s.rollNumber.toLowerCase() === rollNumber.trim().toLowerCase()
    );

    if (isDuplicate) {
      setError('A student with this Roll Number already exists.');
      return;
    }

    try {
      // Double check with database to prevent any race conditions
      const q = query(
        collection(db, 'students'), 
        where('rollNumber', '==', rollNumber.trim())
      );
      
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setError('A student with this Roll Number already exists in the database.');
        return;
      }

      await addDoc(collection(db, 'students'), {
        rollNumber: rollNumber.trim(),
        name: name.trim(),
        marks: marksNumber,
        honorScore: honorScoreNumber,
        attendance: attendanceNumber,
      });

      setRollNumber('');
      setName('');
      setMarks('');
      setHonorScore('');
      setAttendance('');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'students');
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'students', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `students/${id}`);
    }
  };

  const sortedStudents = [...students].sort((a, b) => {
    const rollComparison = a.rollNumber.localeCompare(b.rollNumber, undefined, { numeric: true, sensitivity: 'base' });
    if (rollComparison !== 0) {
      return rollComparison;
    }
    return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
  });

  const chartData = [...students].sort((a, b) => a.marks - b.marks);

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1600px] w-full mx-auto space-y-8">
      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-4">Add New Student</h2>
        {error && <div className="mb-4 text-sm text-red-400 bg-red-900/50 border border-red-500/50 p-3 rounded-md">{error}</div>}
        
        <div className="flex flex-col gap-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rollNumber" className="block text-sm font-medium text-slate-200 mb-1">Roll Number</label>
              <input
                type="text"
                id="rollNumber"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors text-white placeholder-slate-400"
                placeholder="e.g., CS-101"
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-200 mb-1">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors text-white placeholder-slate-400"
                placeholder="e.g., Jane Doe"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="marks" className="block text-sm font-medium text-slate-200 mb-1">Marks (%)</label>
              <input
                type="number"
                id="marks"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors text-white placeholder-slate-400"
                placeholder="e.g., 85"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <label htmlFor="honorScore" className="block text-sm font-medium text-slate-200 mb-1">Honor Score</label>
              <input
                type="number"
                id="honorScore"
                value={honorScore}
                onChange={(e) => setHonorScore(e.target.value)}
                className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors text-white placeholder-slate-400"
                placeholder="e.g., 90"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            <div>
              <label htmlFor="attendance" className="block text-sm font-medium text-slate-200 mb-1">Attendance (%)</label>
              <input
                type="number"
                id="attendance"
                value={attendance}
                onChange={(e) => setAttendance(e.target.value)}
                className="w-full px-4 py-3 border border-white/20 bg-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors text-white placeholder-slate-400"
                placeholder="e.g., 95"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-amber-400 hover:bg-amber-500 text-slate-900 font-medium py-3 px-6 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 focus:ring-offset-slate-800 shadow-lg"
          >
            Add Student
          </button>
        </div>
      </form>

      <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 mb-8 h-80 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={20} className="text-amber-400" />
          <h2 className="text-xl font-semibold text-white">Marks Distribution</h2>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.3} />
              <XAxis dataKey="rollNumber" tick={{fill: '#94a3b8', fontSize: 12}} />
              <YAxis tick={{fill: '#94a3b8', fontSize: 12}} domain={[0, 100]} />
              <Tooltip 
                cursor={{ stroke: '#f59e0b', strokeWidth: 2, strokeDasharray: '4 4' }} 
                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f8fafc' }}
                labelStyle={{ color: '#fbbf24', fontWeight: 'bold', marginBottom: '4px' }}
                formatter={(value: number) => [`${value}%`, 'Marks']}
              />
              <Line 
                type="monotone" 
                dataKey="marks" 
                stroke="#fbbf24" 
                strokeWidth={3} 
                activeDot={{ r: 6, fill: '#fbbf24', stroke: '#0f172a', strokeWidth: 2 }} 
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Student Roster</h2>
        <span className="text-sm text-slate-900 bg-amber-400 py-1 px-3 rounded-full font-medium shadow-md">
          {students.length} {students.length === 1 ? 'Student' : 'Students'}
        </span>
      </div>
      
      {students.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/20 text-center text-slate-300">
          No students registered yet. Add a student above to get started.
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          <div className="md:hidden divide-y divide-white/10">
            {sortedStudents.map((student) => (
              <div key={student.id} className="p-4 flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <Link to={`/student/${student.id}`} className="hover:text-amber-400 transition-colors block">
                    <h3 className="font-medium text-white">{student.name}</h3>
                    <p className="text-sm text-slate-300">Roll No: {student.rollNumber}</p>
                  </Link>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="text-red-400 hover:text-red-300 p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors"
                      aria-label="Delete student"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-slate-300">Marks:</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${
                    student.marks >= 30 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                    'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {student.marks}%
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${
                    student.marks >= 30 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {student.marks >= 30 ? 'Pass' : 'Fail'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Roll Number
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Marks
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {sortedStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      <Link to={`/student/${student.id}`} className="hover:text-amber-400 transition-colors">{student.rollNumber}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200">
                      <Link to={`/student/${student.id}`} className="hover:text-amber-400 transition-colors">{student.name}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${
                        student.marks >= 30 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {student.marks}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm ${
                        student.marks >= 30 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {student.marks >= 30 ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleDeleteStudent(student.id)}
                          className="text-red-400 hover:text-red-300 bg-white/5 p-2 rounded-xl hover:bg-white/10 transition-colors inline-flex items-center"
                          aria-label="Delete student"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
