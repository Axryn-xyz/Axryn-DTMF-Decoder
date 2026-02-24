# AXRYN DTMF Decoder

![Est. 2026](https://img.shields.io/badge/AXRYN-EST.%202026-black?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

A Brutalist, web-based Dual-Tone Multi-Frequency (DTMF) decoder. Analyzes microphone audio in real-time to detect keypad frequencies and organize them into captured sequences.

## Features
- **Real-Time Decoding**: Utilizes the Web Audio API to process FFT data and isolate DTMF row/column frequency pairs.
- **Sequence Capture**: Automatically groups consecutive digits into draggable "sticky note" sequences based on pause durations.
- **Brutalist UI**: Features high-contrast themes (Light, Dark, Hacker), CRT scanline overlays, glitch animations, and procedural noise grids.
- **Workspace Management**: Pin sequences to the board, drag them around, or clear the workspace completely.

## How it Works

The application is built using React and Framer Motion for UI/animations, and raw Web Audio API for signal processing. 

### Audio Processing (`useDTMFDecoder.js`)
1. **Microphone Access**: Requests raw, un-processed audio (disabling echo cancellation and noise suppression for accurate frequency reading).
2. **Frequency Analysis**: Feeds the audio stream into an `AnalyserNode` with an FFT size of 4096. 
3. **Peak Detection**: On every animation frame, the hook scans the frequency bins for amplitude peaks matching the standard DTMF rows (697Hz, 770Hz, 852Hz, 941Hz) and columns (1209Hz, 1336Hz, 1477Hz, 1633Hz).
4. **Validation**: If a valid row and column peak cross the amplitude threshold simultaneously, the corresponding keypad character is registered. 
5. **Sequencing**: A debounce and timeout system handles grouping. If silence exceeds the timeout threshold (1500ms), the current string of digits is committed to state as a new "sticky note" object.

### UI & Aesthetics (`App.jsx` & `index.css`)
- **State Management**: Sticky notes are held in an array of objects containing the sequence string, a unique ID, a timestamp, and UI state flags (like `isPinned`).
- **Framer Motion**: Handles all layout animations. Elements stagger in on load, and sticky notes use `<motion.div drag>` for physics-based layout interactions. 
- **Theming**: CSS variables are swapped out at the `:root` level via a `data-theme` attribute on the `<html>` document.
- **Effects**: The background grid is constructed procedurally using `linear-gradient`, layered under an SVG noise filter. CRT scanlines are generated via an overlaying pseudo-element `::after` on the body.

## Setup & Deployment

1. Clone the repository.
2. Run `npm install` to install dependencies (`react`, `react-dom`, `framer-motion`, `@studio-freight/lenis`, `lucide-react`, etc.)
3. Run `npm run dev` to start the Vite development server. 

## License
MIT License. **Credit to AXRYN is required for any reuse or distribution of this code.**
