import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function IntroOverlay() {
    const [isVisible, setIsVisible] = useState(true);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'var(--bg-color)',
                        zIndex: 9000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2rem'
                    }}
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                        className="brutalist-container"
                        style={{ maxWidth: '700px', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}
                    >
                        <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', margin: 0, lineHeight: 1 }}>SYSTEM INITIALIZED</h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontFamily: 'var(--font-mono)' }}>
                            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                                <strong>MISSION:</strong> Detect and decode Dual-Tone Multi-Frequency (DTMF) signals.
                            </p>
                            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '1rem', lineHeight: '1.5' }}>
                                <li><strong>GRANT ACCESS:</strong> Click "Start Listening" and allow microphone permissions.</li>
                                <li><strong>PLAY TONES:</strong> Use a phone dialer or online generator near your microphone.</li>
                                <li><strong>CAPTURE:</strong> The system will decode digits in real-time. Pauses will automatically group digits into sequences.</li>
                                <li><strong>ORGANIZE:</strong> Drag sequences around, pin them to the board, or delete them.</li>
                                <li><strong>CUSTOMIZE:</strong> Toggle system aesthetics using the theme switcher.</li>
                            </ul>
                        </div>

                        <button
                            onClick={() => setIsVisible(false)}
                            style={{
                                padding: '1rem 2rem',
                                fontSize: '1.5rem',
                                marginTop: '2rem',
                                backgroundColor: 'var(--accent-red)',
                                color: 'white'
                            }}
                        >
                            ACKNOWLEDGE
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
