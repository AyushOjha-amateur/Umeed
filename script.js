// ==================================================================
//                        UMEED JAVASCRIPT
// ==================================================================
// Handles: Chatbot, Module Navigation, Login/Signup, Background Music,
// and Nutrition Module (Veg/Non-Veg food suggestions)
// ==================================================================

document.addEventListener("DOMContentLoaded", function () {

  // ---------------------------------------------------------------
  // [HOMEPAGE / NAV MODULE CARDS] - "Explore Modules" scroll button
  // ---------------------------------------------------------------
  const exploreBtn = document.getElementById("exploreModulesBtn");
  const modulesSection = document.getElementById("modulesSection");
  if (exploreBtn && modulesSection) {
    exploreBtn.addEventListener("click", function () {
      modulesSection.scrollIntoView({ behavior: "smooth" });
    });
  }

  // ---------------------------------------------------------------
  // [CHATBOT] - variable declaration for elements
  // ---------------------------------------------------------------
  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const chatbotClose = document.getElementById("chatbotClose");
  const chatbotInput = document.getElementById("chatbotInput");
  const chatbotSend = document.getElementById("chatbotSend");
  const chatbotMessages = document.getElementById("chatbotMessages");

  // [CHATBOT] - toggle open/close on button click
  if (chatbotToggle && chatbotWindow && chatbotInput) {
    chatbotToggle.addEventListener("click", function () {
      chatbotWindow.classList.toggle("hidden");
      if (!chatbotWindow.classList.contains("hidden")) {
        chatbotInput.focus();
      }
    });
  }
  if (chatbotClose && chatbotWindow) {
    chatbotClose.addEventListener("click", function () {
      chatbotWindow.classList.add("hidden");
    });
  }

  // [CHATBOT] - send and append messages
  function sendChatMessage() {
    if (!chatbotInput || !chatbotSend || !chatbotMessages) return;
    const message = chatbotInput.value.trim();
    if (!message) return;

    addMessage(message, "user");
    chatbotInput.value = "";
    chatbotSend.disabled = true;

    setTimeout(function () {
      addMessage(getBotResponse(message), "bot");
      chatbotSend.disabled = false;
      chatbotInput.focus();
    }, 800);
  }

  function addMessage(text, sender) {
    if (!chatbotMessages) return;
    const messageDiv = document.createElement("div");
    messageDiv.className = "chatbot-message " + sender + "-message";
    const contentDiv = document.createElement("div");
    contentDiv.className = "message-content";
    contentDiv.textContent = text;
    messageDiv.appendChild(contentDiv);
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  if (chatbotSend && chatbotInput) {
    chatbotSend.addEventListener("click", sendChatMessage);
    chatbotInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") sendChatMessage();
    });
  }

  function getBotResponse(msg) {
    msg = msg.toLowerCase();
    if (msg.includes("hello") || msg.includes("hi"))
      return "👋 Hi! Welcome to UMEED! How can I support you today?";
    if (msg.includes("stress"))
      return "🧘‍♀️ Try deep breathing or visit our Stress Management module!";
    if (msg.includes("help"))
      return "🤝 UMEED offers many support modules — explore them below!";
    if (msg.includes("umeed"))
      return "✨ UMEED means hope and wellness. We're here for you! 💜";
    if (msg.includes("sad") || msg.includes("depressed"))
      return "💙 You’re not alone. Try journaling or stress-relief music.";
    if (msg.includes("anxiety") || msg.includes("worried"))
      return "😌 Take deep breaths — calm starts within. 🌿";
    if (msg.includes("thank"))
      return "🙏 Always here for you! Keep shining. ✨";
    if (msg.includes("addiction"))
      return "🔄 Visit the Addiction Help module for recovery support.";
    return "💫 UMEED is here whenever you need hope and strength. 🌟";
  }

  // ---------------------------------------------------------------
  // [LOGIN/SIGNUP] - demo alerts
  // ---------------------------------------------------------------
  const loginBtn = document.getElementById("login-btn");
  const signupBtn = document.getElementById("signup-btn");
  if (loginBtn) loginBtn.addEventListener("click", () => alert("Login modal (demo)"));
  if (signupBtn) signupBtn.addEventListener("click", () => alert("Signup modal (demo)"));

  // ---------------------------------------------------------------
  // [MODULE CARDS] - Redirect to module pages
  // ---------------------------------------------------------------
  document.querySelectorAll(".module-card").forEach((card) => {
    card.addEventListener("click", () => {
      const moduleName = card.dataset.module;
      if (moduleName) window.location.href = `${moduleName}.html`;
    });
  });

  // ---------------------------------------------------------------
  // [STRESS.HTML MUSIC] - Background music / auto-play
  // ---------------------------------------------------------------
  const bgMusic = document.getElementById("bgMusic");
  if (bgMusic) {
    document.addEventListener("click", function enableAudio() {
      if (bgMusic.paused) bgMusic.play().catch(() => {});
      document.removeEventListener("click", enableAudio);
    });
  }
}); // END of DOMContentLoaded

