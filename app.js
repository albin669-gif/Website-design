/* ==========================================================================
   AI JUGAAD CO 2.0 — INTERACTIVE ENGINE & CANVAS LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCanvasBackground();
  initAudioEngine();
  initAIDesignerStudio();
  initBotSimulator();
  initROICalculator();
  initTerminalContact();
  initGlitchTypewriter();
});

/* --------------------------------------------------------------------------
   1. CANVAS PARTICLE NODE ENGINE
   -------------------------------------------------------------------------- */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 16), 85);
  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.color = Math.random() > 0.4 ? '#00f0ff' : (Math.random() > 0.5 ? '#ff5e00' : '#a855f7');
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse attraction / interaction
      if (mouse.x && mouse.y) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.baseAlpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = particles[i].color;
          ctx.globalAlpha = (1 - dist / 130) * 0.22;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* --------------------------------------------------------------------------
   2. WEB AUDIO SYNTHESIZER SFX
   -------------------------------------------------------------------------- */
let audioEnabled = false;
let audioCtx = null;

function initAudioEngine() {
  const toggleBtn = document.getElementById('audio-toggle-btn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    audioEnabled = !audioEnabled;
    toggleBtn.innerHTML = audioEnabled 
      ? `<span>🔊</span> <span>[SFX: ACTIVE]</span>`
      : `<span>🔇</span> <span>[SFX: MUTED]</span>`;
    if (audioEnabled) playTone(880, 'sine', 0.15, 0.08);
  });

  // Attach hover sounds to interactive elements
  document.querySelectorAll('button, a, input, select, .btn-option-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (audioEnabled) playTone(440, 'sine', 0.05, 0.03);
    });
    el.addEventListener('click', () => {
      if (audioEnabled) playTone(660, 'triangle', 0.1, 0.05);
    });
  });
}

function playTone(freq, type = 'sine', duration = 0.1, vol = 0.05) {
  if (!audioEnabled || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.error(e);
  }
}

/* --------------------------------------------------------------------------
   3. AI WEBSITE & BRAND DESIGNER STUDIO (LIVE ENGINE)
   -------------------------------------------------------------------------- */
