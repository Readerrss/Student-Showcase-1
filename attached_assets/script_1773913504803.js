// 1. DARK MODE TOGGLE
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    themeToggle.innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
});

// 2. XML DATA PARSING (Requirement Check)
// In a real server, we'd fetch('projects.xml'). For local printout, we demonstrate the logic:
const xmlDataString = `
<projects>
    <project>
        <title>A Museum Anomaly</title>
        <tech>UE5, C++</tech>
        <desc>Psychological thriller with custom anomaly logic. Collab: Ritam Chatterjee.</desc>
    </project>
    <project>
        <title>Netflix EDA App</title>
        <tech>Python, Streamlit</tech>
        <desc>IBM Project: Visualizing viewer retention and content growth.</desc>
    </project>
    <project>
        <title>The Final Climb</title>
        <tech>UE5 Blueprints</tech>
        <desc>Physics platformer optimization. Collab: Syed Meraj Ahmed.</desc>
    </project>
</projects>`;

const parser = new DOMParser();
const xmlDoc = parser.parseFromString(xmlDataString, "text/xml");
const projects = xmlDoc.getElementsByTagName("project");
let projectHTML = "";

for (let i = 0; i < projects.length; i++) {
    projectHTML += `
        <div class="project-card">
            <h3>${projects[i].getElementsByTagName("title")[0].childNodes[0].nodeValue}</h3>
            <p><span class="tag">${projects[i].getElementsByTagName("tech")[0].childNodes[0].nodeValue}</span></p>
            <p>${projects[i].getElementsByTagName("desc")[0].childNodes[0].nodeValue}</p>
        </div>`;
}
document.getElementById('xml-projects-target').innerHTML = projectHTML;

// 3. SECURE FORM VALIDATION (Requirement Check)
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Security Practice: Basic Input Sanitization
    const name = document.getElementById('name').value.replace(/<[^>]*>?/gm, '');
    const feedback = document.getElementById('formFeedback');
    const btn = document.getElementById('submitBtn');

    btn.innerHTML = "Securely Processing...";
    
    // Server-side Simulation (Basic Concept)
    setTimeout(() => {
        feedback.innerHTML = `<i class="fas fa-check-circle"></i> Handshake Complete. Welcome, ${name}.`;
        feedback.style.color = "#2ecc71";
        btn.innerHTML = "Message Dispatched";
        btn.style.background = "#2ecc71";
        this.reset();
    }, 1500);
});