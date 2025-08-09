// Theme Management
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);
themeToggle.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// Typing Effect
const titles = [
    'Software Developer',
    'Web Designer',
    'F1 Enthusiast',
    'Data Engineer',
    'Game Developer',
    'Problem Solver',
    'Full Stack Developer'
];

let currentTitleIndex = 0;
let currentText = '';
let isDeleting = false;
const typingElement = document.getElementById('typingText');

function typeEffect() {
    const fullText = titles[currentTitleIndex];
    
    if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
    } else {
        currentText = fullText.substring(0, currentText.length + 1);
    }
    
    typingElement.textContent = currentText;
    
    let speed = isDeleting ? 50 : 100;
    
    if (!isDeleting && currentText === fullText) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentTitleIndex = (currentTitleIndex + 1) % titles.length;
        speed = 500;
    }
    
    setTimeout(typeEffect, speed);
}

// Command Palette
const commandPalette = document.getElementById('commandPalette');
const commandInput = document.getElementById('commandInput');
const commandList = document.getElementById('commandList');
const cmdTrigger = document.getElementById('cmdTrigger');

let selectedCommand = 0;

function showCommandPalette() {
    commandPalette.classList.add('active');
    commandInput.focus();
    updateCommandSelection();
}

function hideCommandPalette() {
    commandPalette.classList.remove('active');
    commandInput.value = '';
    selectedCommand = 0;
}

function updateCommandSelection() {
    const commands = commandList.querySelectorAll('.command-item');
    commands.forEach((cmd, index) => {
        cmd.classList.toggle('selected', index === selectedCommand);
    });
}

function executeCommand(action) {
    switch(action) {
        case 'home':
            document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'skills':
            document.getElementById('skills').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'projects':
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'contact':
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'theme':
            themeToggle.click();
            break;
    }
    hideCommandPalette();
}

// Event Listeners
cmdTrigger.addEventListener('click', showCommandPalette);

document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        showCommandPalette();
    } else if (e.key === 'Escape') {
        hideCommandPalette();
    } else if (commandPalette.classList.contains('active')) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedCommand = Math.min(selectedCommand + 1, commandList.children.length - 1);
            updateCommandSelection();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedCommand = Math.max(selectedCommand - 1, 0);
            updateCommandSelection();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const action = commandList.children[selectedCommand].dataset.action;
            executeCommand(action);
        }
    }
});

commandList.addEventListener('click', (e) => {
    const commandItem = e.target.closest('.command-item');
    if (commandItem) {
        executeCommand(commandItem.dataset.action);
    }
});

// Click outside to close
document.addEventListener('click', (e) => {
    if (!commandPalette.contains(e.target) && !cmdTrigger.contains(e.target)) {
        hideCommandPalette();
    }
});

// Scroll Progress
function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.getElementById('scrollProgress').style.width = scrollPercent + '%';
}

// Navigation Active State
function updateActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Form Handling
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('.submit-button');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    submitBtn.textContent = 'Sent! ✓';
    setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        e.target.reset();
    }, 2000);
});

// Smooth Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

//Starting
window.addEventListener('load', () => {
    // Start typing effect
    setTimeout(typeEffect, 1000);
    
    // Observe fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
});

// Scroll Event Listener
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            updateScrollProgress();
            updateActiveNav();
            ticking = false;
        });
        ticking = true;
    }
});

// Projects Carousel Touch Support
let isDown = false;
let startX;
let scrollLeft;
const carousel = document.getElementById('projectsCarousel');

carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
    carousel.style.cursor = 'grabbing';
});

carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
});

carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.style.cursor = 'grab';
});

carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
});

// Touch support for mobile
let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

carousel.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const scrollAmount = 300;
        if (diff > 0) {
            carousel.scrollLeft += scrollAmount;
        } else {
            carousel.scrollLeft -= scrollAmount;
        }
    }
}