function initAIDesignerStudio() {
  const brandNameInput = document.getElementById('studio-brand-name');
  const brandTaglineInput = document.getElementById('studio-brand-tagline');
  const urlBox = document.getElementById('preview-url');
  const previewViewport = document.getElementById('preview-viewport');
  const btnDeployWhatsApp = document.getElementById('btn-deploy-whatsapp');

  let state = {
    industry: 'E-Commerce Store',
    vibe: 'cyber',
    brandName: 'NEXUS CYBER',
    tagline: 'Engineered for exponential sales',
    features: ['whatsapp-bot', 'lead-capture']
  };

  // Industry buttons
  document.querySelectorAll('[data-industry]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-industry]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.industry = btn.getAttribute('data-industry');
      updatePreview();
    });
  });

  // Vibe buttons
  document.querySelectorAll('[data-vibe]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-vibe]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.vibe = btn.getAttribute('data-vibe');
      updatePreview();
    });
  });

  // Input listeners
  if (brandNameInput) {
    brandNameInput.addEventListener('input', (e) => {
      state.brandName = e.target.value || 'YOUR BRAND';
      updatePreview();
    });
  }

  if (brandTaglineInput) {
    brandTaglineInput.addEventListener('input', (e) => {
      state.tagline = e.target.value || 'Future-ready digital solutions';
      updatePreview();
    });
  }

  // Feature checkboxes
  document.querySelectorAll('.feature-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      state.features = Array.from(document.querySelectorAll('.feature-checkbox:checked')).map(c => c.value);
      updatePreview();
    });
  });

  function updatePreview() {
    if (!previewViewport) return;

    const slug = state.brandName.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (urlBox) urlBox.textContent = `https://aijugaad.preview/${slug || 'brand'}`;

    // Apply Vibe Theme
    previewViewport.className = `preview-viewport theme-${state.vibe}`;

    // Generate dynamic Mockup HTML
    let featuresHTML = '';
    if (state.features.includes('whatsapp-bot')) {
      featuresHTML += `
        <div class="mock-card">
          <div class="mock-card-title">🤖 24/7 AI WhatsApp Agent</div>
          <div class="mock-card-desc">Auto-replies & captures leads directly on WhatsApp</div>
        </div>
      `;
    }
    if (state.features.includes('ecommerce')) {
      featuresHTML += `
        <div class="mock-card">
          <div class="mock-card-title">🛍️ Hyper-Fast E-Commerce</div>
          <div class="mock-card-desc">Sub-second cart checkout & automated invoice generation</div>
        </div>
      `;
    }
    if (state.features.includes('lead-capture')) {
      featuresHTML += `
        <div class="mock-card">
          <div class="mock-card-title">⚡ Smart Lead Engine</div>
          <div class="mock-card-desc">Instant phone verification & CRM auto-sync</div>
        </div>
      `;
    }
    if (state.features.includes('admin-dashboard')) {
      featuresHTML += `
        <div class="mock-card">
          <div class="mock-card-title">📊 Real-Time Analytics</div>
          <div class="mock-card-desc">Live sales metrics & customer conversion telemetry</div>
        </div>
      `;
    }

    previewViewport.innerHTML = `
      <div class="mock-hero">
        <span class="mock-badge">✦ ${state.industry.toUpperCase()} ARCHITECTURE</span>
        <h3 class="mock-title">${escapeHtml(state.brandName.toUpperCase())}</h3>
        <p class="mock-sub">${escapeHtml(state.tagline)}</p>
        <div class="mock-btn-group">
          <button class="mock-btn">EXPLORE PLATFORM</button>
          <button class="mock-btn" style="background:transparent; color:inherit; border:1px solid currentColor;">BOOK CALL</button>
        </div>
      </div>
      <div class="mock-features-grid">
        ${featuresHTML || '<div class="mock-card"><div class="mock-card-title">✨ High Performance Stack</div><div class="mock-card-desc">Custom optimized build for maximum speed</div></div>'}
      </div>
    `;

    // Update WhatsApp Deploy Link
    if (btnDeployWhatsApp) {
      const msg = `Hi AI Jugaad Co! I used your AI Website Designer Studio and generated a project blueprint:\n\n` +
        `• Brand Name: ${state.brandName}\n` +
        `• Industry: ${state.industry}\n` +
        `• Visual Vibe: ${state.vibe.toUpperCase()}\n` +
        `• Tagline: ${state.tagline}\n` +
        `• Enabled Features: ${state.features.join(', ')}\n\n` +
        `I would like to turn this wireframe into a real website & brand! Please guide me.`;
      
      btnDeployWhatsApp.href = `https://wa.me/919080892182?text=${encodeURIComponent(msg)}`;
    }
  }

  updatePreview();
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* --------------------------------------------------------------------------
   4. AI WHATSAPP BOT SIMULATOR
   -------------------------------------------------------------------------- */
