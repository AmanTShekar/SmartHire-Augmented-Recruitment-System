import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Video, VideoOff, MicOff, PhoneOff, User, Shield } from 'lucide-react';
import { useParams } from 'react-router-dom';

const InterviewRoom = () => {
    const { id } = useParams();
    const [isMicOn, setIsMicOn] = useState(true);
    const [isVideoOn, setIsVideoOn] = useState(true);

    return (
        <div className="h-full flex flex-col">
            <header className="mb-10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-2">Neural Synchronization</h1>
                    <p className="text-sm text-secondary font-medium uppercase tracking-widest">Session ID: {id?.substring(0, 8) || 'X-801'}</p>
                </div>
                <div className="px-4 py-2 border rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">Recording</span>
                </div>
            </header>

            <div className="flex-1 grid md-grid-cols-3 gap-8">
                <div className="md:col-span-2 luxury-card overflow-hidden relative bg-soft flex items-center justify-center">
                    {isVideoOn ? (
                        <div className="text-center opacity-30">
                            <User size={64} strokeWidth={1} className="mb-4" />
                            <p className="text-xs font-bold tracking-widest uppercase">Stream Active</p>
                        </div>
                    ) : (
                        <VideoOff size={48} className="text-secondary" />
                    )}

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                        <ControlButton icon={isMicOn ? <Mic size={20} /> : <MicOff size={20} />} active={isMicOn} onClick={() => setIsMicOn(!isMicOn)} />
                        <ControlButton icon={isVideoOn ? <Video size={20} /> : <VideoOff size={20} />} active={isVideoOn} onClick={() => setIsVideoOn(!isVideoOn)} />
                        <button className="p-4 rounded-lg bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition">
                            <PhoneOff size={20} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-8">
                    <div className="luxury-card flex-1 p-6 flex flex-col">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-6">AI Feedback</h3>
                        <div className="space-y-4">
                            <p className="text-xs text-secondary">Awaiting candidate response...</p>
                        </div>
                    </div>
                    <div className="luxury-card p-6">
                        <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-4">Metics</h3>
                        <div className="space-y-4">
                            <div className="text-xs font-bold flex justify-between">
                                <span>Confidence</span>
                                <span>84%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-4/5" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ControlButton = ({ icon, active, onClick }) => (
    <button
        onClick={onClick}
        className={`p-4 rounded-lg transition ${active ? 'luxury-card hover:bg-white/5' : 'bg-red-500/20 text-red-500'}`}
    >
        {icon}
    </button>
);

export default InterviewRoom;