// ==================================================================
// [NUTRITION MODULE] - Veg/Non-Veg dish recommendations (multi-option)
// ==================================================================

let foodType = "veg"; // default

function setType(type) {
  foodType = type;

  const vegBtn = document.getElementById("vegBtn");
  const nonvegBtn = document.getElementById("nonvegBtn");

  if (type === "veg") {
    vegBtn.classList.add("active");
    nonvegBtn.classList.remove("active");
  } else {
    nonvegBtn.classList.add("active");
    vegBtn.classList.remove("active");
  }
}

//NUTRITION//
// 🍽️ Multiple dish options with mood/goal categories
const dishes = {
  energy: {
    veg: [
      { name: "Oats Banana Smoothie 🥤", tip: "Rich in fiber and potassium — boosts energy naturally." },
      { name: "Peanut Butter Toast 🍞", tip: "A quick bite loaded with protein and healthy fats." },
      { name: "Chia Seed Yogurt Bowl 🥣", tip: "A slow-release energy combo — ideal for morning freshness." }
    ],
    nonveg: [
      { name: "Grilled Chicken & Brown Rice 🍛", tip: "Lean protein meal for lasting power and recovery." },
      { name: "Egg & Avocado Toast 🍳🥑", tip: "Balanced breakfast for a steady energy curve." },
      { name: "Tuna Salad Wrap 🌯", tip: "Light, protein-packed, perfect for on-the-go strength." }
    ]
  },
  focus: {
    veg: [
      { name: "Spinach & Paneer Wrap 🌯", tip: "Iron and calcium combo to sharpen concentration." },
      { name: "Almond & Berry Smoothie 🫐", tip: "Antioxidants enhance brain clarity and alertness." },
      { name: "Broccoli Quinoa Bowl 🥦", tip: "Rich in folate and magnesium — fuels the mind." }
    ],
    nonveg: [
      { name: "Boiled Eggs & Tuna Sandwich 🥪", tip: "Omega-3s support better focus and memory." },
      { name: "Chicken & Veg Stir Fry 🍗🥕", tip: "Protein and fiber together boost mental alertness." },
      { name: "Fish Tacos 🐟", tip: "Light and energizing for brain balance and sharpness." }
    ]
  },
  sleep: {
    veg: [
      { name: "Warm Milk with Nuts 🌙", tip: "Tryptophan and magnesium help you rest deeply." },
      { name: "Banana Almond Smoothie 🍌", tip: "Natural serotonin booster — relaxes muscles gently." },
      { name: "Cinnamon Herbal Tea 🍵", tip: "A soothing drink that slows heart rate and calms nerves." }
    ],
    nonveg: [
      { name: "Steamed Fish & Rice 🐟", tip: "Soft meal that helps unwind before sleep." },
      { name: "Boiled Egg & Oat Combo 🍳", tip: "Protein balance that doesn’t feel heavy before bed." },
      { name: "Chicken Broth Soup 🍲", tip: "Warm and comforting — melts daily stress away." }
    ]
  },
  mood: {
    veg: [
      { name: "Colorful Veg Stir Fry 🥕", tip: "Vibrant veggies lift mood and energy naturally." },
      { name: "Sweet Potato Chaat 🍠", tip: "Sweetness meets fiber — comfort food with happiness." },
      { name: "Fruit & Honey Parfait 🍓🍯", tip: "Natural sugar release boosts joy hormones gently." }
    ],
    nonveg: [
      { name: "Chicken Soup 🍲", tip: "Comfort in a bowl — calms nerves and warms the heart." },
      { name: "Honey Garlic Prawns 🍤", tip: "Sweet, savory, and serotonin-rich for emotional balance." },
      { name: "Turkey Sandwich 🥪", tip: "Contains tryptophan — the natural feel-good amino acid." }
    ]
  },
  detox: {
    veg: [
      { name: "Lemon Cucumber Detox Water 🍋", tip: "Flushes toxins and hydrates your body gently." },
      { name: "Mint Green Tea 🍃", tip: "Cleanses your system and refreshes your mind." },
      { name: "Beetroot Juice 🥤", tip: "Purifies blood and promotes glowing skin." }
    ],
    nonveg: [
      { name: "Grilled Fish with Lemon 🐠", tip: "Light, clean meal for natural detox and clarity." },
      { name: "Chicken Veg Soup 🍜", tip: "Warm broth helps digestion and inner cleansing." },
      { name: "Egg White Wrap 🍳", tip: "High-protein, low-fat, perfect for post-detox nourishment." }
    ]
  },
  weight: {
    veg: [
      { name: "Sprout & Veg Salad 🥗", tip: "Fiber-rich and refreshing — keeps you full longer." },
      { name: "Steamed Veggies with Olive Oil 🥦", tip: "Simple, light, and perfect for mindful eating." },
      { name: "Brown Rice & Lentil Bowl 🍚", tip: "Balanced carbs and protein to stay energetic." }
    ],
    nonveg: [
      { name: "Egg White Omelet 🍳", tip: "Lean and filling — supports muscle tone and fat loss." },
      { name: "Grilled Chicken Salad 🥬", tip: "A fresh mix of greens and protein for clean meals." },
      { name: "Fish Fillet with Veggies 🐟🥕", tip: "Low-calorie, high-nutrient — perfect for fitness goals." }
    ]
  }
};

