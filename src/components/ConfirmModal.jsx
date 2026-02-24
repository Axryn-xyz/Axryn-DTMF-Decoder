import { motion, AnimatePresence } from 'framer-motion';

export default function ConfirmModal({ isOpen, onClose, onConfirm }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="brutalist-container"
                        style={{
                            maxWidth: '90%',
                            width: '400px',
                            backgroundColor: 'var(--bg-color)',
                            color: 'var(--text-color)',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2rem'
                        }}
                    >
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>CLEAR ALL SEQUENCES?</h2>
                        <p style={{ fontFamily: 'var(--font-mono)' }}>This action is irreversible. All captured data will be lost.</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={onClose}
                                style={{ padding: '0.75rem 1.5rem', flex: 1 }}
                            >
                                ABORT
                            </button>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: 'var(--accent-red)',
                                    color: 'white',
                                    flex: 1
                                }}
                            >
                                PROCEED
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
