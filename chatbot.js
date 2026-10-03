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
Role: Software Engineer — Full-Stack & AI Applications
Location: Poonch, J&K, India | Open to Global Remote roles (GMT+5:30, flexible EU/US overlap)
Email: beingmohammedwaqar21@gmail.com
Phone/WhatsApp: +91 60060 92936
GitHub: github.com/waqarbytes
LinkedIn: linkedin.com/in/mohammed-waqar

━━━ EDUCATION ━━━
Degree: Bachelor of Technology (Computer Engineering), Aug 2022 – May 2026
University: Baba Ghulam Shah Badshah University, Poonch, J&K, India
Core Focus: Data Structures & Algorithms, OOP, DBMS, OS, Computer Networks

━━━ CERTIFICATIONS ━━━
1. Azure AI & Cloud Fundamentals — IBM (Expected Mar 2026)
2. AWS Cloud Practitioner Essentials — Amazon Web Services (AWS, Jul 2025)
3. Meta Front-End Developer Certificate — Coursera / Meta (Mar 2025)

━━━ CORE TECHNICAL SKILLS ━━━
- AI / LLM Engineering: RAG (pgvector, hybrid BM25 + dense search, reciprocal rank fusion, cross-encoder reranking), LLM evaluation (labeled eval sets, LLM-as-judge), multi-model routing (OpenAI GPT-4o, Anthropic Claude, xAI Grok), prompt engineering, Model Context Protocol (MCP), semantic caching, guardrails
- Languages: TypeScript, JavaScript (ES6+), Python, SQL
- Frontend: React.js, Next.js, Redux, Tailwind CSS, Responsive Design, Accessibility (WCAG), Vite
- Backend & Databases: Node.js, Express, REST APIs, WebSockets, PostgreSQL, Supabase, Redis, JWT, OAuth 2.0
- Cloud / DevOps: AWS (EC2, S3, Lambda), Docker, GitHub Actions (CI/CD), Vercel, k6 load testing, sliding-window rate limiting
- Testing & Tools: Jest, Vitest, Postman, Git, Agile/Scrum

━━━ WORK EXPERIENCE & INTERNSHIPS ━━━
1. Bluestock Fintech (Fintech Education Startup) | SDE Intern (Jul 2025 – Aug 2025, Remote):
   - Rebuilt 3 React dashboard modules (replacing legacy jQuery) for 20+ daily ops users, cutting average task-completion time by 15%.
   - Raised API test coverage from 30% to 75% with Jest across 12 critical endpoints, integrated into CI/CD; production bug recurrence fell 20% over 6 weeks.

2. International Data Solution | Web Development Intern (Feb 2025 – Jun 2025, Remote):
   - Delivered 3 production React + Tailwind CSS web apps for external e-commerce and healthcare clients, on-time across all sprints.
   - Built a 20+ component reusable UI library with PR review standards, cutting new-developer onboarding from 5 days to 2.

3. Next24Tech | AI/ML Development Intern (Jun 2024 – Aug 2024, Remote):
   - Benchmarked 4 classifiers (Random Forest, XGBoost, SVM, LSTM) on financial fraud data, reaching 85% accuracy (12 pts above baseline).
   - Automated Pandas + scikit-learn preprocessing for 5 datasets (50K–200K rows), cutting manual effort by ~30%.

━━━ KEY PROJECTS ━━━
1. Oak & Key (Live: oakandkey.co.nz):
   - Sole developer: designed, built, and shipped end-to-end for a New Zealand property firm (React, TypeScript, Supabase, PostgreSQL) — lease tracking, rent collection, bond lodgements, maintenance workflows, Recharts financial dashboards, and Excel (xlsx)/PDF (pdf-lib) bulk data-ingestion pipelines.

2. Yojana Dost — RAG-Powered Knowledge Assistant (Live: yojana-dost.vercel.app | Repo: github.com/waqarbytes/Yojana-dost):
   - Production RAG pipeline (pgvector embeddings, hybrid dense + BM25 retrieval with reciprocal rank fusion, cross-encoder reranking) over 150+ scheme documents.
   - On 100-query labeled eval harness: pass rate rose from 38% to 74%, hallucinations fell from 38% to 8%, faithfulness 4.6/5, 86% citation precision and 82% recall@4.
   - Cut p95 latency from 294ms to 16ms (18x) and LLM cost by 53% via semantic caching (0.92 cosine threshold).
   - Multi-model routing with fallback across OpenAI GPT-4o, Anthropic Claude, and xAI Grok; live /api/metrics telemetry; 50-VU k6 load with 0% errors behind sliding-window rate limiting; 1,000+ daily queries.

3. MCP Server — India Schemes Toolkit (Repo: github.com/waqarbytes/india-schemes-mcp):
   - Built and published an authenticated Model Context Protocol (MCP) server (TypeScript, Zod) exposing 6 tools for scheme search, eligibility checking, deadlines, comparisons with schema validation and rate limiting for Claude Desktop.

4. AI Wellness Mirror (Live: facesync.netlify.app):
   - Real-time dual-channel emotion & fatigue detection using Python, OpenCV, DeepFace, Librosa, and Flask.

5. Habit Flow (Repo: github.com/waqarbytes/habit-flow):
   - React Native mobile app with AI Habit Coach & streaks.

━━━ GUIDELINES ━━━
- Keep responses concise (under 120 words), direct, and enthusiastic.
- Highlight Waqar's strengths: production RAG engineering, clean TypeScript/React architecture, full-stack reliability, and measurable benchmark results.
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