// 🍀 Gentle Reminders — rotates each time
const gentleReminders = [
  [
    "Eat slowly and savor every bite.",
    "Hydration is quiet self-care — keep sipping water.",
    "Nourish your body with kindness, not rules.",
    "The more colorful your plate, the happier your cells."
  ],
  [
    "Listen to your hunger, not the clock.",
    "Wholesome food brings peaceful energy.",
    "A calm meal helps a calm mind.",
    "Balance begins with one mindful bite."
  ],
  [
    "Food tastes better when shared or smiled upon.",
    "Eat in peace — let gratitude flavor your meal.",
    "What you eat becomes energy, not guilt.",
    "You’re feeding both your body and spirit."
  ]
];

// 🍲 Show modal with randomized dish & reminder
function showDish(goal) {
  const modal = document.getElementById('suggestionModal');
  const title = document.getElementById('modalTitle');
  const text = document.getElementById('modalText');

  const selectedList = dishes[goal][foodType];
  const selectedDish = selectedList[Math.floor(Math.random() * selectedList.length)];

  // Random reminder block
  const reminderBlock = gentleReminders[Math.floor(Math.random() * gentleReminders.length)];
  const randomTips = reminderBlock
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((tip) => `<li>${tip}</li>`)
    .join("");

  title.textContent = selectedDish.name;
  text.innerHTML = `
    <p>${selectedDish.tip}</p>
    <p style="margin-top:10px; font-weight:600;">💡 Gentle Reminders:</p>
    <ul style="text-align:left; line-height:1.6;">${randomTips}</ul>
  `;

  modal.classList.remove('hidden');
}

function closeSuggestionModal() {
  document.getElementById('suggestionModal').classList.add('hidden');
}

// ==================================================================
// [STRESS MANAGEMENT MODULE] - deeply calming responses
// ==================================================================
function showSuggestion(feeling) {
    const modal = document.getElementById('suggestionModal');
    const title = document.getElementById('modalTitle');
    const text = document.getElementById('modalText');
  
    const suggestions = {
      low: `
        🌤️ **Feeling low and tired** — it’s okay, truly.  
        Sometimes your mind just needs a little silence and sunlight.  
        Step outside, let the breeze touch your face, and take a few deep breaths.  
        Remember, even the softest sunrise begins in darkness. You’re allowed to rest. 🌱
      `,
  
      hopeless: `
        🌅 **When hope feels lost**, pause for a moment.  
        Life may look cloudy now, but clouds never stay forever.  
        Write down one small thing you wish to see tomorrow — no matter how tiny.  
        Hope often hides in small corners, waiting to be noticed again. 🌻
      `,
  
      stressed: `
        🌾 **You’ve carried so much today.**  
        Place your hand on your chest and breathe slowly — in for four, hold, out for four.  
        Let your thoughts float away like leaves in a calm stream.  
        You are doing enough. You *are* enough. 🌙
      `,
  
      anger: `
        🔥 **Anger is energy that needs space.**  
        Don’t fight it — breathe through it. Step outside, unclench your fists, and count to ten slowly.  
        Feel your heartbeat soften with every breath.  
        You deserve peace more than the argument deserves a reply. 🌬️
      `,
  
      anxious: `
        🌿 **Anxiety comes when our mind runs ahead of time.**  
        Gently bring yourself back to this moment — notice three things you can see, two you can touch, one you can hear.  
        The present moment is safe. The future can wait. You are here, and that’s enough. 🌼
      `,
  
      silent: `
        🌙 **Silence can heal.**  
        It’s okay if you don’t want to talk right now. Sit by the window, listen to the world breathe, and let the stillness hug you.  
        When words are ready, they’ll come softly — like dawn light through curtains. 🌸
      `,
  
      sleeping: `
        🌌 **Your body is tired, your mind too.**  
        Dim the lights, play something soft, and breathe until your heartbeat slows.  
        Imagine floating on calm water under stars — nothing to fix, nothing to prove.  
        Tonight, you’re allowed to rest completely. 🌠
      `,
  
      conflict: `
        💭 **Arguments shake the heart.**  
        Before reacting, breathe once for yourself. Remember, every person carries pain unseen.  
        Listen with patience; respond with kindness, even if your voice trembles.  
        Peace grows when we choose understanding over winning. ☁️
      `
    };
  
    title.textContent = "🕊️ Calm Space";
    text.innerHTML = suggestions[feeling] || `
      🌺 **Take a moment for yourself.**  
      You are not behind. You are healing.  
      Close your eyes and imagine peace spreading like light through your body.  
      UMEED believes in you — always. 💖
    `;
  
    modal.classList.remove('hidden');
  }
  
  function closeSuggestionModal() {
    const modal = document.getElementById('suggestionModal');
    modal.classList.add('hidden');
  }
  