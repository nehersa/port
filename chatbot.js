const chatInput = document.getElementById("userInput");
const chatButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");
const chatStatus = document.getElementById("chatStatus");

const portfolioContext = `
Portfolio owner: Somya Singh.
Education: Computer Science student; exact institution and degree details have not been supplied.
Skills shown on this portfolio: HTML, CSS, JavaScript, Python, Git, GitHub, and basic API integration.
Projects:
1. Factorial Calculator: https://github.com/Somya20-art/Somya-python-Factorial-25bcon0616
2. Python Directory Exercises: https://github.com/Somya20-art/somya-python-Directory-25bcon0616
3. Student Marks Report Generator: https://github.com/Somya20-art/messy-python
4. Python Debugging Practical: https://github.com/Somya20-art/Buggy-python-script-25bcon0616
5. Interactive Quiz Application: https://github.com/Somya20-art/-Quiz_25bcon0616
6. Book Reading List: https://github.com/Somya20-art/reading-list-25bcon0616
GitHub profile: https://github.com/Somya20-art
The website also has a city-based weather widget.
`;

function showChatMessage(role, text) {
  const message = document.createElement("div");
  message.className = `chat-message ${role === "user" ? "chat-user" : "chat-assistant"}`;
  message.textContent = text;
  chatMessages.appendChild(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChatMessage() {
  const question = chatInput.value.trim();
  if (!question || chatButton.disabled) return;

  showChatMessage("user", question);
  chatInput.value = "";
  chatButton.disabled = true;
  chatStatus.textContent = "AI is thinking...";

  try {
    // The API key stays on the server; the browser calls the same-origin endpoint.
    const response = await fetch(CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, context: portfolioContext })
    });

    if (response.status === 429) throw new Error("RATE_LIMIT");
    if (!response.ok) throw new Error("API_ERROR");

    const data = await response.json();
    if (typeof data.answer !== "string" || !data.answer.trim()) {
      throw new Error("INVALID_RESPONSE");
    }
    showChatMessage("assistant", data.answer.trim());
    chatStatus.textContent = "";
  } catch (error) {
    console.error("Chat error:", error);
    if (error.message === "RATE_LIMIT") {
      showChatMessage("assistant", "Too many requests. Please wait and try again.");
    } else if (!navigator.onLine) {
      showChatMessage("assistant", "No internet connection. Please reconnect.");
    } else {
      showChatMessage("assistant", "AI service unavailable. Please try again.");
    }
    chatStatus.textContent = "";
  } finally {
    chatButton.disabled = false;
  }
}

if (typeof CONFIG === "undefined" || !CONFIG.endpoint) {
  chatButton.disabled = true;
  chatStatus.textContent = "Chatbot endpoint is not configured.";
} else {
  chatButton.addEventListener("click", sendChatMessage);
  chatInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") sendChatMessage();
  });
}
