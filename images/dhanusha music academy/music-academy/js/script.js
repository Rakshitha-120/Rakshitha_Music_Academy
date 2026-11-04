/* ==========================================================================
   DHANU MUSIC ACADEMY - MASTER JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ================= 1. SMART AUDIO AUTO-DETECTION =================
    const audioSources = [
        "assets/telugu-song (3).mp3",
        "assets/audio/telugu-song.mp3",
        "assets/telugu-song.mp3",
        "https://cdn.pixabay.com/download/audio/2022/05/16/audio_db6591201e.mp3?filename=piano-moment-9835.mp3"
    ];

    let currentSourceIdx = 0;
    let isPlaying = false;
    let audioElement = new Audio(audioSources[0]);

    const playPauseBtn = document.getElementById('playPauseBtn');
    const visualizerWave = document.getElementById('visualizerWave');
    const volumeSlider = document.getElementById('volumeSlider');
    const trackTitle = document.getElementById('playerTrackTitle');
    const trackArtist = document.getElementById('playerTrackArtist');

    audioElement.addEventListener('error', () => {
        if (currentSourceIdx < audioSources.length - 1) {
            currentSourceIdx++;
            audioElement.src = audioSources[currentSourceIdx];
            if (isPlaying) audioElement.play().catch(e => console.log(e));
        }
    });

    function togglePlay() {
        if (!isPlaying) {
            audioElement.play().then(() => {
                isPlaying = true;
                if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                if (visualizerWave) visualizerWave.classList.add('playing');
                if (trackTitle) trackTitle.textContent = "Telugu Melody Track";
                if (trackArtist) trackArtist.textContent = "Dhanu Music Academy";
            }).catch(e => {
                currentSourceIdx = (currentSourceIdx + 1) % audioSources.length;
                audioElement.src = audioSources[currentSourceIdx];
                audioElement.play();
                isPlaying = true;
                if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
                if (visualizerWave) visualizerWave.classList.add('playing');
            });
        } else {
            audioElement.pause();
            isPlaying = false;
            if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            if (visualizerWave) visualizerWave.classList.remove('playing');
        }
    }

    if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlay);
    if (volumeSlider) volumeSlider.addEventListener('input', (e) => audioElement.volume = e.target.value);

    // ================= 2. VIDEO 7-SECOND START TIME =================
    const concertVideo = document.getElementById('nativeConcertVideo');
    if (concertVideo) {
        concertVideo.addEventListener('play', () => {
            if (concertVideo.currentTime < 7) {
                concertVideo.currentTime = 7;
            }
        });
    }

    // ================= 3. VIRTUAL PIANO SYNTHESIZER =================
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx = null;

    function initAudioContext() {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    const noteFrequencies = {
        'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
        'E4': 329.63, 'F4': 349.23, 'F#4': 369.99, 'G4': 392.00,
        'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
        'C5': 523.25, 'C#5': 554.37, 'D5': 587.33
    };

    function playPianoNote(note) {
        initAudioContext();
        const freq = noteFrequencies[note];
        if (!freq) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        gain.gain.setValueAtTime(0.6, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 2.0);
    }

    document.querySelectorAll('.piano-keyboard .key').forEach(key => {
        key.addEventListener('mousedown', () => {
            playPianoNote(key.dataset.note);
            key.classList.add('active');
        });
        key.addEventListener('mouseup', () => key.classList.remove('active'));
    });

    const keyMap = { 'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4', 'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4', 'u': 'A#4', 'j': 'B4', 'k': 'C5', 'o': 'C#5', 'l': 'D5' };
    window.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        const note = keyMap[e.key.toLowerCase()];
        if (note) {
            const keyEl = document.querySelector(`.piano-keyboard .key[data-note="${note}"]`);
            if (keyEl && !keyEl.classList.contains('active')) {
                playPianoNote(note);
                keyEl.classList.add('active');
            }
        }
    });
    window.addEventListener('keyup', (e) => {
        const note = keyMap[e.key.toLowerCase()];
        if (note) {
            const keyEl = document.querySelector(`.piano-keyboard .key[data-note="${note}"]`);
            if (keyEl) keyEl.classList.remove('active');
        }
    });

    // ================= 4. "FIND YOUR MUSICAL SOUL" QUIZ MODAL =================
    const startQuizBtn = document.getElementById('startQuizBtn');
    const openQuizBtn = document.getElementById('openQuizBtn');
    const quizModal = document.getElementById('quizModal');
    const closeQuizModal = document.getElementById('closeQuizModal');
    const quizModalBody = document.getElementById('quizModalBody');

    const quizQuestions = [
        {
            q: "What style of sound makes your heart beat fastest?",
            options: [
                { text: "Lead singing & vocal harmonies", course: "Vocal Arts", mentor: "Prof. Dhanusha" },
                { text: "Acoustic chords & fingerstyle melodies", course: "Acoustic Guitar", mentor: "Prof. Meghana" },
                { text: "High-energy rock guitar solos & riffs", course: "Electric Guitar", mentor: "Prof. Sony" },
                { text: "Classical concert grand pianos & symphonies", course: "Violin / Piano", mentor: "Prof. Pravallika" }
            ]
        }
    ];

    function showQuizStep(stepIdx) {
        if (!quizModalBody) return;
        const data = quizQuestions[stepIdx];
        quizModalBody.innerHTML = `
            <div class="quiz-modal-inner text-center">
                <span class="royal-badge"><i class="fa-solid fa-sparkles"></i> ACOUSTIC TALENT FINDER</span>
                <h2 style="margin: 15px 0 20px; font-size: 1.5rem;">${data.q}</h2>
                <div style="display:flex; flex-direction:column; gap:10px;">
                    ${data.options.map((opt) => `
                        <button class="btn-secondary-royal" style="text-align:left; justify-content:space-between;" onclick="finishQuiz('${opt.course}', '${opt.mentor}')">
                            <span>${opt.text}</span>
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;
    }

    window.finishQuiz = function(course, mentor) {
        quizModalBody.innerHTML = `
            <div class="text-center" style="padding: 10px;">
                <div class="f-icon" style="margin: 0 auto 15px;"><i class="fa-solid fa-crown"></i></div>
                <h2 class="gold-text">Your Perfect Match: ${course}</h2>
                <p style="margin: 12px 0 20px;">You are naturally attuned for the <strong>${course} Program</strong> under direct mentorship of <strong>${mentor}</strong>.</p>
                <a href="admissions.html?course=${encodeURIComponent(course)}" class="btn-royal-gold" style="margin: 0 auto;">
                    <span>Enroll with ${mentor}</span>
                    <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        `;
    };

    if (startQuizBtn) startQuizBtn.addEventListener('click', () => { showQuizStep(0); quizModal.classList.add('active'); });
    if (openQuizBtn) openQuizBtn.addEventListener('click', () => { showQuizStep(0); quizModal.classList.add('active'); });
    if (closeQuizModal) closeQuizModal.addEventListener('click', () => quizModal.classList.remove('active'));

    // ================= 5. FEE CALCULATOR =================
    const calcCourse = document.getElementById('calcCourse');
    const calcTrack = document.getElementById('calcTrack');
    const calcScholarship = document.getElementById('calcScholarship');
    const finalFeeDisplay = document.getElementById('finalFeeDisplay');
    const savingsTag = document.getElementById('savingsTag');

    function calculateTuition() {
        if (!calcCourse || !finalFeeDisplay) return;
        const base = parseFloat(calcCourse.value);
        const trackDisc = calcTrack.value === "2" ? 0.10 : (calcTrack.value === "3" ? 0.20 : 0);
        const scholDisc = parseFloat(calcScholarship.value) / 100;
        const finalPrice = Math.round(base * (1 - (trackDisc + scholDisc)));
        finalFeeDisplay.textContent = `$${finalPrice}`;
        if (savingsTag) savingsTag.textContent = `✨ You save $${base - finalPrice}/semester with scholarship!`;
    }

    if (calcCourse) {
        calcCourse.addEventListener('change', calculateTuition);
        calcTrack.addEventListener('change', calculateTuition);
        calcScholarship.addEventListener('change', calculateTuition);
    }

    // ================= 6. AUDITION PASS GENERATOR =================
    const auditionForm = document.getElementById('auditionForm');
    const passModal = document.getElementById('passModal');
    const passTicketContent = document.getElementById('passTicketContent');
    const closePassModal = document.getElementById('closePassModal');

    if (auditionForm) {
        auditionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('fullName').value;
            const prog = document.getElementById('programSelect').value;
            const date = document.getElementById('auditionDate').value || "15th October 2026";
            const passId = "DHANU-" + Math.floor(100000 + Math.random() * 900000);

            if (passTicketContent) {
                passTicketContent.innerHTML = `
                    <div class="royal-badge"><i class="fa-solid fa-crown"></i> OFFICIAL AUDITION PASS</div>
                    <h2 class="gold-text" style="margin: 10px 0;">Dhanu Music Academy</h2>
                    <strong style="color: var(--gold-light); font-size: 1.1rem;">${passId}</strong>
                    <div class="pass-grid">
                        <div><small>Candidate</small><strong>${name}</strong></div>
                        <div><small>Program</small><strong>${prog}</strong></div>
                        <div><small>Audition Date</small><strong>${date}</strong></div>
                        <div><small>Status</small><strong style="color: #4ade80;">Approved & Confirmed</strong></div>
                    </div>
                    <button class="btn-royal-gold" onclick="window.print()" style="margin-top: 15px;">
                        <i class="fa-solid fa-print"></i> Print Official Pass
                    </button>
                `;
            }
            if (passModal) passModal.classList.add('active');
            auditionForm.reset();
        });
    }

    if (closePassModal) closePassModal.addEventListener('click', () => passModal.classList.remove('active'));
});