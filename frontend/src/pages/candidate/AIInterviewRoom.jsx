import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, Clock, Brain, Activity, Shield, CheckCircle, BarChart3 } from 'lucide-react';

const AIInterviewRoom = () => {
    const { sessionId } = useParams();
    const navigate = useNavigate();
    const { authFetch } = useAuth();
    const [messages, setMessages] = useState([
        { role: 'ai', content: "Hello! I'm your AI interviewer for today. Let's start by having you tell me about yourself and your experience. What motivates you in your work?" }
    ]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [questionCount, setQuestionCount] = useState(1);
    const [elapsed, setElapsed] = useState(0);
    const [metrics, setMetrics] = useState({
        confidence: 72,
        clarity: 68,
        relevance: 75,
        depth: 60,
    });
    const chatRef = useRef(null);
    const maxQuestions = 8;

    useEffect(() => {
        if (completed) return;
        const timer = setInterval(() => setElapsed(p => p + 1), 1000);
        return () => clearInterval(timer);
    }, [completed]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    const aiResponses = [
        "That's a great point. Can you give me a specific example of a challenging project you've worked on and how you overcame obstacles?",
        "Interesting. How do you approach learning new technologies? Could you walk me through your process?",
        "I appreciate the detail. Let's talk about teamwork — describe a situation where you had a disagreement with a colleague and how you resolved it.",
        "Good insight. How do you prioritize tasks when working on multiple projects with tight deadlines?",
        "Thank you for sharing. On a technical level, what architecture patterns do you prefer and why?",
        "That aligns well with what we're looking for. How do you handle feedback, both giving and receiving?",
        "Excellent response. One last question — where do you see yourself in the next 3 years professionally?",
    ];

    const handleSend = async () => {
        if (!input.trim() || sending) return;
        const userMsg = input.trim();
        setInput('');
        setSending(true);

        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);

        // Simulate AI response
        await new Promise(r => setTimeout(r, 1500 + Math.random() * 1000));

        // Update metrics slightly based on response length/quality
        setMetrics(prev => ({
            confidence: Math.min(100, prev.confidence + Math.floor(Math.random() * 5)),
            clarity: Math.min(100, prev.clarity + Math.floor(Math.random() * 4)),
            relevance: Math.min(100, prev.relevance + Math.floor(Math.random() * 3)),
            depth: Math.min(100, prev.depth + Math.floor(Math.random() * 6)),
        }));

        if (questionCount >= maxQuestions) {
            setMessages(prev => [...prev, {
                role: 'ai',
                content: "Thank you for this conversation! I've gathered enough information to complete your evaluation. You've done a great job. Your results will be processed and shared with the hiring team shortly."
            }]);
            setCompleted(true);
        } else {
            const responseIdx = Math.min(questionCount - 1, aiResponses.length - 1);
            setMessages(prev => [...prev, { role: 'ai', content: aiResponses[responseIdx] }]);
            setQuestionCount(prev => prev + 1);
        }

        setSending(false);
    };

    if (completed) {
        const avgScore = Math.round(Object.values(metrics).reduce((a, b) => a + b, 0) / 4);
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 gap-6 max-w-lg mx-auto">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle size={40} className="text-green-400" />
                </div>
                <h2 className="text-3xl font-bold">Interview Complete</h2>
                <p className="text-text-secondary text-sm text-center">Your responses have been analyzed. Here's a summary of your performance.</p>

                <div className="w-full luxury-card p-6 space-y-4">
                    {Object.entries(metrics).map(([key, val]) => (
                        <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="capitalize font-medium">{key}</span>
                                <span className="font-bold">{val}%</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${val}%` }} />
                            </div>
                        </div>
                    ))}
                    <div className="pt-4 border-t border-white/10 text-center">
                        <div className="text-3xl font-bold">{avgScore}%</div>
                        <div className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Overall Score</div>
                    </div>
                </div>

                <button onClick={() => navigate('/candidate/applications')} className="btn-primary mt-4">
                    Back to Applications
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 h-[calc(100vh-200px)]">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col luxury-card overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-white/[0.08] flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                            <Brain size={16} className="text-blue-400" />
                        </div>
                        <div>
                            <div className="text-sm font-bold">AI Interviewer</div>
                            <div className="text-[10px] text-text-muted">Question {questionCount} of {maxQuestions}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Clock size={14} className="text-text-muted" />
                        <span className="font-mono">{formatTime(elapsed)}</span>
                    </div>
                </div>

                {/* Messages */}
                <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-white/10 text-white'
                                    : 'bg-white/[0.04] border border-white/[0.08] text-text-secondary'
                                }`}>
                                {msg.content}
                            </div>
                        </motion.div>
                    ))}
                    {sending && (
                        <div className="flex justify-start">
                            <div className="bg-white/[0.04] border border-white/[0.08] p-4 rounded-2xl">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 rounded-full bg-text-muted animate-pulse" />
                                    <div className="w-2 h-2 rounded-full bg-text-muted animate-pulse" style={{ animationDelay: '0.2s' }} />
                                    <div className="w-2 h-2 rounded-full bg-text-muted animate-pulse" style={{ animationDelay: '0.4s' }} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/[0.08] shrink-0">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            className="form-input flex-1"
                            placeholder="Type your response..."
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSend()}
                            disabled={sending}
                        />
                        <button onClick={handleSend} disabled={sending || !input.trim()} className="btn-primary">
                            <Send size={14} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Metrics Sidebar */}
            <div className="w-64 flex flex-col gap-4 shrink-0">
                <div className="luxury-card p-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4 flex items-center gap-2">
                        <Activity size={12} /> Live Metrics
                    </div>
                    <div className="space-y-4">
                        {Object.entries(metrics).map(([key, val]) => (
                            <div key={key}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="capitalize text-text-secondary">{key}</span>
                                    <span className="font-bold">{val}%</span>
                                </div>
                                <div className="progress-bar">
                                    <motion.div
                                        className="progress-fill"
                                        animate={{ width: `${val}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="luxury-card p-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                        <BarChart3 size={12} /> Progress
                    </div>
                    <div className="text-2xl font-bold">{questionCount}/{maxQuestions}</div>
                    <div className="text-xs text-text-muted mt-1">Questions completed</div>
                    <div className="progress-bar mt-3">
                        <motion.div
                            className="progress-fill"
                            animate={{ width: `${(questionCount / maxQuestions) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="luxury-card p-5">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-3 flex items-center gap-2">
                        <Shield size={12} /> Tips
                    </div>
                    <ul className="text-xs text-text-secondary space-y-2">
                        <li>• Be specific with examples</li>
                        <li>• Use the STAR method</li>
                        <li>• Take your time to think</li>
                        <li>• Be authentic</li>
                    </ul>
                </div>
            </div>
        </motion.div>
    );
};

export default AIInterviewRoom;
