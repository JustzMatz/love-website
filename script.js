
/* =========================================
   LOVE WEBSITE - MODULE 3
   Interactive Love Letter
========================================= */

document.addEventListener("DOMContentLoaded", () => {

  // =======================================
  // CONFIGURATION - EDIT YOUR LOVE MESSAGE
  // =======================================

  const LOVE_MESSAGE = `My love,

From the moment you came into my life,
everything started to feel a little more beautiful.

You make me smile even on my hardest days.
You make ordinary moments feel special,
and you make my world so much brighter.

I love the way you laugh.
I love the way you smile.
I love all the little things that make you, you.

I may not always have the perfect words,
but I hope you always know how much
you truly mean to me.

No matter how far apart we are,
or how difficult some days may be,
I want you to remember one thing.

You are special to me.
You are important to me.
And I am so grateful to have you in my life.

Thank you for being you.

I love you more than words can explain. ❤️`;

  const TYPING_SPEED = 28;

  // =======================================
  // ELEMENTS
  // =======================================

  const heartsContainer =
    document.getElementById("hearts-container");

  const welcomeScreen =
    document.getElementById("welcome-screen");

  const envelopeScreen =
    document.getElementById("envelope-screen");

  const letterScreen =
    document.getElementById("letter-screen");

  const surpriseBtn =
    document.getElementById("surprise-btn");

  const envelopeBtn =
    document.getElementById("envelope-btn");

  const envelopeBackBtn =
    document.getElementById("envelope-back-btn");

  const letterBackBtn =
    document.getElementById("letter-back-btn");

  const skipBtn =
    document.getElementById("skip-btn");

  const replayBtn =
    document.getElementById("replay-btn");

  const typedLetter =
    document.getElementById("typed-letter");

  const typingCursor =
    document.getElementById("typing-cursor");

  const letterComplete =
    document.getElementById("letter-complete");

  const envelope =
    document.querySelector(".envelope");

  const letterPaper =
    document.querySelector(".letter-paper");

  // =======================================
  // STATE
  // =======================================

  let typingTimer = null;
  let envelopeTimer = null;
  let currentIndex = 0;
  let isTyping = false;
  let envelopeOpening = false;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // =======================================
  // SCREEN MANAGEMENT
  // =======================================

  function showScreen(targetScreen) {

    const screens = [
      welcomeScreen,
      envelopeScreen,
      letterScreen
    ];

    screens.forEach((screen) => {

      const active = screen === targetScreen;

      screen.classList.toggle("active", active);

      screen.setAttribute(
        "aria-hidden",
        String(!active)
      );

    });

    window.scrollTo(0, 0);

  }

  // =======================================
  // WELCOME BUTTON
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

    clearTimeout(envelopeTimer);
    envelopeTimer = null;

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

    letterComplete.classList.add("hidden");
    replayBtn.classList.add("hidden");

    skipBtn.classList.remove("hidden");
    typingCursor.classList.remove("hidden");

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

    // Keep newest text visible
    letterPaper.scrollTop = letterPaper.scrollHeight;

    let delay = TYPING_SPEED;

    if (character === "." ||
        character === "!" ||
        character === "?") {
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

    if (typingTimer !== null) {
      clearTimeout(typingTimer);
      typingTimer = null;
    }

  }

  function finishTyping() {

    if (!isTyping) return;

    stopTyping();

    typedLetter.textContent = LOVE_MESSAGE;

    typingCursor.classList.add("hidden");
    skipBtn.classList.add("hidden");

    letterComplete.classList.remove("hidden");
    replayBtn.classList.remove("hidden");

    createHeartBurst();

  }

  // =======================================
  // SKIP BUTTON
  // =======================================

  skipBtn.addEventListener("click", () => {

    if (!isTyping) return;

    finishTyping();

  });

  // =======================================
  // REPLAY BUTTON
  // =======================================

  replayBtn.addEventListener("click", () => {

    startTyping();

  });

  // =======================================
  // BACK BUTTON
  // =======================================

  letterBackBtn.addEventListener("click", () => {

    stopTyping();
    resetEnvelope();

    showScreen(envelopeScreen);

  });

  // =======================================
  // FLOATING HEARTS
  // =======================================

  const heartSymbols = ["♥", "♡", "❤"];

  function createFloatingHeart() {

    if (reduceMotion || document.hidden) {
      return;
    }

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
    setInterval(createFloatingHeart, 550);
  }

  // =======================================
  // HEART CELEBRATION
  // =======================================

  function createHeartBurst() {

    if (reduceMotion) return;

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
  // INITIALIZE
  // =======================================

  showScreen(welcomeScreen);

});
