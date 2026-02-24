<div align="center">

# 🎛️ AXRYN DTMF Decoder

[![Axryn](https://img.shields.io/badge/AXRYN-HACKER_AESTHETICS-050505?style=for-the-badge&logo=react&logoColor=00ff00)](https://github.com/Axryn-xyz)
[![Vite](https://img.shields.io/badge/Built_With-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/Framework-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Framer Motion](https://img.shields.io/badge/Animation-Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-MIT-FF3333?style=for-the-badge)](./LICENSE)

<p align="center">
  A Brutalist, web-based Dual-Tone Multi-Frequency (DTMF) decoder.<br> Analyzes microphone audio in real-time to detect keypad frequencies and organize them into captured sequences.
</p>

</div>

---

## ✨ Features
- 🎙️ **Real-Time Decoding**: Utilizes the Web Audio API to process FFT data and isolate DTMF row/column frequency pairs.
- 📝 **Sequence Capture**: Automatically groups consecutive digits into draggable "sticky note" sequences based on pause durations.
- 🎨 **Brutalist UI**: Features high-contrast themes (Light, Dark, Hacker), CRT scanline overlays, glitch animations, and procedural noise grids.
- 🗃️ **Workspace Management**: Pin sequences to the board, drag them around, or clear the workspace completely.

## ⚙️ How it Works

The application is built using **React** and **Framer Motion** for UI/animations, and raw **Web Audio API** for signal processing. 

### 📡 Audio Processing (`useDTMFDecoder.js`)
1. **Microphone Access**: Requests raw, un-processed audio (disabling echo cancellation and noise suppression for accurate frequency reading).
2. **Frequency Analysis**: Feeds the audio stream into an `AnalyserNode` with an FFT size of 4096. 
3. **Peak Detection**: On every animation frame, the hook scans the frequency bins for amplitude peaks matching the standard DTMF rows (697Hz, 770Hz, 852Hz, 941Hz) and columns (1209Hz, 1336Hz, 1477Hz, 1633Hz).
4. **Validation**: If a valid row and column peak cross the amplitude threshold simultaneously, the corresponding keypad character is registered. 
5. **Sequencing**: A debounce and timeout system handles grouping. If silence exceeds the timeout threshold (1500ms), the current string of digits is committed to state as a new "sticky note" object.

### 🖥️ UI & Aesthetics (`App.jsx` & `index.css`)
- **State Management**: Sticky notes are held in an array of objects containing the sequence string, a unique ID, a timestamp, and UI state flags (like `isPinned`).
- **Framer Motion**: Handles all layout animations. Elements stagger in on load, and sticky notes use `<motion.div drag>` for physics-based layout interactions. 
- **Theming**: CSS variables are swapped out at the `:root` level via a `data-theme` attribute on the `<html>` document.
- **Effects**: The background grid is constructed procedurally using `linear-gradient`, layered under an SVG noise filter. CRT scanlines are generated via an overlaying pseudo-element `::after` on the body.

---

## 🚀 Setup & Deployment

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the Vite development server. 

---

## 📄 License
MIT License. 

**Requirements for Reuse:**
> [!IMPORTANT]
> The source code is free to use and distribute, however **credit to AXRYN is legally required** for any copies, modifications, or redistribution of this software or its forks. 

<div align="center">
  <img src="https://img.shields.io/badge/MAINTAINED_BY-AXRYN-000000?style=for-the-badge&logoColor=00ff00" alt="Maintained by AXRYN" />
</div>
