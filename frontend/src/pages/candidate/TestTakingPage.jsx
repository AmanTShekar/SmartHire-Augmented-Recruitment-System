import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle, Code, AlertTriangle } from 'lucide-react';

// Mock questions for demo — in production, these would come from round config via API
const mockQuestions = [
    { id: 1, type: 'mcq', question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'], correct: 1 },
    { id: 2, type: 'mcq', question: 'Which data structure uses FIFO?', options: ['Stack', 'Queue', 'Tree', 'Graph'], correct: 1 },
    { id: 3, type: 'mcq', question: 'What does REST stand for?', options: ['Real-time Event Stream Transfer', 'Representational State Transfer', 'Remote Execution Service Technology', 'None of the above'], correct: 1 },
    { id: 4, type: 'subjective', question: 'Explain the difference between SQL and NoSQL databases. When would you choose one over the other?' },
    { id: 5, type: 'mcq', question: 'Which HTTP method is idempotent?', options: ['POST', 'PUT', 'PATCH', 'None'], correct: 1 },
];

const TestTakingPage = () => {
    const { roundId } = useParams();
    const navigate = useNavigate();
    const { authFetch } = useAuth();
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState({});
    const [flagged, setFlagged] = useState(new Set());
    const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
    const [submitted, setSubmitted] = useState(false);
    const [questions] = useState(mockQuestions);

    useEffect(() => {
        if (submitted) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) { handleSubmit(); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [submitted]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleAnswer = (qId, answer) => {
        setAnswers(prev => ({ ...prev, [qId]: answer }));
    };

    const toggleFlag = (qId) => {
        setFlagged(prev => {
            const next = new Set(prev);
            if (next.has(qId)) next.delete(qId);
            else next.add(qId);
            return next;
        });
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        try {
            // Submit answers to backend
            // await authFetch(`/rounds/${roundId}/submit`, { method: 'POST', body: JSON.stringify({ answers }) });
        } catch (e) {
            console.error(e);
        }
    };

    const q = questions[currentQ];

    if (submitted) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle size={40} className="text-green-400" />
                </div>
                <h2 className="text-3xl font-bold">Test Submitted</h2>
                <p className="text-text-secondary text-sm">Your answers have been recorded. Results will be available soon.</p>
                <div className="text-sm text-text-muted">
                    Answered: {Object.keys(answers).length} / {questions.length}
                </div>
                <button onClick={() => navigate('/candidate/applications')} className="btn-primary mt-4">
                    Back to Applications
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Assessment</h1>
                    <p className="text-text-muted text-xs">Round #{roundId}</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full border ${timeLeft < 300 ? 'border-red-500/30 text-red-400' : 'border-white/10'
                    }`}>
                    <Clock size={14} />
                    <span className="font-mono font-bold text-sm">{formatTime(timeLeft)}</span>
                </div>
            </div>

            {/* Question Navigator */}
            <div className="flex gap-2 flex-wrap">
                {questions.map((q, i) => (
                    <button
                        key={q.id}
                        onClick={() => setCurrentQ(i)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition cursor-pointer ${i === currentQ ? 'bg-white text-black' :
                                answers[q.id] !== undefined ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                    flagged.has(q.id) ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/20' :
                                        'bg-white/5 border border-white/10 text-text-secondary hover:bg-white/10'
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Question Card */}
            <div className="luxury-card p-8">
                <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
                        Question {currentQ + 1} of {questions.length}
                    </span>
                    <div className="flex gap-2">
                        {q.type === 'mcq' && <span className="badge badge-blue">MCQ</span>}
                        {q.type === 'subjective' && <span className="badge badge-purple">Subjective</span>}
                        {q.type === 'coding' && <span className="badge badge-yellow">Code</span>}
                        <button onClick={() => toggleFlag(q.id)} className={`p-1 rounded cursor-pointer transition ${flagged.has(q.id) ? 'text-yellow-400' : 'text-text-muted hover:text-yellow-400'}`}>
                            <Flag size={14} />
                        </button>
                    </div>
                </div>

                <h3 className="text-lg font-semibold mb-6">{q.question}</h3>

                {q.type === 'mcq' && (
                    <div className="flex flex-col gap-3">
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(q.id, i)}
                                className={`p-4 rounded-xl border text-left text-sm transition cursor-pointer ${answers[q.id] === i
                                        ? 'border-white/30 bg-white/5 text-white'
                                        : 'border-white/[0.08] text-text-secondary hover:border-white/20 hover:text-white'
                                    }`}
                            >
                                <span className="font-bold mr-3 opacity-40">{String.fromCharCode(65 + i)}.</span>
                                {opt}
                            </button>
                        ))}
                    </div>
                )}

                {q.type === 'subjective' && (
                    <textarea
                        className="form-input"
                        rows={6}
                        placeholder="Type your answer here..."
                        value={answers[q.id] || ''}
                        onChange={e => handleAnswer(q.id, e.target.value)}
                    />
                )}

                {q.type === 'coding' && (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
                            <Code size={24} className="text-yellow-400" />
                        </div>
                        <h4 className="font-bold text-lg mb-2">Coding Challenge</h4>
                        <span className="badge badge-yellow">Coming Soon</span>
                        <p className="text-sm text-text-muted mt-3">Integrated coding environment is under development.</p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
                <button
                    disabled={currentQ === 0}
                    onClick={() => setCurrentQ(p => p - 1)}
                    className="btn-secondary"
                >
                    <ChevronLeft size={14} /> Previous
                </button>
                {currentQ < questions.length - 1 ? (
                    <button onClick={() => setCurrentQ(p => p + 1)} className="btn-secondary">
                        Next <ChevronRight size={14} />
                    </button>
                ) : (
                    <button onClick={handleSubmit} className="btn-primary">
                        Submit Test <CheckCircle size={14} />
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default TestTakingPage;
