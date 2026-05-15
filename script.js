const canvas = document.querySelector("#starfield");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let stars = [];
let pointer = { x: 0, y: 0 };

const CV_STORAGE_KEY = "rafly-cv-data-v1";

/**
 * Default CV data — used when localStorage is empty or invalid.
 * Replace these values with your own data later.
 */
const CV_DEFAULT_DATA = {
  documentTitle: "Rafly Maulannasir | Space Portfolio",
  person: {
    name: "Rafly Maulannasir",
    role: "Web & Machine Learning Developer",
    location: "Bandung, Indonesia",
    email: "raflymaulannasir@gmail.com",
    phone: "+62 812-3456-7890",
    website: "https://github.com/Raflymaulannasir",
    address: "Bandung, Jawa Barat",
    tags: ["IT Engineer", "Game Developer", "AI Imagery", "Vibe Coding", "Game Streamer"]
  },
  ringkasan: {
    heading: "About",
    text: "I build professional web experiences, intelligent systems, game-ready concepts, AI imagery workflows, and live creative technology with a mission-control mindset."
  },
  keterampilan: {
    heading: "Skill Stack",
    items: [
      { judul: "Graphic Design", deskripsi: "Visual composition, branding, layout, and presentation polish.", ikon: "🎨", persentase: 92 },
      { judul: "Video Editing", deskripsi: "Short-form cuts, motion pacing, and clean narrative editing.", ikon: "🎬", persentase: 93 },
      { judul: "AI Imagery", deskripsi: "Prompt-driven concepts and image workflows for digital brands.", ikon: "🤖", persentase: 90 },
      { judul: "Vibe Coding", deskripsi: "Fast prototyping, UI iteration, and creative development loops.", ikon: "💻", persentase: 85 }
    ]
  },
  pengalaman: {
    heading: "Experience",
    items: []
  },
  pendidikan: {
    heading: "Education",
    items: []
  },
  portofolio: {
    heading: "Portfolio",
    items: []
  },
  sertifikasi: {
    heading: "Certificates",
    items: []
  },
  organisasi: {
    heading: "Organizations",
    items: []
  },
  kontak: {
    heading: "Transmission",
    intro: "Replace these placeholders with your real email, WhatsApp, GitHub, LinkedIn, Instagram, YouTube, or streaming links.",
    items: [
      { label: "Email", nilai: "your.email@example.com", link: "mailto:your.email@example.com" },
      { label: "GitHub", nilai: "github.com/Raflymaulannasir", link: "https://github.com/Raflymaulannasir" },
      { label: "LinkedIn", nilai: "linkedin.com/in/raflymaulannasir", link: "https://linkedin.com/in/raflymaulannasir" },
      { label: "Streaming", nilai: "tiktok.com/@raflyboseng", link: "https://tiktok.com/@raflyboseng" }
    ]
  },
  skillOrbit: [
    { name: "Graphic Design", percentage: 92, icon: "🎨" },
    { name: "Video Editing", percentage: 93, icon: "🎬" },
    { name: "AI Imagery", percentage: 90, icon: "🤖" },
    { name: "Vibe Coding", percentage: 85, icon: "💻" }
  ]
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeDeep(base, override) {
  if (!override || typeof override !== "object") return deepClone(base);

  if (Array.isArray(base)) {
    return Array.isArray(override) ? override.map((item, index) => (
      typeof item === "object" && item !== null && typeof base[index] === "object"
        ? mergeDeep(base[index], item)
        : item
    )) : deepClone(base);
  }

  const result = { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === "object" && !Array.isArray(value) && base[key] && typeof base[key] === "object") {
      result[key] = mergeDeep(base[key], value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

function loadCVData() {
  try {
    const raw = localStorage.getItem(CV_STORAGE_KEY);
    if (!raw) {
      const defaults = deepClone(CV_DEFAULT_DATA);
      localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(defaults));
      return defaults;
    }

    const parsed = JSON.parse(raw);
    return mergeDeep(CV_DEFAULT_DATA, parsed);
  } catch (error) {
    return deepClone(CV_DEFAULT_DATA);
  }
}

function saveCVData(data) {
  try {
    const safeData = mergeDeep(CV_DEFAULT_DATA, data);
    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(safeData));
    return safeData;
  } catch (error) {
    return deepClone(CV_DEFAULT_DATA);
  }
}

function isSafeLink(url) {
  if (!url || typeof url !== "string") return false;
  if (url.startsWith("#")) return true;

  try {
    const parsed = new URL(url, window.location.href);
    return ["http:", "https:", "mailto:", "tel:"].includes(parsed.protocol);
  } catch (error) {
    return false;
  }
}

function renderCVData(data) {
  document.title = data.documentTitle || CV_DEFAULT_DATA.documentTitle;

  const heroName = document.querySelector(".hero-copy h1");
  const heroRole = document.querySelector(".hero-role");
  const heroText = document.querySelector(".hero-text");
  const brandText = document.querySelector(".brand span:last-child");

  if (heroName) heroName.textContent = data.person?.name || CV_DEFAULT_DATA.person.name;
  if (heroRole) heroRole.textContent = data.person?.role || CV_DEFAULT_DATA.person.role;
  if (heroText) heroText.textContent = data.ringkasan?.text || CV_DEFAULT_DATA.ringkasan.text;
  if (brandText) brandText.textContent = data.person?.name || CV_DEFAULT_DATA.person.name;

  const roleCloud = document.querySelector(".role-cloud");
  const tags = data.person?.tags || CV_DEFAULT_DATA.person.tags;
  if (roleCloud && Array.isArray(tags)) {
    roleCloud.innerHTML = "";
    tags.forEach((tag) => {
      const chip = document.createElement("span");
      chip.textContent = tag;
      roleCloud.appendChild(chip);
    });
  }

  const aboutHeading = document.querySelector("#about .section-heading h2");
  const aboutTextNodes = document.querySelectorAll("#about .about-panel p");
  if (aboutHeading) aboutHeading.textContent = data.ringkasan?.heading || CV_DEFAULT_DATA.ringkasan.heading;
  if (aboutTextNodes[0]) aboutTextNodes[0].textContent = data.ringkasan?.text || CV_DEFAULT_DATA.ringkasan.text;

  const skillHeader = document.querySelector(".skill-stack-header h2");
  if (skillHeader) skillHeader.textContent = data.keterampilan?.heading || CV_DEFAULT_DATA.keterampilan.heading;

  const orbitSkills = data.skillOrbit || CV_DEFAULT_DATA.skillOrbit;
  const skillCards = document.querySelectorAll(".skill-orbital-card");
  skillCards.forEach((card, index) => {
    const skill = orbitSkills[index];
    if (!skill) return;

    card.dataset.skill = skill.name;
    card.dataset.percentage = String(skill.percentage);
    card.dataset.icon = skill.icon;

    const iconNode = card.querySelector(".orbital-icon");
    const nameNode = card.querySelector(".orbital-skill-name");
    const percentNode = card.querySelector(".orbital-percentage");

    if (iconNode) iconNode.textContent = skill.icon;
    if (nameNode) nameNode.textContent = skill.name;
    if (percentNode) percentNode.textContent = `${skill.percentage}%`;
  });

  const centerDisplay = document.querySelector(".skill-display-content");
  if (centerDisplay && orbitSkills[0]) {
    centerDisplay.innerHTML = `
      <div class="display-icon">${orbitSkills[0].icon}</div>
      <h3 class="display-name">${orbitSkills[0].name}</h3>
      <div class="display-percentage">${orbitSkills[0].percentage}%</div>
    `;
  }

  const contactPanel = document.querySelector(".contact-panel");
  const contactHeading = contactPanel?.querySelector("h2");
  const contactIntro = contactPanel?.querySelector("p:not(.section-kicker)");
  const contactLinks = document.querySelector(".contact-links");
  if (contactHeading) contactHeading.textContent = data.kontak?.heading || CV_DEFAULT_DATA.kontak.heading;
  if (contactIntro) contactIntro.textContent = data.kontak?.intro || CV_DEFAULT_DATA.kontak.intro;

  if (contactLinks) {
    contactLinks.innerHTML = "";
    (data.kontak?.items || CV_DEFAULT_DATA.kontak.items).forEach((item) => {
      const link = document.createElement("a");
      link.textContent = item.nilai;
      if (isSafeLink(item.link)) {
        link.href = item.link;
        if (!item.link.startsWith("mailto:") && !item.link.startsWith("tel:") && !item.link.startsWith("#")) {
          link.target = "_blank";
          link.rel = "noreferrer";
        }
      } else {
        link.href = "#";
      }
      contactLinks.appendChild(link);
    });
  }
}

window.CV_DATA = {
  get() {
    return loadCVData();
  },
  set(nextData) {
    const saved = saveCVData(nextData);
    renderCVData(saved);
    return saved;
  },
  reset() {
    const defaults = deepClone(CV_DEFAULT_DATA);
    localStorage.setItem(CV_STORAGE_KEY, JSON.stringify(defaults));
    renderCVData(defaults);
    return defaults;
  }
};

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.round((window.innerWidth * window.innerHeight) / 9500);
  stars = Array.from({ length: Math.max(80, count) }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.25,
    speed: Math.random() * 0.28 + 0.05,
    alpha: Math.random() * 0.65 + 0.25
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const star of stars) {
    const driftX = pointer.x * star.speed * 0.08;
    const driftY = pointer.y * star.speed * 0.08;
    ctx.beginPath();
    ctx.arc(star.x + driftX, star.y + driftY, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(232, 248, 255, ${star.alpha})`;
    ctx.fill();

    if (!reduceMotion) {
      star.y += star.speed;
      if (star.y > window.innerHeight + 4) {
        star.y = -4;
        star.x = Math.random() * window.innerWidth;
      }
    }
  }

  if (!reduceMotion) {
    requestAnimationFrame(drawStars);
  }
}

function setupReveals() {
  const reveals = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  reveals.forEach((item) => observer.observe(item));
}

function setupCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const target = Number(entry.target.dataset.count);
      const duration = reduceMotion ? 1 : 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        entry.target.textContent = Math.round(progress * target);
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.75 });

  counters.forEach((counter) => observer.observe(counter));
}

function setupNavigation() {
  const links = Array.from(document.querySelectorAll(".nav-links a"));
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach((section) => observer.observe(section));
}

window.addEventListener("resize", () => {
  resizeCanvas();
  if (reduceMotion) drawStars();
});

window.addEventListener("pointermove", (event) => {
  pointer = {
    x: (event.clientX / window.innerWidth - 0.5) * 2,
    y: (event.clientY / window.innerHeight - 0.5) * 2
  };
});

// Audio Context untuk Sound Effects
let audioContext;

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Function untuk membuat sound effect
function playSound(type = 'hover') {
  initAudioContext();
  
  if (type === 'hover') {
    // Melodic beep saat hover
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(600, now);
    oscillator.frequency.exponentialRampToValueAtTime(800, now + 0.15);
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    oscillator.start(now);
    oscillator.stop(now + 0.15);
  } else if (type === 'click') {
    // Rocket launch sound
    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.3);
    gainNode.gain.setValueAtTime(0.4, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  }
}

// Setup Skill Orbital Carousel
function setupSkillOrbitalCarousel() {
  const skillCards = document.querySelectorAll('.skill-orbital-card');
  const centerDisplay = document.querySelector('.skill-display-content');
  const numSkills = skillCards.length;
  let currentPosition = 0;

  const storedData = loadCVData();
  const skillsData = storedData.skillOrbit || CV_DEFAULT_DATA.skillOrbit;

  function updateCardPositions() {
    const anglePerCard = (360 / numSkills);

    skillCards.forEach((card, index) => {
      const position = (index - currentPosition + numSkills) % numSkills;
      const angle = position * anglePerCard;
      const radius = 180; // distance from center

      // Calculate coordinates
      const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
      const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

      // Update position and size based on where it is in rotation
      card.style.left = `calc(50% + ${x}px - 55px)`;
      card.style.top = `calc(50% + ${y}px - 55px)`;

      // Remove all state classes
      card.classList.remove('active', 'near', 'far');

      // Add appropriate class based on position
      if (position === 0) {
        card.classList.add('active');
        // Update center display
        const skillIndex = index;
        if (skillsData[skillIndex]) {
          centerDisplay.innerHTML = `
            <div class="display-icon">${skillsData[skillIndex].icon}</div>
            <h3 class="display-name">${skillsData[skillIndex].name}</h3>
            <div class="display-percentage">${skillsData[skillIndex].percentage}%</div>
          `;
        }
      } else if (position === 1 || position === numSkills - 1) {
        card.classList.add('near');
      } else {
        card.classList.add('far');
      }
    });
  }

  // Initial setup
  updateCardPositions();

  // Auto rotate
  let rotationInterval = setInterval(() => {
    currentPosition = (currentPosition + 1) % numSkills;
    updateCardPositions();
  }, 3000); // Rotate every 3 seconds

  // Pause on hover
  document.querySelector('.orbit-system-skill').addEventListener('mouseenter', () => {
    clearInterval(rotationInterval);
  });

  document.querySelector('.orbit-system-skill').addEventListener('mouseleave', () => {
    rotationInterval = setInterval(() => {
      currentPosition = (currentPosition + 1) % numSkills;
      updateCardPositions();
    }, 3000);
  });

  // Click to rotate manually
  skillCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      playSound('click');
      clearInterval(rotationInterval);
      const position = (index - currentPosition + numSkills) % numSkills;
      const rotation = (numSkills - position) % numSkills;
      currentPosition = (currentPosition + rotation) % numSkills;
      updateCardPositions();

      rotationInterval = setInterval(() => {
        currentPosition = (currentPosition + 1) % numSkills;
        updateCardPositions();
      }, 3000);
    });
  });
}

// Setup activity bars animation
function setupActivityBars() {
  const bars = document.querySelectorAll('.bar');
  bars.forEach(bar => {
    const duration = Math.random() * 400 + 400;
    bar.style.animationDuration = duration + 'ms';
  });
}

renderCVData(loadCVData());
resizeCanvas();
drawStars();
setupReveals();
setupCounters();
setupNavigation();
setupSkillOrbitalCarousel();
setupActivityBars();
