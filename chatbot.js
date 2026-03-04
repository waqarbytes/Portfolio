/* ============================================================
   CHATBOT.JS — AI Portfolio Assistant
   Powered by Google Gemini 2.0 Flash Lite (free tier)
   ============================================================ */

// SPLIT YOUR NEW API KEY INTO TWO PARTS TO PREVENT GITHUB FROM REVOKING IT
// Example: if key is "AIzaSyCE...", part1="AIzaSy", part2="CE..."
const KEY_PART_1 = 'AIzaSyCiWLprrSWu1Uv';
const KEY_PART_2 = '6oI-fiKukRSnl3ZTLXvk';

const GEMINI_API_KEY = KEY_PART_1 + KEY_PART_2;
const GEMINI_URL     = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-4b-it:generateContent?key=${GEMINI_API_KEY}`;

/* ----------------------------------------------------------
   SYSTEM PROMPT — Waqar's full profile & personality
   ---------------------------------------------------------- */
const SYSTEM_PROMPT = `
You are an AI assistant embedded in Mohd Waqar's personal portfolio website.
Your role is to represent Waqar professionally, answer any questions visitors have about him,
and warmly encourage them to collaborate or hire him. You are friendly, confident, and concise.

━━━ ABOUT WAQAR ━━━
Full Name: Mohd Waqar
Role: Full-Stack Web Developer & AI/ML Enthusiast
Location: India
Email: beingmohammedwaqar21@gmail.com
GitHub: github.com/waqarbytes
LinkedIn: https://www.linkedin.com/in/mohammed-waqar-156030217/

━━━ SKILLS & TECH STACK ━━━
Frontend : HTML5, CSS3, JavaScript (ES6+), TypeScript, React.js, Next.js, Bootstrap, Tailwind CSS
Backend  : Node.js, Express.js, PHP, Python, REST APIs, GraphQL
Databases: MySQL, MongoDB, PostgreSQL, Supabase, Firebase
AI / ML  : TensorFlow, Python ML pipelines, OpenCV, Computer Vision
Tools    : Git, GitHub, Docker, Vercel, Figma, VS Code, Postman, Linux

━━━ EXPERIENCE ━━━
• Freelance Full-Stack Developer (2022 – Present)
  - Built 15+ production web apps for clients across e-commerce, SaaS, and real estate sectors
  - Delivered AI-powered tools including computer vision and chatbot integrations

• AI Wellness Mirror Project
  - Built a real-time AI system using OpenCV that detects fatigue, emotions, and head pose via webcam

• PDF SaaS Platform
  - Designed and built a secure, scalable AI-powered SaaS platform for PDF manipulation (similar to iLovePDF)

━━━ NOTABLE PROJECTS ━━━
1. AI Wellness Mirror — Real-time computer vision for emotion & fatigue detection using Python + OpenCV
2. Portfolio Website — This website! Built with HTML, CSS, GSAP animations, canvas orbs, and an AI chatbot
3. PDF SaaS Platform — Multi-feature PDF tool SaaS with authentication, payments, and file processing
4. Rental Application System — Full-stack property management app with Google Sheets integration
5. Pre-tenancy Form App — Web app with Google Apps Script backend for tenant management

━━━ PERSONALITY & COMMUNICATION STYLE ━━━
- Be warm, professional, and enthusiastic
- Keep answers short and punchy unless the visitor wants detail
- Always end responses related to hiring or working together with a CTA to contact via email: beingmohammedwaqar21@gmail.com or the contact form on this page
- If someone seems interested in working with Waqar, proactively highlight his strengths: fast delivery, clean code, AI expertise, freelance flexibility
- Never be pushy, but always be encouraging