function initBotSimulator() {
  const chatBox = document.getElementById('chat-box');
  const chatInput = document.getElementById('chat-input');
  const btnSend = document.getElementById('btn-chat-send');

  if (!chatBox) return;

  const responses = {
    'cost': "🚀 Our pricing is straightforward! Website projects start around ₹25,000 / $350 based on scope. Logos start at ₹8,000, and AI WhatsApp bots depend on workflow complexity. Want an exact quote?",
    'logo': "🎨 Our Logo & Brand Architecture includes full vector logo suites, color tokens, typography kits, and ready-to-use social media identity assets!",
    'bot': "🤖 Our WhatsApp AI Bot integrates directly with your business number. It greets leads 24/7, answers questions, takes order inquiries, and syncs directly to your WhatsApp or Google Sheets!",
    'strategy': "📞 Awesome! You can book a 1-on-1 strategy call directly on WhatsApp at +91 90808 92182 or we can discuss right here. What is your business goal?",
    'default': "⚡ I'm the AI Jugaad Bot! We craft logos, build lightning-fast web apps, and wire up AI automation so your brand looks big and moves fast. What project do you have in mind?"
  };

  window.sendQuickReply = function(type) {
    let userText = '';
    if (type === 'cost') userText = 'How much does a website cost?';
    if (type === 'logo') userText = 'What is included in logo design?';
    if (type === 'bot') userText = 'How does AI WhatsApp bot work?';
    if (type === 'strategy') userText = 'Book a 1-on-1 strategy call!';

    addUserMessage(userText);
    setTimeout(() => {
      addBotMessage(responses[type] || responses['default']);
    }, 600);
  };

  if (btnSend && chatInput) {
    btnSend.addEventListener('click', () => {
      const text = chatInput.value.trim();
      if (!text) return;
      addUserMessage(text);
      chatInput.value = '';

      let replyKey = 'default';
      const lower = text.toLowerCase();
      if (lower.includes('cost') || lower.includes('price') || lower.includes('rate')) replyKey = 'cost';
      else if (lower.includes('logo') || lower.includes('brand')) replyKey = 'logo';
      else if (lower.includes('bot') || lower.includes('whatsapp') || lower.includes('automation')) replyKey = 'bot';
      else if (lower.includes('call') || lower.includes('contact') || lower.includes('book')) replyKey = 'strategy';

      setTimeout(() => {
        addBotMessage(responses[replyKey]);
      }, 700);
    });

    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') btnSend.click();
    });
  }

  function addUserMessage(msg) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = 'chat-msg msg-user';
    div.innerHTML = `${escapeHtml(msg)}<div class="msg-time">${time}</div>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function addBotMessage(msg) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const div = document.createElement('div');
    div.className = 'chat-msg msg-bot';
    div.innerHTML = `${msg}<div class="msg-time">${time}</div>`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }
}

/* --------------------------------------------------------------------------
   5. REAL-TIME ROI CALCULATOR
   -------------------------------------------------------------------------- */
function initROICalculator() {
  const sliderQueries = document.getElementById('calc-queries');
  const sliderRate = document.getElementById('calc-rate');

  const valQueries = document.getElementById('calc-queries-val');
  const valRate = document.getElementById('calc-rate-val');

  const statHours = document.getElementById('calc-hours-saved');
  const statSavings = document.getElementById('calc-cost-savings');
  const statROI = document.getElementById('calc-roi-mult');

  if (!sliderQueries || !sliderRate) return;

  function recalculate() {
    const queries = parseInt(sliderQueries.value, 10);
    const rate = parseInt(sliderRate.value, 10);

    if (valQueries) valQueries.textContent = `${queries} hrs/mo`;
    if (valRate) valRate.textContent = `₹${rate}/hr`;

    // Math estimations
    const hoursSaved = Math.round(queries * 0.85); // 85% tasks automated
    const monthlySavings = hoursSaved * rate;
    const roiMultiplier = ((monthlySavings * 12) / 35000).toFixed(1);

    if (statHours) statHours.textContent = `${hoursSaved} HRS`;
    if (statSavings) statSavings.textContent = `₹${monthlySavings.toLocaleString('en-IN')}`;
    if (statROI) statROI.textContent = `${roiMultiplier}x ROI`;
  }

  sliderQueries.addEventListener('input', recalculate);
  sliderRate.addEventListener('input', recalculate);
  recalculate();
}

/* --------------------------------------------------------------------------
   6. COMMAND TERMINAL CONTACT
   -------------------------------------------------------------------------- */
function initTerminalContact() {
  const form = document.getElementById('terminal-form');
  const statusOutput = document.getElementById('terminal-output');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('term-name').value;
    const service = document.getElementById('term-service').value;
    const message = document.getElementById('term-msg').value;

    if (statusOutput) {
      statusOutput.innerHTML = `<span style="color:var(--cyan-neon);">[SYS_TRANSMITTING] Packaging prompt packet...</span>`;
      setTimeout(() => {
        statusOutput.innerHTML = `<span style="color:var(--green-neon);">✔ TRANSMISSION SUCCESSFUL! Opening WhatsApp dispatch channel...</span>`;
        
        const waMsg = `Hi AI Jugaad Co! Project Inquiry from Website Terminal:\n\nName: ${name}\nService Needed: ${service}\nMessage: ${message}`;
        window.open(`https://wa.me/919080892182?text=${encodeURIComponent(waMsg)}`, '_blank');
      }, 1000);
    }
  });
}

/* --------------------------------------------------------------------------
   7. GLITCH & TYPEWRITER HERO EFFECT
   -------------------------------------------------------------------------- */
function initGlitchTypewriter() {
  const el = document.getElementById('hero-glitch-text');
  if (!el) return;

  const words = ['WEBSITES', 'LOGOS', 'AI AGENTS', 'FUTURE BRANDS'];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }
  type();
}
