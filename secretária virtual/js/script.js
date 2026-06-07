let sessionId = localStorage.getItem("viralflow_session_id");

if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("viralflow_session_id", sessionId);
}

const WEBHOOK_URL = "https://preciousraven-n8n.cloudfy.live/webhook/fernanda-site";

const chatButton = document.getElementById("chatButton");
const chatBox = document.getElementById("chatBox");
const closeChat = document.getElementById("closeChat");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatMessages = document.getElementById("chatMessages");

if (chatButton && chatBox) {
    chatButton.addEventListener("click", () => {
        chatBox.classList.add("active");
    });
}

if (closeChat && chatBox) {
    closeChat.addEventListener("click", () => {
        chatBox.classList.remove("active");
    });
}

if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const question = chatInput.value.trim();

        if (!question) return;

        addMessage(question, "user-message");
        chatInput.value = "";

        addMessage("Digitando...", "bot-message loading");

        try {
            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    pergunta: question,
                    sessionId: sessionId
                })
            });

            const text = await response.text();

            let data = {};

            try {
                data = JSON.parse(text);
            } catch (e) {
                data = { reply: text };
            }

            removeLoading();

            const answer =
                data.reply ||
                data.resposta ||
                data.answer ||
                data.message ||
                "Não consegui responder agora. Tente novamente.";

            addMessage(answer, "bot-message");

        } catch (error) {
            removeLoading();
            addMessage(
                "Tive um problema para responder agora. Tente novamente em alguns segundos.",
                "bot-message"
            );
            console.error("Erro ao conectar com o webhook:", error);
        }
    });
}

function addMessage(text, className) {
    const message = document.createElement("div");
    message.className = className;
    message.textContent = text;

    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoading() {
    const loading = document.querySelector(".loading");

    if (loading) {
        loading.remove();
    }
}