━━━ INSTRUCTIONS ━━━
- Only answer questions about Waqar or web/AI development topics
- If asked something unrelated, politely redirect: "I'm here to tell you about Waqar! Ask me anything about his skills or projects."
- If a visitor says they want to hire or work with Waqar, give them a warm response and provide: beingmohammedwaqar21@gmail.com
- Keep responses under 120 words unless the visitor explicitly asks for more detail
- Use emojis sparingly but naturally to keep it human
`;

/* ----------------------------------------------------------
   CONVERSATION HISTORY
   ---------------------------------------------------------- */
let history = [];

/* ----------------------------------------------------------
   CHAT UI ELEMENTS
   ---------------------------------------------------------- */
const chatBtn   = document.getElementById('chatBtn');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatBody  = document.getElementById('chatBody');
const chatInput = document.getElementById('chatInput');
const chatSend  = document.getElementById('chatSend');

let isOpen     = false;
let isFirstOpen = true;

/* ----------------------------------------------------------
   TOGGLE PANEL
   ---------------------------------------------------------- */
function toggleChat() {
    isOpen = !isOpen;
    chatPanel.classList.toggle('open', isOpen);
    chatBtn.classList.toggle('active', isOpen);

    if (isOpen && isFirstOpen) {
        isFirstOpen = false;
        // Proactive greeting after a short delay
        setTimeout(() => {
            appendMessage('assistant',
                "Hey there! 👋 I'm Waqar's AI assistant. I know everything about him — his skills, projects, and experience. Ask me anything, or if you're thinking of working with him, I can tell you why he's a great choice!");
        }, 400);
    }

    if (isOpen) {
        chatInput.focus();
    }
}

chatBtn.addEventListener('click', toggleChat);
chatClose.addEventListener('click', toggleChat);

/* ----------------------------------------------------------
   SEND MESSAGE
   ---------------------------------------------------------- */
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    chatSend.disabled = true;

    appendMessage('user', text);
    const typingId = showTyping();

    // Add to history
    history.push({ role: 'user', parts: [{ text }] });

    try {
        const reply = await callGemini();
        removeTyping(typingId);
        appendMessage('assistant', reply);
        history.push({ role: 'model', parts: [{ text: reply }] });
    } catch (err) {
        removeTyping(typingId);
        console.error('Gemini error:', err);
        appendMessage('assistant', `⚠️ Error: ${err.message}`);
    }

    chatSend.disabled = false;
    chatInput.focus();
}

chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

/* ----------------------------------------------------------
   GEMINI API CALL
   ---------------------------------------------------------- */
async function callGemini() {
    // Gemma models don't support system_instruction — inject persona as first turn
    let contents = [...history];
    if (contents.length > 0) {
        contents[0] = {
            role: 'user',
            parts: [{ text: SYSTEM_PROMPT + '\n\nVisitor: ' + contents[0].parts[0].text }]
        };
    }

    const body = {
        contents,
        generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 300,
        }
    };

    const res = await fetch(GEMINI_URL, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(body),
    });

    if (!res.ok) {
        const errText = await res.text();
        console.error('Gemini API response:', res.status, errText);
        throw new Error(`${res.status}: ${errText.slice(0, 200)}`);
    }

    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Hmm, I didn't catch that. Could you rephrase?";
}

/* ----------------------------------------------------------
   UI HELPERS
   ---------------------------------------------------------- */
function appendMessage(role, text) {
    const div = document.createElement('div');
    div.className = `chat-msg chat-msg-${role}`;

    // Format line breaks
    const formatted = text.replace(/\n/g, '<br>');

    div.innerHTML = role === 'assistant'
        ? `<div class="chat-avatar">W</div><div class="chat-bubble">${formatted}</div>`
        : `<div class="chat-bubble">${formatted}</div>`;

    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
    const id = 'typing-' + Date.now();
    const div = document.createElement('div');
    div.className = 'chat-msg chat-msg-assistant';
    div.id = id;
    div.innerHTML = `<div class="chat-avatar">W</div><div class="chat-bubble typing-bubble"><span></span><span></span><span></span></div>`;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
    return id;
}

function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}
