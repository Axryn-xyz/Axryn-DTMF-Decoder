import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Pin } from 'lucide-react';
import { useDTMFDecoder } from './hooks/useDTMFDecoder';
import Lenis from '@studio-freight/lenis';
import ConfirmModal from './components/ConfirmModal';
import IntroOverlay from './components/IntroOverlay';

function App() {
  const { isListening, setIsListening, activeDigit, stickyNotes, setStickyNotes } = useDTMFDecoder();
  const [currentTheme, setCurrentTheme] = useState('light');
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const constraintsRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const toggleListening = () => setIsListening(!isListening);

  const removeNote = (id) => {
    setStickyNotes(prev => prev.filter(note => note.id !== id));
  };

  const togglePin = (id) => {
    setStickyNotes(prev => prev.map(note =>
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const clearAllNotes = () => {
    setIsClearModalOpen(true);
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      <IntroOverlay />

      {/* Header and Controls */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <div>
          <h1 style={{ fontSize: '3rem', lineHeight: '1', marginBottom: '1rem' }}>DTMF<br />DECODER</h1>
          <p style={{ maxWidth: '400px', fontSize: '1rem', opacity: 0.8 }}>
            BRUTALIST TONE ANALYSIS. GRANT MICROPHONE ACCESS TO BEGIN DETECTING DUAL-TONE MULTI-FREQUENCY SIGNALS.
          </p>
        </div>

        <button
          onClick={toggleListening}
          style={{
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '1.25rem',
            backgroundColor: isListening ? 'var(--accent-red)' : 'var(--bg-color)',
            color: isListening ? 'white' : 'var(--text-color)'
          }}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          {isListening ? 'STOP LISTENING' : 'START LISTENING'}
        </button>
      </motion.header>

      {/* Active Digit Display */}
      <main style={{ minHeight: '40vh', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
        <AnimatePresence mode="wait">
          {activeDigit ? (
            <motion.div
              key={`${activeDigit.digit}-${activeDigit.time}`}
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
              transition={{ type: 'spring', damping: 12, stiffness: 200 }}
              className="brutalist-text"
              style={{ position: 'absolute' }}
            >
              {activeDigit.digit}
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              className="brutalist-text"
              style={{ position: 'absolute' }}
            >
              WAITING
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Sticky Notes Grid */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        ref={constraintsRef}
        style={{ minHeight: '60vh', position: 'relative' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: 'var(--border-thick)', paddingBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>CAPTURED SEQUENCES</h2>
          {stickyNotes.length > 0 && (
            <button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => clearAllNotes()}
              style={{
                padding: '0.5rem 1rem',
                fontSize: '1rem',
                backgroundColor: 'var(--accent-red)',
                color: 'white'
              }}
            >
              CLEAR ALL
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2rem' }}>
          <AnimatePresence>
            {stickyNotes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, y: 20 }}
                layout
                drag={!note.isPinned}
                dragConstraints={constraintsRef}
                dragElastic={0.4}
                whileDrag={{ scale: 1.05, boxShadow: 'var(--shadow-solid-hover)', cursor: 'grabbing', zIndex: 50 }}
                style={{ originY: 0, cursor: note.isPinned ? 'default' : 'grab' }}
                className={`sticky-note ${note.color === 'blue' ? 'blue' : ''}`}
              >
                {/* Visual Nail if pinned */}
                {note.isPinned && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--text-color)',
                    boxShadow: '2px 2px 0 var(--bg-color)',
                    zIndex: 20
                  }} />
                )}

                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); removeNote(note.id); }}
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '0px',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    borderLeft: 'var(--border-thin)',
                    borderBottom: 'var(--border-thin)',
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    padding: 0,
                    zIndex: 10
                  }}
                >
                  <X size={16} />
                </button>

                {/* Pin Button */}
                <button
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); togglePin(note.id); }}
                  title={note.isPinned ? "Unpin Note" : "Pin Note"}
                  style={{
                    position: 'absolute',
                    top: '0px',
                    left: '0px',
                    width: '30px',
                    height: '30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    borderRight: 'var(--border-thin)',
                    borderBottom: 'var(--border-thin)',
                    backgroundColor: note.isPinned ? 'var(--text-color)' : 'transparent',
                    color: note.isPinned ? 'var(--bg-color)' : 'var(--text-color)',
                    boxShadow: 'none',
                    padding: 0,
                    zIndex: 10
                  }}
                >
                  <Pin size={14} fill={note.isPinned ? "currentColor" : "none"} />
                </button>

                <p
                  contentEditable
                  suppressContentEditableWarning
                  onPointerDown={(e) => e.stopPropagation()} // Stop drag so user can select text
                  style={{ outline: 'none', minWidth: '50px' }}
                >
                  {note.sequence}
                </p>
                <span style={{ position: 'absolute', bottom: '10px', left: '10px', fontSize: '0.75rem', opacity: 0.5, fontFamily: 'var(--font-mono)' }}>
                  {new Date(note.timestamp).toLocaleTimeString()}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Theme Switcher */}
      <motion.footer
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
        style={{ marginTop: '4rem', paddingBottom: '4rem', borderTop: 'var(--border-thick)', paddingTop: '2rem' }}
      >
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>SYSTEM THEME</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            title="Light Theme"
            onClick={() => setCurrentTheme('light')}
            style={{
              width: '40px', height: '40px', borderRadius: '50%', padding: 0,
              backgroundColor: '#f4f4f0',
              border: currentTheme === 'light' ? '4px solid var(--accent-red)' : '2px solid var(--text-color)',
              boxShadow: '4px 4px 0px 0px var(--text-color)'
            }}
          />
          <button
            title="Dark Theme"
            onClick={() => setCurrentTheme('dark')}
            style={{
              width: '40px', height: '40px', borderRadius: '50%', padding: 0,
              backgroundColor: '#111111',
              border: currentTheme === 'dark' ? '4px solid var(--accent-red)' : '2px solid var(--text-color)',
              boxShadow: '4px 4px 0px 0px var(--text-color)'
            }}
          />
          <button
            title="Hacker Terminal"
            onClick={() => setCurrentTheme('hacker')}
            style={{
              width: '40px', height: '40px', borderRadius: '50%', padding: 0,
              backgroundColor: '#00ff00',
              border: currentTheme === 'hacker' ? '4px solid var(--accent-red)' : '2px solid var(--text-color)',
              boxShadow: '4px 4px 0px 0px var(--text-color)'
            }}
          />
        </div>
      </motion.footer>

      <footer style={{
        marginTop: '2rem',
        paddingTop: '2rem',
        borderTop: 'var(--border-thin)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: 0.6,
        fontFamily: 'var(--font-mono)',
        fontSize: '0.9rem'
      }}>
        <span>AXRYN</span>
        <span>EST. 2026</span>
      </footer>

      <ConfirmModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={() => setStickyNotes([])}
      />
    </div>
  );
}

export default App;
