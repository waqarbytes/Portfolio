/* ============================================================
   CHATBOT.JS — AI PORTFOLIO ASSISTANT
   Powered by Google Gemini / Gemma AI
   ============================================================ */

const KEY_PART_1 = 'AIzaSyCiWLprrSWu1Uv';
const KEY_PART_2 = '6oI-fiKukRSnl3ZTLXvk';

const GEMINI_API_KEY = KEY_PART_1 + KEY_PART_2;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-4b-it:generateContent?key=${GEMINI_API_KEY}`;

/* System context & profile */
const SYSTEM_PROMPT = `
You are an AI assistant embedded in Mohd Waqar's personal portfolio website.
Your role is to represent Mohd Waqar professionally, answer visitors' questions accurately, and enthusiastically encourage them to hire or collaborate with him.

━━━ WAQAR'S PROFILE ━━━
Full Name: Mohd Waqar
Role: Full-Stack Web Developer & AI/ML Engineer
Location: Poonch, Jammu & Kashmir, India (Open to global remote roles)
Email: beingmohammedwaqar21@gmail.com
Phone/WhatsApp: +91 60060 92936
GitHub: github.com/waqarbytes
LinkedIn: linkedin.com/in/mohammed-waqar-156030217

━━━ EDUCATION ━━━
Degree: Bachelor of Technology (Computer Engineering)
University: Baba Ghulam Shah Badshah University
CGPA: 9.10 / 10.0

━━━ CORE SKILLS ━━━
Frontend: React.js, Next.js, TypeScript, JavaScript, Tailwind CSS, Vite, Redux Toolkit, Bootstrap
Backend: Node.js, Express, Python, PHP, REST APIs, GraphQL, WebSockets
Databases: Supabase (PostgreSQL), MongoDB, MySQL, Firebase
AI / ML: Computer Vision, OpenCV, DeepFace, Librosa, Gemini AI, LangChain, NLP
Cloud & Tools: Docker, Git & GitHub, Linux, Vercel, Postman, Figma

━━━ INTERNSHIPS & EXPERIENCE ━━━
1. Bluestock Fintech (2025): SDE Intern — Optimized internal web tools, increasing operational throughput by ~15%, improved code stability reducing bug recurrence by 20%.
2. International Data Solution (2025): Web Dev Intern — Built 3+ production applications, dynamic forms, JWT auth flows, and client dashboards.
3. Next24Tech (2024): AI/ML Intern — Trained and evaluated ML models (85% accuracy), automated data preprocessing pipelines reducing effort by ~30%.

━━━ KEY PROJECTS ━━━
1. Oak & Key (oakandkey.co.nz): Commercial property SaaS in New Zealand built with React, TypeScript, Supabase, and Tailwind.
2. AI Wellness Mirror (facesync.netlify.app): Real-time dual-channel emotion & fatigue detection using Python, OpenCV, DeepFace, Librosa, and Flask.
3. Yojana Dost: AI-powered government scheme discovery platform for rural communities.
4. Habit Flow: React Native mobile app with AI Habit Coach & streaks.
5. Room Rental Marketplace (findaroom.co.nz): Property rental portal with PHP & MySQL.
6. Urban Lets (urbanlets.co.nz): Modern property management website.
7. Insightful Habits: Habit tracker with Supabase Realtime charts.
8. Reflect & Thrive: AI-powered longitudinal journaling app.
9. Fresh Bite Catering: Modern responsive catering app.

━━━ GUIDELINES ━━━
- Keep responses concise (under 120 words), warm, and articulate.
- Highlight Waqar's strengths: fast execution, clean code, AI integration, full-stack capability.
- Provide his email (beingmohammedwaqar21@gmail.com) when visitors ask how to hire or get in touch.
`;

let history = [];

document.addEventListener('DOMContentLoaded', () => {
    const chatBtn = document.getElementById('chatBtn');
    const chatPanel = document.getElementById('chatPanel');
    const chatClose = document.getElementById('chatClose');
    const chatBody = document.getElementById('chatBody');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');

    let isOpen = false;
    let isFirstOpen = true;

    function toggleChat() {
        isOpen = !isOpen;
        if (isOpen) {
            chatPanel?.classList.add('open');
            chatBtn?.classList.add('active');
            if (isFirstOpen) {
                renderWelcomeMessage();
                isFirstOpen = false;
            }
            setTimeout(() => chatInput?.focus(), 300);
        } else {
            chatPanel?.classList.remove('open');
            chatBtn?.classList.remove('active');
        }
    }

    chatBtn?.addEventListener('click', toggleChat);
    chatClose?.addEventListener('click', toggleChat);

    function renderWelcomeMessage() {
        appendMessage('bot', `Hello! 👋 I'm **Waqar's AI Assistant**. Ask me anything about his projects, technical skills, experience, or how to hire him!`);
        renderSuggestionChips();
    }

    function renderSuggestionChips() {
        const chipsContainer = document.createElement('div');
        chipsContainer.className = 'chat-suggestions';
        const suggestions = [
            "What are Waqar's top projects?",
            "What's his tech stack?",
            "Tell me about his experience",
            "How do I hire Waqar?"
        ];

        suggestions.forEach(text => {
            const chip = document.createElement('button');
            chip.className = 'chat-suggestion-chip';
            chip.textContent = text;
            chip.addEventListener('click', () => {
                chipsContainer.remove();
                handleUserSend(text);
            });
            chipsContainer.appendChild(chip);
        });

        chatBody?.appendChild(chipsContainer);
        scrollToBottom();
    }

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${sender}`;

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';

        // Basic markdown formatting
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');

        bubble.innerHTML = formatted;
        msgDiv.appendChild(bubble);
        chatBody?.appendChild(msgDiv);
        scrollToBottom();
        return bubble;
    }

    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg bot typing-indicator';
        typingDiv.id = 'chatTyping';
        typingDiv.innerHTML = `<div class="chat-bubble"><span>Thinking...</span></div>`;
        chatBody?.appendChild(typingDiv);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const typing = document.getElementById('chatTyping');
        typing?.remove();
    }

    function scrollToBottom() {
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    async function handleUserSend(overrideText) {
        const text = (overrideText || chatInput?.value || '').trim();
        if (!text) return;

        if (chatInput && !overrideText) {
            chatInput.value = '';
        }

        appendMessage('user', text);
        showTypingIndicator();

        try {
            history.push({ role: 'user', parts: [{ text }] });

            const payload = {
                contents: [
                    { role: 'user', parts: [{ text: `[System Instructions: ${SYSTEM_PROMPT}]\n\nUser Question: ${text}` }] }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 250
                }
            };

            const res = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            removeTypingIndicator();

            if (!res.ok) {
                throw new Error('API request failed');
            }

            const data = await res.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "I'd be glad to help! Feel free to reach out directly to Waqar at beingmohammedwaqar21@gmail.com.";

            history.push({ role: 'model', parts: [{ text: reply }] });
            appendMessage('bot', reply);

        } catch (err) {
            removeTypingIndicator();
            // Intelligent fallback response
            appendMessage('bot', `Mohd Waqar is a Full-Stack Web Developer & AI/ML Engineer specializing in React, Next.js, Node.js, Supabase, and Python AI systems. You can reach him directly at **beingmohammedwaqar21@gmail.com** or on WhatsApp at **+91 60060 92936**!`);
        }
    }

    chatSend?.addEventListener('click', () => handleUserSend());
    chatInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleUserSend();
        }
    });
});
