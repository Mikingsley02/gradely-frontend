
  document.addEventListener("DOMContentLoaded", () => {
    // ===== Inject Chatbot Styles =====
    const style = document.createElement("style");
    style.innerHTML = `
      /* Floating Button */
      #chatbotToggle {
        position: fixed;
        bottom: 25px;
        right: 25px;
        width: 65px;
        height: 65px;
        border-radius: 50%;
        background: linear-gradient(135deg, #6a11cb, #2575fc);
        color: #fff;
        border: none;
        font-size: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        cursor: pointer;
        z-index: 999;
        transition: transform 0.3s ease, box-shadow 0.3s;
        animation: pulse 2s infinite;
      }
      #chatbotToggle:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 25px rgba(0,0,0,0.35);
      }

      /* Chat Window */
      #chatbotPanel {
        position: fixed;
        bottom: 100px;
        right: 25px;
        width: 340px;
        height: 470px;
        background: rgba(255,255,255,0.97);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.25);
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 998;
        border: 1px solid rgba(200,200,255,0.3);
      }

      /* Header */
      .chat-header {
        background: linear-gradient(135deg, #0c2461, #2575fc);
        color: #fff;
        padding: 14px;
        text-align: center;
        font-weight: 600;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .chat-header img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }

      /* Messages area */
      #chatbotMessages {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
        font-size: 0.92rem;
        background: #f5f7fa;
        scroll-behavior: smooth;
      }
      .msg {
        margin: 8px 0;
        display: flex;
      }
      .msg.user {
        justify-content: flex-end;
      }
      .msg.kaima {
        justify-content: flex-start;
      }
      .bubble {
        padding: 10px 14px;
        border-radius: 16px;
        max-width: 80%;
        word-wrap: break-word;
      }
      .bubble.kaima {
        background: #e1ebff;
        color: #2c3e50;
      }
      .bubble.user {
        background: linear-gradient(135deg, #6a11cb, #2575fc);
        color: white;
      }

      /* Input area */
      .chat-input {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px;
        background: #f0f4ff;
        border-top: 1px solid #d9e0ff;
      }

      #chatbotInput {
        flex: 1;
        padding: 10px;
        background: #fff;
        border: 1px solid #ccd9ff;
        border-radius: 8px;
        font-size: 0.9rem;
        transition: 0.2s;
        color: #333; /* ✅ Added: Visible text color */
      }
      #chatbotInput:focus {
        outline: none;
        border-color: #2575fc;
        box-shadow: 0 0 6px rgba(37,117,252,0.3);
      }

      /* ===== MATCHING SEND BUTTON FROM HELP-SUPPORT PAGE ===== */
      #chatbotSend {
        background: linear-gradient(135deg, #0c2461, #2575fc);
        color: white;
        border: none;
        border-radius: 8px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        width: auto;
        min-width: 80px;
        text-align: center;
        font-weight: 600;
      }

      #chatbotSend:hover {
        background: #0a84ff;
        transform: scale(1.05);
      }

      /* Quick Replies */
      .quick-replies {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        padding: 6px 10px;
        background: #f0f4ff;
        border-top: 1px solid #ddd;
      }
      .quick-reply {
        background: #463d89;
        border-radius: 12px;
        padding: 6px 10px;
        font-size: 0.85rem;
        color: white;
        cursor: pointer;
        transition: 0.2s;
      }
      .quick-reply:hover {
        background: #155a6d;
      }

      @keyframes pulse {
        0%, 100% {box-shadow: 0 0 0 0 rgba(12,36,97,0.5);}
        50% {box-shadow: 0 0 0 15px rgba(12,36,97,0);}
      }

      @media (max-width: 600px) {
        #chatbotPanel {
          width: 90%;
          height: 65vh;
          right: 5%;
          bottom: 90px;
        }
        #chatbotSend {
          width: 100%;
          padding: 10px 16px;
          font-size: 1rem;
        }
      }
    `;
    document.head.appendChild(style);

    // ===== Inject Chatbot HTML =====
    const chatbotHTML = `
      <button id="chatbotToggle" title="Chat with Kaima">💬</button>
      <div id="chatbotPanel">
        <div class="chat-header">
          <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" alt="Kaima"/>
          <span>Kaima — Gradely Assistant</span>
        </div>
        <div id="chatbotMessages">
          <div class="msg kaima">
            <div class="bubble kaima">👋 Hi! I'm <b>Kaima</b>. How can I assist you today?</div>
          </div>
        </div>
        <div class="quick-replies" id="quickReplies">
          <div class="quick-reply" onclick="askQuick('How do I reset my password?')">🔑 Reset password</div>
          <div class="quick-reply" onclick="askQuick('Where is the result upload section?')">📤 Result upload</div>
          <div class="quick-reply" onclick="askQuick('What are the subscription plans?')">💳 Plans</div>
          <div class="quick-reply" onclick="askQuick('Can I add new schools?')">🏫 Add schools</div>
          <div class="quick-reply" onclick="askQuick('Contact support')">📞 Contact support</div>
          <div class="quick-reply" onclick="askQuick('How do I download result?')">📥 Download Result</div>
          <!-- ✅ NEW: Register Student -->
          <div class="quick-reply" onclick="askQuick('How do I register student?')">📝 Register Student</div>
        </div>
        <div class="chat-input">
          <input id="chatbotInput" type="text" placeholder="Type your question..." />
          <button id="chatbotSend">Send</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", chatbotHTML);

    // ===== Core Chat Logic =====
    const toggle = document.getElementById('chatbotToggle');
    const panel = document.getElementById('chatbotPanel');
    const messages = document.getElementById('chatbotMessages');
    const input = document.getElementById('chatbotInput');
    const sendBtn = document.getElementById('chatbotSend');

    toggle.addEventListener('click', () => {
      panel.style.display = panel.style.display === 'flex' ? 'none' : 'flex';
      panel.style.flexDirection = 'column';
    });

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', e => {
      if (e.key === 'Enter') sendMessage();
    });

    window.askQuick = function (text) {
      appendMessage('user', text);
      setTimeout(() => respond(text), 700);
    };

    function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      appendMessage('user', text);
      input.value = '';
      setTimeout(() => respond(text), 700);
    }

    function appendMessage(sender, text) {
      const div = document.createElement('div');
      div.classList.add('msg', sender);
      const bubble = document.createElement('div');
      bubble.classList.add('bubble', sender);
      bubble.textContent = text;
      div.appendChild(bubble);
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function respond(text) {
      let reply = "I'm not sure, but you can reach support for help.";
      const lower = text.toLowerCase();

      if (lower.includes('password')) reply = "To reset your password, go to Settings → Change Password.";
      else if (lower.includes('result')) reply = "Login as admin, Click on 'Upload results'";
      else if (lower.includes('school')) reply = "Yes! You can register as a new school via the Home page.";
      else if (lower.includes('plan') || lower.includes('subscription')) reply = "Our subscription plans are shown on the 'Billing' page — basic & pro options available.";
      else if (lower.includes('support') || lower.includes('contact')) reply = "📧 You can reach support at support@gradely.info";
      else if (lower.includes('hello') || lower.includes('hi')) reply = "Hi there! 😊 How can I assist you today?";
      else if (lower.includes('download') && lower.includes('result')) reply = "After logging in, go to your dashboard → Click 'Download PDF' to get your child's result as a printable PDF.";
      else if (lower.includes('register') && lower.includes('student')) reply = "To register a student, go to the Admin Dashboard → Use 'Add New Student' or 'Bulk Upload' feature.";

      setTimeout(() => appendMessage('kaima', reply), 700);
    }
  });
