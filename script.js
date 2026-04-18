document.addEventListener('DOMContentLoaded', () => {
    // 1. Custom Cursor
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('button, a').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    } else {
        cursor.style.display = 'none';
        document.body.style.cursor = 'auto';
    }

    // 2. Background Particles (Floating Hearts & Sparkles)
    const particlesContainer = document.getElementById('particles-container');
    const particleTypes = ['❤️', '✨', '💖', '⭐', '🎈'];

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.textContent = particleTypes[Math.floor(Math.random() * particleTypes.length)];
        
        const size = Math.random() * 20 + 10 + 'px';
        particle.style.fontSize = size;
        particle.style.left = Math.random() * 100 + 'vw';
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        
        const duration = Math.random() * 5 + 5 + 's';
        particle.style.animationDuration = duration;
        
        particlesContainer.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, parseFloat(duration) * 1000);
    }

    setInterval(createParticle, 300);

    // 3. Audio Logic
    const musicToggle = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    musicToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicToggle.textContent = '🔇';
        } else {
            bgMusic.play().catch(e => console.log("Audio play failed common browser restriction:", e));
            musicToggle.textContent = '🎵';
        }
        isPlaying = !isPlaying;
    });

    // 4. Navigation & Transitions
    const heroSection = document.getElementById('hero');
    const surpriseSection = document.getElementById('surprise');
    const memoriesSection = document.getElementById('memories');
    const specialSection = document.getElementById('special');
    const finalSection = document.getElementById('final');

    const surpriseBtn = document.getElementById('surprise-btn');
    const nextToMemoriesBtn = document.getElementById('next-to-memories');
    const nextToSpecialBtn = document.getElementById('next-to-special');
    const celebrateBtn = document.getElementById('celebrate-btn');

    const typingElement = document.getElementById('typing-text');
    const message = "My dear sister, you are the sunshine in my darkest days and the sparkle in my happiest moments. I am so lucky to have you as my sister. Today is all about you! 🎂✨";

    function showSection(current, next, callback) {
        current.classList.add('fade-out');
        setTimeout(() => {
            current.classList.add('hidden');
            next.classList.remove('hidden');
            next.classList.add('fade-in');
            if (callback) callback();
        }, 500);
    }

    surpriseBtn.addEventListener('click', () => {
        showSection(heroSection, surpriseSection, () => {
            typeWriter(message, typingElement, 50);
        });
        // Auto-play music if not already playing (might be blocked by browser)
        if (!isPlaying) {
            bgMusic.play().then(() => {
                isPlaying = true;
                musicToggle.textContent = '🎵';
            }).catch(() => {});
        }
    });

    nextToMemoriesBtn.addEventListener('click', () => {
        showSection(surpriseSection, memoriesSection);
    });

    nextToSpecialBtn.addEventListener('click', () => {
        showSection(memoriesSection, specialSection);
    });

    celebrateBtn.addEventListener('click', () => {
        showSection(specialSection, finalSection, () => {
            triggerConfetti();
        });
    });

    // 5. Typing Animation
    function typeWriter(text, element, speed) {
        let i = 0;
        element.innerHTML = "";
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // 6. Confetti Cannon (Vanilla JS)
    function triggerConfetti() {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const colors = ['#ff75a0', '#f3e8ff', '#ffdab9', '#87ceeb'];

        (function frame() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) return;

            const particleCount = 5;
            for(let i = 0; i < particleCount; i++) {
                createConfettiPiece(colors);
            }

            requestAnimationFrame(frame);
        }());
    }

    function createConfettiPiece(colors) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.zIndex = 1000;
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.borderRadius = '2px';
        
        document.body.appendChild(confetti);

        const velocityX = (Math.random() - 0.5) * 10;
        const velocityY = Math.random() * 5 + 5;
        let posX = parseFloat(confetti.style.left);
        let posY = -10;

        function update() {
            posY += velocityY;
            posX += velocityX;
            confetti.style.top = posY + 'px';
            confetti.style.left = posX + 'px';
            confetti.style.transform = `rotate(${posY}deg)`;

            if (posY < window.innerHeight) {
                requestAnimationFrame(update);
            } else {
                confetti.remove();
            }
        }
        update();
    }

    // 7. Reveal Sections on Scroll (Optional Reveal effect)
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
