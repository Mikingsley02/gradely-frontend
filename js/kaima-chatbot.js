document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");

  style.innerHTML = `
    #chatbotToggle{
      position:fixed;
      right:18px;
      bottom:18px;
      width:58px;
      height:58px;
      border-radius:50%;
      border:1px solid rgba(255,255,255,.35);
      background:linear-gradient(135deg,#00d2ff,#2563eb);
      color:#fff;
      font-size:25px;
      display:flex;
      align-items:center;
      justify-content:center;
      cursor:pointer;
      z-index:9999;
      animation:pulse 2s infinite;
      box-shadow:0 14px 35px rgba(0,210,255,.3);
    }

    #chatbotPanel{
      position:fixed;
      right:22px;
      bottom:90px;
      width:360px;
      height:500px;
      max-height:calc(100vh - 120px);
      background:#fff;
      border-radius:22px;
      display:none;
      flex-direction:column;
      overflow:hidden;
      z-index:9998;
      box-shadow:0 25px 80px rgba(0,0,0,.3);
      border:1px solid rgba(255,255,255,.45);
    }

    .chat-header{
      background:linear-gradient(135deg,#020617,#2563eb);
      color:#fff;
      padding:13px 14px;
      font-weight:800;
      font-size:.95rem;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:8px;
      flex-shrink:0;
    }

    .chat-header img{
      width:28px;
      height:28px;
      border-radius:50%;
    }

    #chatbotMessages{
      flex:1;
      min-height:0;
      padding:12px;
      overflow-y:auto;
      background:#f8fafc;
      font-size:.9rem;
    }

    .msg{
      margin:8px 0;
      display:flex;
    }

    .msg.user{justify-content:flex-end}
    .msg.kaima{justify-content:flex-start}

    .bubble{
      max-width:82%;
      padding:10px 13px;
      border-radius:16px;
      line-height:1.45;
      word-break:break-word;
    }

    .bubble.kaima{
      background:#e0f2fe;
      color:#0f172a;
    }

    .bubble.user{
      background:linear-gradient(135deg,#00d2ff,#2563eb);
      color:#fff;
    }

    .quick-replies{
  display:grid;
  grid-template-columns:repeat(2, minmax(0, 1fr));
  gap:2px;
  padding:10px;
  background:#eef6ff;
  border-top:0.5px solid #dbeafe;
  flex-shrink:0;
  max-height:145px;
  overflow-y:auto;
}




    .quick-replies::-webkit-scrollbar{
      display:none;
    }

    .quick-reply{
      flex:0 0 auto;
      background:#0f172a;
      color:white;
      border-radius:999px;
      padding:7px 11px;
      font-size:.78rem;
      cursor:pointer;
      transition:.2s ease;
    }

    .quick-reply:hover{
      background:#2563eb;
    }

    .chat-input{
      display:flex;
      gap:8px;
      padding:10px;
      background:#f8fafc;
      border-top:1px solid #dbeafe;
      flex-shrink:0;
    }

    #chatbotInput{
      flex:1;
      min-width:0;
      height:44px;
      padding:0 12px;
      border:1px solid #bfdbfe;
      border-radius:12px;
      font-size:16px;
      color:#0f172a;
    }

    #chatbotInput:focus{
      outline:none;
      border-color:#00d2ff;
      box-shadow:0 0 0 3px rgba(0,210,255,.16);
    }

    #chatbotSend{
      width:auto;
      min-width:72px;
      height:44px;
      border:none;
      border-radius:12px;
      background:linear-gradient(135deg,#00d2ff,#2563eb);
      color:#fff;
      font-size:.9rem;
      font-weight:900;
      cursor:pointer;
    }

    @keyframes pulse{
      0%,100%{
        box-shadow:
          0 14px 35px rgba(0,210,255,.3),
          0 0 0 0 rgba(0,210,255,.42);
      }

      50%{
        box-shadow:
          0 14px 35px rgba(0,210,255,.3),
          0 0 0 15px rgba(0,210,255,0);
      }
    }

    @media(max-width:600px){
      #chatbotToggle{
        width:54px;
        height:54px;
        right:16px;
        bottom:18px;
        font-size:24px;
      }

      #chatbotPanel{
        left:12px;
        right:12px;
        bottom:82px;
        width:auto;
        height:58vh;
        max-height:520px;
        border-radius:20px;
      }

      .chat-header{
        padding:11px;
        font-size:.86rem;
      }

      .chat-header img{
        width:25px;
        height:25px;
      }

      #chatbotMessages{
        padding:10px;
        font-size:.86rem;
      }

      .bubble{
        max-width:86%;
        padding:9px 12px;
      }

      .quick-replies{
  display:grid;
  grid-template-columns:repeat(2, minmax(0, 1fr));
  gap:6px;
  padding:9px 10px;
  background:#eef6ff;
  border-top:1px solid #dbeafe;
  flex-shrink:0;
  overflow:visible;
}

.quick-replies::-webkit-scrollbar{
  display:none;
}

.quick-reply{
  width:100%;
  background:#0f172a;
  color:white;
  border-radius:999px;
  padding:7px 8px;
  font-size:.72rem;
  cursor:pointer;
  transition:.2s ease;
  text-align:center;
  white-space:nowrap;
  line-height:1.2;
  min-height:32px;
  display:flex;
  align-items:center;
  justify-content:center;
}

.quick-reply:hover{
  background:#2563eb;
}

.chat-input{
  display:flex;
  gap:8px;
  padding:10px;
  background:#f8fafc;
  border-top:1px solid #dbeafe;
  flex-shrink:0;
}

#chatbotInput{
  flex:1;
  min-width:0;
  height:44px;
  padding:0 12px;
  border:1px solid #bfdbfe;
  border-radius:12px;
  font-size:16px;
  color:#0f172a;
}

#chatbotInput:focus{
  outline:none;
  border-color:#00d2ff;
  box-shadow:0 0 0 3px rgba(0,210,255,.16);
}

#chatbotSend{
  width:auto;
  min-width:72px;
  height:44px;
  border:none;
  border-radius:12px;
  background:linear-gradient(135deg,#00d2ff,#2563eb);
  color:#fff;
  font-size:.9rem;
  font-weight:900;
  cursor:pointer;
}

@keyframes pulse{
  0%,100%{
    box-shadow:
      0 14px 35px rgba(0,210,255,.3),
      0 0 0 0 rgba(0,210,255,.42);
  }

  50%{
    box-shadow:
      0 14px 35px rgba(0,210,255,.3),
      0 0 0 15px rgba(0,210,255,0);
  }
}

@media(max-width:600px){
  #chatbotToggle{
    width:54px;
    height:54px;
    right:16px;
    bottom:18px;
    font-size:24px;
  }

  #chatbotPanel{
    left:12px;
    right:12px;
    bottom:82px;
    width:auto;
    height:66vh;
    max-height:610px;
    border-radius:20px;
  }

  .chat-header{
    padding:11px;
    font-size:.86rem;
  }

  .chat-header img{
    width:25px;
    height:25px;
  }

  #chatbotMessages{
    padding:10px;
    font-size:.84rem;
  }

  .bubble{
    max-width:86%;
    padding:8px 11px;
    line-height:1.35;
  }

  .quick-replies{
    grid-template-columns:repeat(2, minmax(0, 1fr));
    gap:5px;
    padding:8px;
    overflow:visible;
    max-height:none;
  }

  .quick-reply{
    font-size:.66rem;
    padding:6px 5px;
    min-height:30px;
    white-space:nowrap;
    border-radius:999px;
  }

  .chat-input{
    padding:8px;
    gap:7px;
  }

  #chatbotInput{
    height:40px;
    font-size:16px;
  }

  #chatbotSend{
    height:40px;
    min-width:62px;
    font-size:.8rem;
  }
}
  `;

  document.head.appendChild(style);

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
        <div class="quick-reply" onclick="askQuick('How do I download result?')">📥 Download Result</div>
        <div class="quick-reply" onclick="askQuick('What are the subscription plans?')">💳 Plans</div>
        <div class="quick-reply" onclick="askQuick('Can I add new schools?')">🏫 Add schools</div>
        <div class="quick-reply" onclick="askQuick('Contact support')">📞 Contact support</div>
        <div class="quick-reply" onclick="askQuick('Where is the result upload section?')">📤 Result upload</div>
        <div class="quick-reply" onclick="askQuick('How do I register student?')">📝 Register Student</div>
      </div>

      <div class="chat-input">
        <input id="chatbotInput" type="text" placeholder="Type your question..." />
        <button id="chatbotSend">Send</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", chatbotHTML);

  const toggle = document.getElementById("chatbotToggle");
  const panel = document.getElementById("chatbotPanel");
  const messages = document.getElementById("chatbotMessages");
  const input = document.getElementById("chatbotInput");
  const sendBtn = document.getElementById("chatbotSend");

  toggle.addEventListener("click", () => {
    panel.style.display = panel.style.display === "flex" ? "none" : "flex";
  });

  sendBtn.addEventListener("click", sendMessage);

  input.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });

  window.askQuick = function(text) {
    appendMessage("user", text);
    setTimeout(() => respond(text), 500);
  };

  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    appendMessage("user", text);
    input.value = "";

    setTimeout(() => respond(text), 500);
  }

  function appendMessage(sender, text) {
    const div = document.createElement("div");
    div.classList.add("msg", sender);

    const bubble = document.createElement("div");
    bubble.classList.add("bubble", sender);
    bubble.textContent = text;

    div.appendChild(bubble);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function respond(text) {
    let reply = "I'm not sure, but you can reach support at support@gradely.info.";
    const lower = text.toLowerCase();

    if (lower.includes("password")) {
      reply = "To reset your password as admin, go to Settings → Change Password. Students can use the Change Password option after login.";
    } else if (lower.includes("download")) {
      reply = "Login as a parent, then click Download PDF to get your child's result.";
    } else if (lower.includes("school") || lower.includes("add schools")) {
      reply = "You can register a new school from the Home page or Register School page.";
    } else if (lower.includes("plan") || lower.includes("subscription")) {
      reply = "Subscription plans are available on the Billing or Subscription page.";
    } else if (lower.includes("support") || lower.includes("contact")) {
      reply = "You can reach support at support@gradely.info.";
    } else if (lower.includes("hello") || lower.includes("hi")) {
      reply = "Hi there! 😊 How can I assist you today?";
    } else if (lower.includes("result") && lower.includes("upload")) {
      reply = "Login as admin, go to Dashboard, then click Upload Results.";
    } else if (lower.includes("register") && lower.includes("student")) {
      reply = "To register a student, go to Dashboard → Add New Student or use Bulk Upload.";
    }

    appendMessage("kaima", reply);
  }
});