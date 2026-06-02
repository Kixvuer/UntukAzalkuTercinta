// Database Soal (Diambil dari materi PDF Fitokimia)
const questionBank = [
    {
        question: "Uji apa yang mendeteksi keberadaan cincin γ-benzopiron pada Flavonoid?",
        options: ["Reaksi Cyanidin Willstatter", "Pereaksi Dragendorff", "Uji Buih (Froth Test)", "Liebermann-Burchard"],
        answer: "Reaksi Cyanidin Willstatter",
        videoUrl: "https://www.youtube.com/embed/LINK_VIDEO_FLAVONOID" // Ganti dengan link embed videomu
    },
    {
        question: "Apa warna endapan yang dihasilkan oleh Pereaksi Dragendorff jika Alkaloid positif?",
        options: ["Putih", "Jingga", "Biru Tinta", "Hijau-Biru"],
        answer: "Jingga",
        videoUrl: "https://www.youtube.com/embed/LINK_VIDEO_ALKALOID"
    },
    {
        question: "Senyawa apa yang memberikan hasil endapan merah muda saat dipanaskan dengan reagen Stiasny?",
        options: ["Tanin Galat", "Saponin", "Tanin Kondensasi", "Kuinon"],
        answer: "Tanin Kondensasi",
        videoUrl: "https://www.youtube.com/embed/LINK_VIDEO_TANIN"
    }
];

let currentDeck = [];
let currentQuestionIndex = 0;
let score = 0;
let lives = 3;
let timer;
let timeLeft = 30;

// Power-ups
let hasFreeze = true;
let hasFiftyFifty = true;

function startGame() {
    // 1. Play Music (Bypass Autoplay rule)
    document.getElementById('bgm').play().catch(e => console.log("Audio play di-block browser"));
    
    // 2. Ganti Layar
    document.getElementById('landing-page').classList.remove('active');
    document.getElementById('quiz-area').classList.add('active');

    // 3. Setup Roguelike Deck (Shuffle soal)
    currentDeck = [...questionBank].sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    lives = 3;
    updateHUD();

    loadQuestion();
}

function loadQuestion() {
    if (currentQuestionIndex >= currentDeck.length || lives <= 0) {
        // Game Over atau Menang
        return gameOver();
    }

    timeLeft = 30;
    document.getElementById('timer-display').innerText = `Waktu: ${timeLeft}s`;
    
    const qData = currentDeck[currentQuestionIndex];
    document.getElementById('question-text').innerText = qData.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    // Mengacak letak pilihan jawaban
    const shuffledOptions = [...qData.options].sort(() => Math.random() - 0.5);
    
    shuffledOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt, qData.answer, qData.videoUrl);
        optionsContainer.appendChild(btn);
    });

    startTimer(qData.videoUrl);
}

function startTimer(videoUrl) {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-display').innerText = `Waktu: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleWrongAnswer(videoUrl);
        }
    }, 1000);
}

function checkAnswer(selected, correct, videoUrl) {
    clearInterval(timer);
    if (selected === correct) {
        score += 100;
        currentQuestionIndex++;
        updateHUD();
        loadQuestion();
    } else {
        handleWrongAnswer(videoUrl);
    }
}

function handleWrongAnswer(videoUrl) {
    lives--;
    updateHUD();
    
    // Munculkan Video Penjelasan
    document.getElementById('video-frame').src = videoUrl;
    document.getElementById('video-modal').style.display = 'block';
}

function returnToMenu() {
    document.getElementById('video-modal').style.display = 'none';
    document.getElementById('video-frame').src = ''; // Stop video
    document.getElementById('quiz-area').classList.remove('active');
    document.getElementById('landing-page').classList.add('active');
}

function updateHUD() {
    document.getElementById('score-display').innerText = `Skor: ${score}`;
    document.getElementById('lives-display').innerText = `Nyawa: ${"❤️".repeat(lives)}`;
}

// Power-Up Logic (Contoh: Time Freeze)
function useTimeFreeze() {
    if(hasFreeze) {
        clearInterval(timer); // Hentikan timer
        document.getElementById('timer-display').innerText = "Waktu: ❄️ DIBEKUKAN ❄️";
        hasFreeze = false;
        document.getElementById('btn-freeze').style.opacity = 0.5;
        document.getElementById('btn-freeze').disabled = true;
        
        // Aktifkan lagi setelah 10 detik
        setTimeout(() => {
            const qData = currentDeck[currentQuestionIndex];
            startTimer(qData.videoUrl);
        }, 10000);
    }
}

function useFiftyFifty() {
    if(hasFiftyFifty) {
        const qData = currentDeck[currentQuestionIndex];
        const buttons = document.querySelectorAll('#options-container button');
        let removedCount = 0;
        
        buttons.forEach(btn => {
            if(btn.innerText !== qData.answer && removedCount < 2) {
                btn.style.visibility = 'hidden';
                removedCount++;
            }
        });

        hasFiftyFifty = false;
        document.getElementById('btn-fifty').style.opacity = 0.5;
        document.getElementById('btn-fifty').disabled = true;
    }
}

function gameOver() {
    alert(`Eksplorasi Selesai! Skor Akhir: ${score}`);
    returnToMenu();
}