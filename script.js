
document.addEventListener("DOMContentLoaded", () => {

  // =======================================
  // PERSONALIZATION
  // =======================================

  const NICKNAME = "Future";

  const LOVE_MESSAGE = `Dear Future,

I don't always know how to put my feelings into words, but there's something I want you to know.

You have a special place in my heart.

It's not just about the big moments. Sometimes, it's the smallest things about you that make me smile the most.

The way you talk, the way you laugh, and the little things that make you who you are.

I appreciate you more than I probably say.

I know life won't always be perfect. There will be difficult days, unexpected moments, and things we can't control.

But I hope we can always be patient with each other, understand each other, and keep choosing kindness even when things get hard.

I want to keep learning about you, making you smile, and creating little moments that we'll remember.

You deserve to feel loved, appreciated, and cared for.

And I hope I can make you feel that way, not just through words, but through the little things I do.

Thank you for being part of my life, Future.

I'm really happy that it's you.

With all my love. ❤️`;

  const FINAL_MESSAGE = {
    title: `I Love You, ${NICKNAME}! ❤️`,

    paragraphs: [
      "I may not be able to give you the whole world, but I can promise to keep putting love and effort into the little things we share.",
      "I hope we have so many more reasons to smile together.",
      "And whenever you need a reminder of how special you are to me, I hope you'll remember this little surprise."
    ],

    signature: "With love, always. ♡"
  };

  const TYPING_SPEED = 28;

  // =======================================
  // ELEMENTS
  // =======================================

  const $ = (id) => document.getElementById(id);

  const heartsContainer = $("hearts-container");

  const welcomeScreen = $("welcome-screen");
  const envelopeScreen = $("envelope-screen");
  const letterScreen = $("letter-screen");
  const finalScreen = $("final-screen");

  const surpriseBtn = $("surprise-btn");
  const envelopeBtn = $("envelope-btn");
  const envelopeBackBtn = $("envelope-back-btn");
  const letterBackBtn = $("letter-back-btn");

  const skipBtn = $("skip-btn");
  const replayBtn = $("replay-btn");
  const finalBtn = $("final-btn");

  const revealBtn = $("reveal-btn");
  const restartBtn = $("restart-btn");

  const finalMessage = $("final-message");
  const finalMessageTitle = $("final-message-title");
  const finalMessageBody = $("final-message-body");
  const finalMessageSignature =
    $("final-message-signature");

  const typedLetter = $("typed-letter");
  const typingCursor = $("typing-cursor");
  const letterComplete = $("letter-complete");

  const letterPaper =
    document.querySelector(".letter-paper");

  const envelope =
    document.querySelector(".envelope");

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // =======================================
  // STATE
  // =======================================

  let typingTimer = null;
  let envelopeTimer = null;

  let currentIndex = 0;
  let isTyping = false;
  let envelopeOpening = false;

  // =======================================
  // SCREEN MANAGEMENT
  // =======================================

  const screens = [
    welcomeScreen,
    envelopeScreen,
    letterScreen,
    finalScreen
  ];

  function showScreen(targetScreen) {

    screens.forEach((screen) => {

      const active = screen === targetScreen;

      screen.hidden = !active;
      screen.classList.toggle("active", active);

      screen.setAttribute(
        "aria-hidden",
        String(!active)
      );
    });

    window.scrollTo(0, 0);
  }

  // =======================================
  // WELCOME
  // =======================================

  surpriseBtn.addEventListener("click", () => {

    resetEnvelope();
    showScreen(envelopeScreen);
    createHeartBurst();

  });

  // =======================================
  // ENVELOPE
  // =======================================

  envelopeBtn.addEventListener("click", () => {

    if (envelopeOpening) return;

    envelopeOpening = true;
    envelopeBtn.disabled = true;

    envelope.classList.add("open");

    envelopeTimer = setTimeout(() => {

      envelopeTimer = null;

      showScreen(letterScreen);
      startTyping();

    }, reduceMotion ? 0 : 1100);

  });

  envelopeBackBtn.addEventListener("click", () => {

    resetEnvelope();
    showScreen(welcomeScreen);

  });

  function resetEnvelope() {

    clearTimeout(envelopeTimer);
    envelopeTimer = null;

    envelopeOpening = false;
    envelopeBtn.disabled = false;

    envelope.classList.remove("open");
  }

  // =======================================
  // TYPEWRITER
  // =======================================

  function startTyping() {

    stopTyping();

    typedLetter.textContent = "";
    currentIndex = 0;
    isTyping = true;

    letterComplete.hidden = true;
    replayBtn.hidden = true;
    finalBtn.hidden = true;

    skipBtn.hidden = false;
    typingCursor.hidden = false;

    letterPaper.scrollTop = 0;

    if (reduceMotion) {
      finishTyping();
      return;
    }

    typeNextCharacter();
  }

  function typeNextCharacter() {

    if (!isTyping) return;

    if (currentIndex >= LOVE_MESSAGE.length) {
      finishTyping();
      return;
    }

    const character = LOVE_MESSAGE[currentIndex];

    typedLetter.textContent += character;
    currentIndex++;

    letterPaper.scrollTop = letterPaper.scrollHeight;

    let delay = TYPING_SPEED;

    if ([".", "!", "?"].includes(character)) {
      delay = 350;
    }

    if (character === "\n") {
      delay = 180;
    }

    typingTimer = setTimeout(
      typeNextCharacter,
      delay
    );
  }

  function stopTyping() {

    isTyping = false;

    clearTimeout(typingTimer);
    typingTimer = null;
  }

  function finishTyping() {

    if (!isTyping) return;

    stopTyping();

    typedLetter.textContent = LOVE_MESSAGE;

    typingCursor.hidden = true;
    skipBtn.hidden = true;

    letterComplete.hidden = false;
    replayBtn.hidden = false;
    finalBtn.hidden = false;

    createHeartBurst();
  }

  skipBtn.addEventListener("click", () => {

    if (isTyping) {
      finishTyping();
    }

  });

  replayBtn.addEventListener("click", startTyping);

  letterBackBtn.addEventListener("click", () => {

    stopTyping();
    resetEnvelope();

    showScreen(envelopeScreen);

  });

  // =======================================
  // FINAL SURPRISE
  // =======================================

  finalBtn.addEventListener("click", () => {

    showScreen(finalScreen);
    resetFinalSurprise();
    createHeartBurst();

  });

  function resetFinalSurprise() {

    finalMessage.hidden = true;
    revealBtn.hidden = false;
    restartBtn.hidden = true;

  }

  function setFinalMessage() {

    finalMessageTitle.textContent =
      FINAL_MESSAGE.title;

    finalMessageBody.replaceChildren();

    FINAL_MESSAGE.paragraphs.forEach((message) => {

      const paragraph = document.createElement("p");

      paragraph.textContent = message;

      finalMessageBody.appendChild(paragraph);

    });

    finalMessageSignature.textContent =
      FINAL_MESSAGE.signature;
  }

  revealBtn.addEventListener("click", () => {

    setFinalMessage();

    finalMessage.hidden = false;
    revealBtn.hidden = true;
    restartBtn.hidden = false;

    createCelebration();

    finalMessage.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest"
    });

  });

  restartBtn.addEventListener("click", () => {

    stopTyping();
    resetEnvelope();
    resetFinalSurprise();

    showScreen(welcomeScreen);
    createHeartBurst();

  });

  // =======================================
  // FLOATING HEARTS
  // =======================================

  const heartSymbols = ["♥", "♡", "❤"];

  function createFloatingHeart() {

    if (reduceMotion || document.hidden) return;

    const heart = document.createElement("span");

    heart.classList.add("floating-heart");

    heart.textContent =
      heartSymbols[
        Math.floor(Math.random() * heartSymbols.length)
      ];

    const size = Math.random() * 16 + 12;
    const left = Math.random() * 100;
    const duration = Math.random() * 5 + 7;
    const drift = Math.random() * 100 - 50;

    heart.style.fontSize = `${size}px`;
    heart.style.left = `${left}%`;
    heart.style.animationDuration = `${duration}s`;

    heart.style.setProperty(
      "--drift",
      `${drift}px`
    );

    heartsContainer.appendChild(heart);

    heart.addEventListener(
      "animationend",
      () => heart.remove(),
      { once: true }
    );
  }

  if (!reduceMotion) {
    setInterval(createFloatingHeart, 650);
  }

  // =======================================
  // SMALL HEART BURST
  // =======================================

  function createHeartBurst() {

    if (reduceMotion || document.hidden) return;

    for (let i = 0; i < 12; i++) {

      setTimeout(() => {

        if (document.hidden) return;

        const heart = document.createElement("span");

        heart.classList.add("floating-heart");
        heart.textContent = "♥";

        heart.style.left =
          `${35 + Math.random() * 30}%`;

        heart.style.fontSize =
          `${18 + Math.random() * 15}px`;

        heart.style.animationDuration = "3s";

        heart.style.setProperty(
          "--drift",
          `${Math.random() * 180 - 90}px`
        );

        heartsContainer.appendChild(heart);

        heart.addEventListener(
          "animationend",
          () => heart.remove(),
          { once: true }
        );

      }, i * 90);
    }
  }

  // =======================================
  // FINAL CELEBRATION
  // =======================================

  function createCelebration() {

    if (reduceMotion || document.hidden) return;

    const symbols = ["❤️", "💕", "💗", "♥", "♡"];

    for (let i = 0; i < 40; i++) {

      setTimeout(() => {

        if (document.hidden) return;

        const heart = document.createElement("span");

        heart.className = "celebration-heart";

        heart.textContent =
          symbols[Math.floor(Math.random() * symbols.length)];

        const angle = Math.random() * Math.PI * 2;
        const distance = 80 + Math.random() * 220;

        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        const rotation = Math.random() * 360 - 180;
        const duration = 1.5 + Math.random() * 1.2;

        heart.style.fontSize =
          `${14 + Math.random() * 18}px`;

        heart.style.setProperty("--x", `${x}px`);
        heart.style.setProperty("--y", `${y}px`);

        heart.style.setProperty(
          "--rotation",
          `${rotation}deg`
        );

        heart.style.setProperty(
          "--duration",
          `${duration}s`
        );

        document.body.appendChild(heart);

        heart.addEventListener(
          "animationend",
          () => heart.remove(),
          { once: true }
        );

      }, i * 45);
    }
  }

  // =======================================
  // INITIALIZATION
  // =======================================

  $("welcome-title").textContent =
    `Hi, ${NICKNAME}!`;

  resetFinalSurprise();
  showScreen(welcomeScreen);

});
