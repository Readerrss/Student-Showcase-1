/* =============================================
   PORTFOLIO - MITADRU KARMAKAR
   script.js — Interactivity, XML parsing, Validation
   ============================================= */

/* ── 1. THEME TOGGLE (Light / Dark Mode) ── */
(function initTheme() {
    const saved = localStorage.getItem('portfolio-theme') || 'light';
    document.body.setAttribute('data-theme', saved);
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.innerHTML = saved === 'dark' ? '☀️' : '🌙';
})();

const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = document.body.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', next);
        themeToggle.innerHTML = next === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('portfolio-theme', next);
    });
}

/* ── 2. XML DATA PARSING — Projects from projects.xml ── */
function loadProjects() {
    const target = document.getElementById('xml-projects-target');
    if (!target) return;

    target.innerHTML = '<p class="project-loading">Loading projects from XML...</p>';

    fetch('projects.xml')
        .then(res => {
            if (!res.ok) throw new Error('Network error: ' + res.status);
            return res.text();
        })
        .then(xmlText => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) throw new Error('XML parse error');

            const projectNodes = xmlDoc.querySelectorAll('project');
            if (!projectNodes.length) {
                target.innerHTML = '<p class="project-loading">No projects found.</p>';
                return;
            }

            const html = Array.from(projectNodes).map(p => {
                const get = tag => p.querySelector(tag)?.textContent?.trim() || '';
                const title = sanitize(get('title'));
                const tech = sanitize(get('tech'));
                const desc = sanitize(get('desc'));
                const status = get('status');
                const category = sanitize(get('category'));
                const role = sanitize(get('role'));
                const collaborators = sanitize(get('collaborators'));

                const statusClass = status === 'Ongoing' ? 'status-ongoing' : 'status-completed';
                const techTags = tech.split(',').map(t =>
                    `<span class="tag">${t.trim()}</span>`
                ).join('');

                return `
                <div class="project-card reveal">
                    <div class="project-card-header">
                        <h3>${title}</h3>
                        <span class="project-status ${statusClass}">${status}</span>
                    </div>
                    <div class="project-meta">
                        ${techTags}
                        <span class="tag" style="opacity:0.7">${category}</span>
                    </div>
                    <p class="project-desc">${desc}</p>
                    <div class="project-footer">
                        <span>👤 ${role}</span>
                        <span style="margin-left:auto">🤝 ${collaborators}</span>
                    </div>
                </div>`;
            }).join('');

            target.innerHTML = `<div class="projects-grid">${html}</div>`;
            observeReveal();
        })
        .catch(err => {
            console.warn('XML fetch failed, using fallback data:', err.message);
            loadProjectsFallback(target);
        });
}

/* Fallback if fetch is blocked in local context */
function loadProjectsFallback(target) {
    const xmlString = `<?xml version="1.0" encoding="UTF-8"?>
<projects>
    <project id="001">
        <title>A Museum Anomaly</title>
        <tech>UE5, C++</tech>
        <category>Game Development</category>
        <role>Solo Developer</role>
        <collaborators>Solo</collaborators>
        <desc>A psychological thriller game built solo in Unreal Engine 5 using custom C++ anomaly detection logic. Features dynamic AI behaviour, environmental storytelling, and real-time rendering pipelines.</desc>
        <status>Completed</status>
    </project>
    <project id="002">
        <title>Netflix EDA Dashboard</title>
        <tech>Python, Streamlit, Pandas</tech>
        <category>Data Science</category>
        <role>Data Analyst</role>
        <collaborators>IBM Internship Team</collaborators>
        <desc>Exploratory Data Analysis application developed during IBM internship. Visualises viewer retention trends, content growth patterns, and genre analytics across Netflix streaming datasets.</desc>
        <status>Completed</status>
    </project>
    <project id="003">
        <title>The Final Climb</title>
        <tech>UE5 Blueprints</tech>
        <category>Game Development</category>
        <role>Physics Optimizer</role>
        <collaborators>Ritam Chatterjee, Syed Meraj Ahmed</collaborators>
        <desc>A physics-based platformer game built collaboratively. Implemented custom Blueprint logic for gravity manipulation, momentum preservation, and level progression for smooth 60fps gameplay.</desc>
        <status>Completed</status>
    </project>
    <project id="004">
        <title>Neural Net Classifier</title>
        <tech>Python, TensorFlow, scikit-learn</tech>
        <category>Machine Learning</category>
        <role>Developer</role>
        <collaborators>Solo</collaborators>
        <desc>A supervised learning project implementing multi-layer perceptron for classification tasks. Achieved 92% accuracy on benchmark datasets using hyperparameter tuning and regularisation.</desc>
        <status>Completed</status>
    </project>
    <project id="005">
        <title>Linux Shell Automation Suite</title>
        <tech>Bash, Linux, Awk, Sed</tech>
        <category>Systems &amp; DevOps</category>
        <role>Developer</role>
        <collaborators>Solo</collaborators>
        <desc>A collection of shell scripts for automating system administration tasks — log rotation, file archival, network diagnostics, and process monitoring for workstation-grade Linux environments.</desc>
        <status>Ongoing</status>
    </project>
</projects>`;

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const projectNodes = xmlDoc.querySelectorAll('project');

    const html = Array.from(projectNodes).map(p => {
        const get = tag => p.querySelector(tag)?.textContent?.trim() || '';
        const title = sanitize(get('title'));
        const tech = sanitize(get('tech'));
        const desc = sanitize(get('desc'));
        const status = get('status');
        const category = sanitize(get('category'));
        const role = sanitize(get('role'));
        const collaborators = sanitize(get('collaborators'));
        const statusClass = status === 'Ongoing' ? 'status-ongoing' : 'status-completed';
        const techTags = tech.split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('');

        return `
        <div class="project-card reveal">
            <div class="project-card-header">
                <h3>${title}</h3>
                <span class="project-status ${statusClass}">${status}</span>
            </div>
            <div class="project-meta">${techTags}<span class="tag" style="opacity:0.7">${category}</span></div>
            <p class="project-desc">${desc}</p>
            <div class="project-footer">
                <span>👤 ${role}</span>
                <span style="margin-left:auto">🤝 ${collaborators}</span>
            </div>
        </div>`;
    }).join('');

    target.innerHTML = `<div class="projects-grid">${html}</div>`;
    observeReveal();
}

