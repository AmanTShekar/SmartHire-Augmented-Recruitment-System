import React, { useRef, useState, useEffect, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Shield, Camera, AlertCircle, CheckCircle2, UserCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SentinelVerify = ({ candidateId, onVerified }) => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [step, setStep] = useState('profile-upload'); // profile-upload, id-upload, face-180, success, failed
    const [session, setSession] = useState(null);
    const [currentChallenge, setCurrentChallenge] = useState('look_center');
    const [message, setMessage] = useState('Step 1: Upload a clear, current portrait');
    const [ws, setWs] = useState(null);

    // Initialize Handshake
    const startHandshake = async () => {
        try {
            const formData = new FormData();
            formData.append('candidate_id', candidateId);
            const res = await fetch('/api/proctor/handshake', { method: 'POST', body: formData });
            const data = await res.json();
            setSession(data);
            setStep('profile-upload');
            setCurrentChallenge(data.first_challenge);
        } catch (err) {
            console.error("Handshake failed", err);
        }
    };

    useEffect(() => {
        startHandshake();
    }, [candidateId]);

    // Step 1: Upload Profile Portrait
    const handleProfileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('session_id', session.session_id);
        formData.append('profile_photo', file);

        try {
            setMessage('Processing profile portrait...');
            await fetch('/api/proctor/verify-profile', { method: 'POST', body: formData });
            setStep('id-upload');
            setMessage('Step 2: Upload your Government ID');
        } catch (err) {
            console.error("Profile Upload failed", err);
        }
    };

    // Step 2: Upload ID Card
    const handleIdUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('session_id', session.session_id);
        formData.append('id_card', file);

        try {
            setMessage('Processing ID document...');
            await fetch('/api/proctor/verify-id', { method: 'POST', body: formData });
            setStep('face-180');
            setMessage(`Biometric Sync: ${currentChallenge.replace('_', ' ').toUpperCase()}`);
        } catch (err) {
            console.error("ID Upload failed", err);
        }
    };

    // Step 3: Connect WebSocket for 180 Face Verification
    useEffect(() => {
        if (step === 'face-180') {
            const socket = new WebSocket(`ws://${window.location.host}/api/proctor/ws/sentinel`);
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'handshake_result') {
                    const res = data.data;
                    if (res.status === 'progressing') {
                        setCurrentChallenge(res.next_challenge);
                        setMessage(`Target Position: ${res.next_challenge.replace('_', ' ').toUpperCase()}`);
                    } else if (res.verified) {
                        setStep('success');
                        setMessage('Verification Complete');
                        onVerified(res);
                    } else if (res.error) {
                        setMessage(res.error);
                    }
                }
            };
            setWs(socket);
            return () => socket.close();
        }
    }, [step]);

    // Capture loop for 180-degree rotation analysis
    useEffect(() => {
        let interval;
        if (step === 'face-180' && ws && ws.readyState === WebSocket.OPEN) {
            interval = setInterval(() => {
                const imageSrc = webcamRef.current.getScreenshot();
                if (imageSrc) {
                    ws.send(JSON.stringify({
                        type: 'handshake_frame',
                        session_id: session.session_id,
                        frame: imageSrc
                    }));
                }
            }, 500);
        }
        return () => clearInterval(interval);
    }, [step, ws, session]);

    return (
        <div className="max-w-xl mx-auto p-8 rounded-2xl bg-black/60 border border-emerald-500/30 backdrop-blur-xl shadow-[0_0_50px_rgba(16,185,129,0.1)]">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40">
                    <Shield className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">SmartHire Sentinel</h2>
                    <p className="text-xs text-emerald-400/70 font-mono uppercase tracking-widest">Biometric Handshake v3.0</p>
                </div>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-white/10 mb-6 group">
                <AnimatePresence mode="wait">
                    {(step === 'profile-upload' || step === 'id-upload') ? (
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center"
                        >
                            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20 shadow-inner">
                                {step === 'profile-upload' ? <UserCheck className="w-10 h-10 text-emerald-400" /> : <Camera className="w-10 h-10 text-emerald-400" />}
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{step === 'profile-upload' ? 'Profile Portrait' : 'Government ID'}</h3>
                            <p className="text-slate-400 text-sm mb-6 max-w-[280px] leading-relaxed">
                                {step === 'profile-upload'
                                    ? 'Upload a clear, front-facing photo of yourself to serve as your biometric reference.'
                                    : 'Upload a clear image of your ID card. We will match this against your profile portrait.'}
                            </p>
                            <label className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl cursor-pointer transition-all font-bold shadow-lg shadow-emerald-500/20 border border-white/10">
                                SELECT FILE
                                <input type="file" className="hidden" onChange={step === 'profile-upload' ? handleProfileUpload : handleIdUpload} accept="image/*" />
                            </label>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="cam"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="relative w-full h-full"
                        >
                            <Webcam
                                ref={webcamRef}
                                audio={false}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-700"
                            />

                            {/* HUD Overlays */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-64 h-64 border-2 border-dashed border-emerald-500/30 rounded-full animate-[pulse_4s_infinite]" />
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
                            </div>

                            {/* Scanline Effect */}
                            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

                            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                            <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                            <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-4">
                <div className={`p-4 rounded-xl border flex items-center gap-3 ${step === 'failed' ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/5 border-emerald-500/20'
                    }`}>
                    {step === 'verifying' ? (
                        <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                    ) : step === 'success' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : step === 'failed' ? (
                        <AlertCircle className="w-5 h-5 text-red-400" />
                    ) : (
                        <UserCheck className="w-5 h-5 text-emerald-500" />
                    )}
                    <span className={`font-medium ${step === 'failed' ? 'text-red-400' : 'text-slate-200'}`}>
                        {message}
                    </span>
                </div>

                {step === 'liveness' && (
                    <button
                        onClick={captureAndVerify}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-lg transition-all shadow-xl shadow-emerald-900/40 border border-emerald-400/30"
                    >
                        VERIFY IDENTITY
                    </button>
                )}

                {step === 'failed' && (
                    <button
                        onClick={startHandshake}
                        className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all"
                    >
                        RETRY HANDSHAKE
                    </button>
                )}
            </div>
        </div>
    );
};

export default SentinelVerify;
