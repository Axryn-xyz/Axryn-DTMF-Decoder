import { useState, useEffect, useRef } from 'react';

const DTMF_FREQUENCIES = {
    rows: [697, 770, 852, 941],
    cols: [1209, 1336, 1477, 1633],
};

const KEY_MAP = [
    ['1', '2', '3', 'A'],
    ['4', '5', '6', 'B'],
    ['7', '8', '9', 'C'],
    ['*', '0', '#', 'D']
];

export function useDTMFDecoder() {
    const [isListening, setIsListening] = useState(false);
    const [activeDigit, setActiveDigit] = useState(null);
    const [stickyNotes, setStickyNotes] = useState([]);

    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const streamRef = useRef(null);
    const animationFrameRef = useRef(null);

    const currentSequenceRef = useRef("");
    const silenceStartRef = useRef(null);
    const lastDetectedRef = useRef({ digit: null, time: 0 });

    const THRESHOLD = -60; // dB
    const SEQUENCE_TIMEOUT = 1500; // ms of silence to cut off sequence

    // Find the strongest peak near target frequencies
    const getIndexForFreq = (freq, sampleRate, fftSize) => {
        return Math.round((freq * fftSize) / sampleRate);
    };

    const getPeakAmplitude = (data, index, window = 2) => {
        let max = -Infinity;
        for (let i = Math.max(0, index - window); i <= Math.min(data.length - 1, index + window); i++) {
            if (data[i] > max) max = data[i];
        }
        return max;
    };

    useEffect(() => {
        if (!isListening) {
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            return;
        }

        const initAudio = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: false,
                        noiseSuppression: false,
                        autoGainControl: false
                    }
                });
                streamRef.current = stream;

                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                audioContextRef.current = audioCtx;

                const analyser = audioCtx.createAnalyser();
                analyser.fftSize = 4096;
                analyser.smoothingTimeConstant = 0.5;
                analyserRef.current = analyser;

                const source = audioCtx.createMediaStreamSource(stream);
                source.connect(analyser);

                const dataArray = new Float32Array(analyser.frequencyBinCount);
                const sampleRate = audioCtx.sampleRate;

                const processAudio = () => {
                    analyser.getFloatFrequencyData(dataArray);

                    // Find row peak
                    let rowPeakObj = { freq: null, amp: -Infinity, index: -1 };
                    for (let i = 0; i < DTMF_FREQUENCIES.rows.length; i++) {
                        const targetIdx = getIndexForFreq(DTMF_FREQUENCIES.rows[i], sampleRate, analyser.fftSize);
                        const amp = getPeakAmplitude(dataArray, targetIdx, 2);
                        if (amp > rowPeakObj.amp && amp > THRESHOLD) {
                            rowPeakObj = { freq: DTMF_FREQUENCIES.rows[i], amp, index: i };
                        }
                    }

                    // Find col peak
                    let colPeakObj = { freq: null, amp: -Infinity, index: -1 };
                    for (let i = 0; i < DTMF_FREQUENCIES.cols.length; i++) {
                        const targetIdx = getIndexForFreq(DTMF_FREQUENCIES.cols[i], sampleRate, analyser.fftSize);
                        const amp = getPeakAmplitude(dataArray, targetIdx, 2);
                        if (amp > colPeakObj.amp && amp > THRESHOLD) {
                            colPeakObj = { freq: DTMF_FREQUENCIES.cols[i], amp, index: i };
                        }
                    }

                    const now = Date.now();

                    if (rowPeakObj.index !== -1 && colPeakObj.index !== -1) {
                        const key = KEY_MAP[rowPeakObj.index][colPeakObj.index];

                        // Enforce strictly numbers 0-9
                        if (/^[0-9]$/.test(key)) {
                            silenceStartRef.current = null;

                            // Debounce the key
                            if (lastDetectedRef.current.digit !== key || (now - lastDetectedRef.current.time > 300)) {
                                setActiveDigit({ digit: key, time: now });
                                currentSequenceRef.current += key;
                                lastDetectedRef.current = { digit: key, time: now };
                                console.log("Detected Number:", key);
                            } else {
                                // Update time to keep active digit valid
                                lastDetectedRef.current.time = now;
                            }
                        }
                    } else {
                        // Calculate silence/release
                        if (lastDetectedRef.current.digit && (now - lastDetectedRef.current.time > 150)) {
                            setActiveDigit(null);
                            lastDetectedRef.current.digit = null;
                        }

                        if (!silenceStartRef.current) {
                            silenceStartRef.current = now;
                        }

                        if (currentSequenceRef.current.length > 0 && (now - silenceStartRef.current > SEQUENCE_TIMEOUT)) {
                            // Sequence timeout, add to array
                            const newNote = {
                                id: Math.random().toString(36).substr(2, 9),
                                sequence: currentSequenceRef.current,
                                timestamp: Date.now(),
                                color: Math.random() > 0.5 ? 'yellow' : 'blue',
                                isPinned: false
                            };

                            setStickyNotes(prev => {
                                // Prevent duplicate rapid fires
                                if (prev.length > 0 && prev[0].sequence === newNote.sequence && (now - prev[0].timestamp < 2000)) {
                                    return prev;
                                }
                                return [newNote, ...prev];
                            });
                            currentSequenceRef.current = "";
                            silenceStartRef.current = null;
                        }
                    }

                    animationFrameRef.current = requestAnimationFrame(processAudio);
                };

                processAudio();
            } catch (err) {
                console.error("Error accessing mic:", err);
                setIsListening(false);
            }
        };

        initAudio();

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, [isListening]);

    return { isListening, setIsListening, activeDigit, stickyNotes, setStickyNotes };
}