/* ── 3. SECURITY — Basic Input Sanitisation (XSS prevention) ── */
function sanitize(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

/* ── 4. CONTACT FORM — Validation + Server-side Simulation ── */
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(fieldId, msgId, message) {
    const field = document.getElementById(fieldId);
    const msg = document.getElementById(msgId);
    if (field) field.classList.add('error');
    if (msg) { msg.textContent = message; msg.style.display = 'block'; }
}

function clearFieldError(fieldId, msgId) {
    const field = document.getElementById(fieldId);
    const msg = document.getElementById(msgId);
    if (field) field.classList.remove('error');
    if (msg) msg.style.display = 'none';
}

function clearAllErrors() {
    ['name','email','subject','message'].forEach(id => clearFieldError(id, id + '-error'));
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        clearAllErrors();

        const name     = document.getElementById('name').value.trim();
        const email    = document.getElementById('email').value.trim();
        const subject  = document.getElementById('subject')?.value || 'General Inquiry';
        const message  = document.getElementById('message').value.trim();
        const feedback = document.getElementById('formFeedback');
        const btn      = document.getElementById('submitBtn');

        /* Honeypot check (basic bot detection) */
        const honeypot = document.getElementById('botcheck');
        if (honeypot && honeypot.value) return; /* Bot filled the hidden field */

        let valid = true;

        if (name.length < 2) {
            showFieldError('name', 'name-error', 'Please enter your full name (at least 2 characters).');
            valid = false;
        }

        if (!validateEmail(email)) {
            showFieldError('email', 'email-error', 'Please enter a valid email address.');
            valid = false;
        }

        if (message.length < 10) {
            showFieldError('message', 'message-error', 'Message must be at least 10 characters long.');
            valid = false;
        }

        if (!valid) return;

        btn.disabled = true;
        btn.innerHTML = '⏳ Sending...';
        feedback.className = '';
        feedback.style.display = 'none';

        /* Server-side Concept Simulation — mimics async POST request */
        setTimeout(() => {
            const safeN = sanitize(name);
            feedback.className = 'success';
            feedback.innerHTML = `✅ Message received, <strong>${safeN}</strong>! I'll get back to you at ${sanitize(email)} within 24 hours.`;
            btn.innerHTML = '✓ Message Sent';
            btn.style.background = '#22c55e';
            contactForm.reset();

            setTimeout(() => {
                btn.innerHTML = '📨 Send Message';
                btn.style.background = '';
                btn.disabled = false;
            }, 4000);
        }, 1800);
    });

    /* Live field validation on blur */
    document.getElementById('name')?.addEventListener('blur', function() {
        if (this.value.trim().length >= 2) clearFieldError('name', 'name-error');
    });
    document.getElementById('email')?.addEventListener('blur', function() {
        if (validateEmail(this.value.trim())) clearFieldError('email', 'email-error');
    });
    document.getElementById('message')?.addEventListener('blur', function() {
        if (this.value.trim().length >= 10) clearFieldError('message', 'message-error');
    });
}

/* ── 5. SMOOTH SCROLL for nav links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const id = this.getAttribute('href');
        const target = document.querySelector(id);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            closeMobileMenu();
        }
    });
});

/* ── 6. MOBILE NAV MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

function closeMobileMenu() {
    mobileMenu?.classList.remove('open');
}

hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.toggle('open');
});

/* ── 7. SCROLL TO TOP BUTTON ── */
const scrollBtn = document.getElementById('scrollTopBtn');
window.addEventListener('scroll', () => {
    if (scrollBtn) {
        scrollBtn.classList.toggle('visible', window.scrollY > 400);
    }
});
scrollBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ── 8. INTERSECTION OBSERVER — Reveal on scroll ── */
function observeReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

/* ── 9. ACTIVE NAV LINK HIGHLIGHT on scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
        link.style.color = '';
        link.style.background = '';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = 'var(--primary)';
            link.style.background = 'var(--primary-glow)';
        }
    });
}, { passive: true });

/* ── 10. INIT ── */
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    observeReveal();
});
