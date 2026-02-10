const dayOrder = [
  { key: "rose", date: 7 },
  { key: "propose", date: 8 },
  { key: "chocolate", date: 9 },
  { key: "teddy", date: 10 },
  { key: "promise", date: 11 },
  { key: "hug", date: 12 },
  { key: "kiss", date: 13 },
  { key: "valentine", date: 14 }
];

function getActiveDays(today) {
  const month = today.getMonth();
  const date = today.getDate();
  if (month !== 1) return [];
  if (date < dayOrder[0].date) return [];
  if (date >= dayOrder[dayOrder.length - 1].date) {
    return dayOrder.map((d) => d.key);
  }
  return dayOrder.filter((d) => d.date <= date).map((d) => d.key);
}

function setupDayCards() {
  const cards = document.querySelectorAll(".day-card");
  if (!cards.length) return;
  const activeDays = getActiveDays(new Date());
  cards.forEach((card) => {
    const key = card.dataset.day;
    if (activeDays.includes(key)) {
      card.classList.add("active");
      return;
    }
    card.classList.add("locked");
    card.setAttribute("aria-disabled", "true");
    card.setAttribute("tabindex", "-1");
  });
}

function setupPlayer() {
  const playBtn = document.getElementById("playHome");
  if (!playBtn) return;
  const link = playBtn.dataset.link;
  if (!link) return;
  playBtn.addEventListener("click", () => {
    window.open(link, "_blank", "noopener");
  });
}

function spawnPetal(container, x, y, mode = "fall") {
  const petal = document.createElement("div");
  petal.className = "petal-spark";
  petal.style.left = `${x}px`;
  petal.style.top = `${y}px`;
  container.appendChild(petal);

  const isBurst = mode === "burst";
  gsap.to(petal, {
    y: isBurst ? `+=${gsap.utils.random(-200, window.innerHeight)}` : window.innerHeight + 100,
    x: `+=${gsap.utils.random(-200, 200)}`,
    rotation: gsap.utils.random(0, 180),
    duration: gsap.utils.random(2.5, 4.5),
    ease: "power1.out",
    onComplete: () => petal.remove()
  });
}

function shakeRose() {
  const rose = document.getElementById("bigRose");
  const field = document.getElementById("petalField");
  if (!rose || !field) return;

  const rect = rose.getBoundingClientRect();
  const isRoseDay = document.body.classList.contains("rose-day");
  const total = isRoseDay ? 70 : 30;
  for (let i = 0; i < total; i += 1) {
    const x = isRoseDay ? gsap.utils.random(0, window.innerWidth) : rect.left + rect.width / 2;
    const y = isRoseDay ? gsap.utils.random(0, window.innerHeight) : rect.top + rect.height / 2;
    spawnPetal(field, x, y, isRoseDay ? "burst" : "fall");
  }

  gsap.fromTo(
    rose,
    { rotation: -3 },
    { rotation: 3, duration: 0.1, repeat: 6, yoyo: true, ease: "power2.inOut" }
  );
}

function setupRose() {
  const rose = document.getElementById("bigRose");
  const btn = document.getElementById("scatterRose");
  if (!rose) return;

  const isRoseDay = document.body.classList.contains("rose-day");

  if (isRoseDay) {
    gsap.fromTo(
      rose,
      { scale: 0.6, opacity: 0 },
      { scale: 1.1, opacity: 1, duration: 1.2, ease: "elastic.out(1, 0.4)" }
    );
    setTimeout(() => {
      shakeRose();
    }, 1400);
  }

  gsap.to(rose, {
    rotation: 2,
    y: -6,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  rose.addEventListener("click", shakeRose);
  if (btn) btn.addEventListener("click", shakeRose);
}

function spawnHeartDrop(container, x, y) {
  const heart = document.createElement("div");
  heart.className = "heart-drop";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  container.appendChild(heart);

  gsap.to(heart, {
    y: window.innerHeight + 120,
    x: `+=${gsap.utils.random(-80, 80)}`,
    rotation: gsap.utils.random(-90, 90),
    duration: gsap.utils.random(2.2, 3.5),
    ease: "power1.in",
    onComplete: () => heart.remove()
  });
}

function setupClouds() {
  const rain = document.getElementById("rainField");
  const clouds = document.querySelectorAll(".cloud");
  if (!rain || !clouds.length) return;

  clouds.forEach((cloud) => {
    gsap.to(cloud, {
      y: gsap.utils.random(-8, 8),
      duration: gsap.utils.random(2, 3),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    cloud.addEventListener("click", () => {
      const rect = cloud.getBoundingClientRect();
      for (let i = 0; i < 24; i += 1) {
        spawnHeartDrop(rain, rect.left + rect.width / 2, rect.bottom - 10);
      }
    });
  });
}

function revealHero() {
  const hero = document.querySelector(".hero-text");
  if (!hero) return;
  gsap.from(hero.children, {
    opacity: 0,
    y: 20,
    duration: 0.8,
    stagger: 0.12,
    ease: "power2.out"
  });
}

function launchConfetti() {
  const field = document.getElementById("confettiField");
  if (!field) return;
  const colors = ["#ff6b81", "#ffd1dc", "#f2c14e", "#2ec4b6", "#ffffff"];

  for (let i = 0; i < 80; i += 1) {
    const piece = document.createElement("div");
    piece.className = "confetti";
    piece.style.left = `${gsap.utils.random(0, window.innerWidth)}px`;
    piece.style.top = "-20px";
    piece.style.background = colors[i % colors.length];
    field.appendChild(piece);

    gsap.to(piece, {
      y: window.innerHeight + 120,
      x: `+=${gsap.utils.random(-120, 120)}`,
      rotation: gsap.utils.random(0, 360),
      duration: gsap.utils.random(2.5, 4.5),
      ease: "power1.out",
      onComplete: () => piece.remove()
    });
  }
}

function launchKittyCelebration() {
  const container = document.createElement("div");
  container.className = "ambient-hearts";
  document.body.appendChild(container);
  const emojis = ["🐱", "😺", "💗", "✨"];
  for (let i = 0; i < 26; i += 1) {
    const emoji = emojis[i % emojis.length];
    spawnEmoji(container, emoji, window.innerWidth / 2, window.innerHeight / 2);
  }
  setTimeout(() => container.remove(), 4000);
}

function setupProposalFlow() {
  const acceptOne = document.getElementById("acceptOne");
  const acceptTwo = document.getElementById("acceptTwo");
  const stage2 = document.getElementById("proposalStage2");
  const letter = document.getElementById("proposalLetter");
  const song = document.getElementById("proposalSong");
  const stage3 = document.getElementById("proposalStage3");
  const stage4 = document.getElementById("proposalStage4");
  const stage5 = document.getElementById("proposalStage5");

  if (!acceptOne || !acceptTwo) return;

  acceptOne.addEventListener("click", () => {
    stage2?.classList.remove("hidden");
    letter?.classList.remove("hidden");
    song?.classList.remove("hidden");
    stage3?.classList.remove("hidden");
    launchConfetti();
    launchKittyCelebration();
    gsap.fromTo(stage2, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 });
    gsap.fromTo(letter, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.1 });
    gsap.fromTo(song, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.15 });
    gsap.fromTo(stage3, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
  });

  acceptTwo.addEventListener("click", () => {
    stage4?.classList.remove("hidden");
    stage5?.classList.remove("hidden");
    launchConfetti();
    gsap.fromTo(stage4, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 });
    gsap.fromTo(stage5, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
  });
}

function setupLoveLetter() {
  const ribbon = document.getElementById("letterRibbon");
  const letter = document.getElementById("loveLetter");
  if (!ribbon || !letter) return;
  ribbon.addEventListener("click", () => {
    letter.classList.add("open");
  });
}

function setupChocolateBox() {
  const box = document.getElementById("chocoBox");
  const field = document.getElementById("sparkField");
  const arrival = document.getElementById("chocoArrival");
  const rain = document.getElementById("chocoRain");
  const note = document.getElementById("chocoNote");
  if (!box || !field) return;

  box.addEventListener("click", () => {
    if (box.classList.contains("open")) return;
    box.classList.add("open");
    if (arrival) {
      arrival.classList.add("arrived");
    }
    if (note) {
      note.textContent = "They are here, made just for you.";
    }
    for (let i = 0; i < 30; i += 1) {
      const spark = document.createElement("div");
      spark.className = "choco-spark";
      spark.style.left = `${gsap.utils.random(0, window.innerWidth)}px`;
      spark.style.top = `${gsap.utils.random(0, window.innerHeight / 2)}px`;
      field.appendChild(spark);
      gsap.to(spark, {
        y: window.innerHeight + 100,
        x: `+=${gsap.utils.random(-100, 100)}`,
        rotation: gsap.utils.random(0, 180),
        duration: gsap.utils.random(2.5, 4),
        ease: "power1.out",
        onComplete: () => spark.remove()
      });
    }

    if (arrival && rain) {
      const width = arrival.clientWidth || 320;
      const height = arrival.clientHeight || 200;

      const heartPoints = [];
      const total = 18;
      for (let i = 0; i < total; i += 1) {
        const t = (Math.PI * 2 * i) / total;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        heartPoints.push({ x, y });
      }

      const scale = Math.min(width / 38, height / 34);
      const centerX = width / 2;
      const centerY = height / 2 + 10;

      heartPoints.forEach((point, index) => {
        const piece = document.createElement("div");
        piece.className = "choco-piece";
        piece.style.left = `${centerX}px`;
        piece.style.top = "-40px";
        rain.appendChild(piece);
        const targetX = centerX + point.x * scale;
        const targetY = centerY - point.y * scale;
        gsap.to(piece, {
          x: targetX - centerX,
          y: targetY,
          rotation: gsap.utils.random(-12, 12),
          duration: 1.8,
          delay: index * 0.06,
          ease: "bounce.out"
        });
      });

      for (let i = 0; i < 10; i += 1) {
        const piece = document.createElement("div");
        piece.className = "choco-piece";
        piece.style.left = `${gsap.utils.random(10, width - 40)}px`;
        piece.style.top = "-40px";
        rain.appendChild(piece);
        gsap.to(piece, {
          y: height - 90 - gsap.utils.random(0, 30),
          x: `+=${gsap.utils.random(-30, 30)}`,
          rotation: gsap.utils.random(-18, 18),
          duration: gsap.utils.random(1.2, 2.4),
          delay: gsap.utils.random(0, 0.8),
          ease: "bounce.out"
        });
      }
    }
  });
}

function setupTeddy() {
  const teddy = document.getElementById("teddyFigure");
  const bubble = document.getElementById("teddyBubble");
  const teddyField = document.getElementById("teddyField");
  const danceWrap = document.getElementById("teddyDance");
  const dancers = danceWrap ? danceWrap.querySelectorAll(".dance-teddy") : [];
  if (!teddy) return;
  gsap.fromTo(
    teddy,
    { y: 30, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, ease: "power2.out" }
  );
  gsap.to(teddy, {
    y: -8,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  teddy.addEventListener("mouseenter", () => {
    gsap.to(teddy, { rotation: 4, duration: 0.25, yoyo: true, repeat: 1, ease: "power1.out" });
  });

  teddy.addEventListener("click", () => {
    gsap.fromTo(
      teddy,
      { scale: 1 },
      { scale: 1.08, duration: 0.2, yoyo: true, repeat: 1, ease: "power1.out" }
    );
    teddy.classList.add("sit");
    if (bubble) {
      bubble.classList.add("show");
      setTimeout(() => bubble.classList.remove("show"), 3200);
    }
    if (teddyField) {
      const rect = teddy.getBoundingClientRect();
      for (let i = 0; i < 16; i += 1) {
        spawnEmoji(teddyField, "🧸", rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
      for (let i = 0; i < 12; i += 1) {
        spawnEmoji(teddyField, "✨", rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
      for (let i = 0; i < 40; i += 1) {
        spawnFallingEmoji(teddyField, "🧸", gsap.utils.random(0, window.innerWidth), -30);
      }
      for (let i = 0; i < 30; i += 1) {
        spawnFallingEmoji(teddyField, "💞", gsap.utils.random(0, window.innerWidth), -20);
      }
    }
  });

  const rain = document.getElementById("rainField");
  if (!rain) return;
  setInterval(() => {
    for (let i = 0; i < 10; i += 1) {
      spawnHeartDrop(rain, gsap.utils.random(0, window.innerWidth), -10);
    }
  }, 1200);

  if (teddyField) {
    setInterval(() => {
      spawnEmoji(teddyField, "💞", gsap.utils.random(0, window.innerWidth), window.innerHeight + 10);
    }, 900);
  }

  if (dancers.length) {
    gsap.to(dancers, {
      y: -10,
      rotation: 6,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      stagger: 0.12,
      ease: "sine.inOut"
    });
    danceWrap?.addEventListener("click", () => {
      gsap.fromTo(
        dancers,
        { scale: 1 },
        { scale: 1.15, duration: 0.25, yoyo: true, repeat: 1, stagger: 0.05, ease: "power1.out" }
      );
      if (teddyField) {
        const rect = danceWrap.getBoundingClientRect();
        for (let i = 0; i < 18; i += 1) {
          spawnEmoji(teddyField, "✨", rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
      }
    });
  }
}

function spawnEmoji(container, emoji, x, y) {
  const el = document.createElement("div");
  el.className = "emoji-float";
  el.textContent = emoji;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  container.appendChild(el);
  gsap.to(el, {
    y: y - gsap.utils.random(120, 220),
    x: `+=${gsap.utils.random(-60, 60)}`,
    opacity: 0,
    duration: gsap.utils.random(2, 3.5),
    ease: "power1.out",
    onComplete: () => el.remove()
  });
}

function spawnFallingEmoji(container, emoji, x, y = -20) {
  const el = document.createElement("div");
  el.className = "emoji-float";
  el.textContent = emoji;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.fontSize = `${gsap.utils.random(1.6, 2.4)}rem`;
  container.appendChild(el);
  gsap.to(el, {
    y: window.innerHeight + 120,
    x: `+=${gsap.utils.random(-80, 80)}`,
    rotation: gsap.utils.random(-90, 90),
    opacity: 0,
    duration: gsap.utils.random(3, 5),
    ease: "power1.out",
    onComplete: () => el.remove()
  });
}

function setupStickerWall(containerId, emojis) {
  const wall = document.getElementById(containerId);
  if (!wall) return;
  const count = 30;
  for (let i = 0; i < count; i += 1) {
    const el = document.createElement("div");
    el.className = "wall-sticker";
    el.textContent = emojis[i % emojis.length];
    el.style.left = `${gsap.utils.random(0, 92)}%`;
    el.style.top = `${gsap.utils.random(0, 92)}%`;
    el.style.transform = `rotate(${gsap.utils.random(-12, 12)}deg)`;
    wall.appendChild(el);
    gsap.to(el, {
      y: gsap.utils.random(-20, 20),
      duration: gsap.utils.random(3, 6),
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: gsap.utils.random(0, 1.5)
    });
  }
}

function setupHugKiss() {
  const hugSticker = document.getElementById("hugSticker");
  const hugField = document.getElementById("hugField");
  const kissSticker = document.getElementById("kissSticker");
  const kissField = document.getElementById("kissField");

  setupStickerWall("hugWall", ["🤗", "💞", "💗", "✨"]);
  setupStickerWall("kissWall", ["😘", "💋", "💖", "✨"]);

  if (hugSticker && hugField) {
    gsap.to(hugSticker, { scale: 1.05, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
    hugSticker.addEventListener("click", () => {
      const rect = hugSticker.getBoundingClientRect();
      for (let i = 0; i < 14; i += 1) {
        spawnEmoji(hugField, "🤗", rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    });
    setInterval(() => {
      spawnEmoji(hugField, "💞", gsap.utils.random(0, window.innerWidth), window.innerHeight + 10);
    }, 900);
  }

  const hugCore = document.querySelector(".hug-core");
  if (hugCore && hugField) {
    hugCore.addEventListener("click", () => {
      const rect = hugCore.getBoundingClientRect();
      for (let i = 0; i < 18; i += 1) {
        spawnEmoji(hugField, "💖", rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    });
  }

  const hugBurst = document.getElementById("hugBurst");
  if (hugBurst && hugField) {
    hugBurst.addEventListener("click", () => {
      gsap.fromTo(
        hugBurst,
        { scale: 0.96 },
        { scale: 1, duration: 0.25, yoyo: true, repeat: 1, ease: "power1.out" }
      );
      const orb = document.querySelector(".hug-orb");
      if (orb) {
        gsap.fromTo(
          orb,
          { scale: 0.9, rotate: -6 },
          { scale: 1.1, rotate: 6, duration: 0.35, yoyo: true, repeat: 1, ease: "sine.inOut" }
        );
      }
      for (let i = 0; i < 24; i += 1) {
        spawnEmoji(hugField, "🤍", gsap.utils.random(0, window.innerWidth), window.innerHeight - 80);
      }
      if (orb) {
        const rect = orb.getBoundingClientRect();
        for (let i = 0; i < 18; i += 1) {
          spawnEmoji(hugField, "💗", rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
      }
    });
  }

  if (kissSticker && kissField) {
    gsap.to(kissSticker, { rotation: 6, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
    kissSticker.addEventListener("click", () => {
      const rect = kissSticker.getBoundingClientRect();
      for (let i = 0; i < 14; i += 1) {
        spawnEmoji(kissField, "😘", rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    });
    setInterval(() => {
      spawnEmoji(kissField, "💋", gsap.utils.random(0, window.innerWidth), window.innerHeight + 10);
    }, 900);
  }

  const kissBurst = document.getElementById("kissBurst");
  if (kissBurst && kissField) {
    kissBurst.addEventListener("click", () => {
      gsap.fromTo(
        kissBurst,
        { scale: 0.96 },
        { scale: 1, duration: 0.25, yoyo: true, repeat: 1, ease: "power1.out" }
      );
      const orb = document.querySelector(".kiss-orb");
      if (orb) {
        gsap.fromTo(
          orb,
          { scale: 0.9, rotate: -6 },
          { scale: 1.1, rotate: 6, duration: 0.35, yoyo: true, repeat: 1, ease: "sine.inOut" }
        );
        const rect = orb.getBoundingClientRect();
        for (let i = 0; i < 18; i += 1) {
          spawnEmoji(kissField, "💖", rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
      }
      for (let i = 0; i < 26; i += 1) {
        spawnEmoji(kissField, "💋", gsap.utils.random(0, window.innerWidth), window.innerHeight - 80);
      }
    });
  }
}

function setupValentine() {
  const heart = document.getElementById("valentineHeart");
  const field = document.getElementById("valentineField");
  const sky = document.getElementById("valentineSky");
  const roseField = document.getElementById("valentineRoses");
  const roseButton = document.getElementById("valentineRose");
  if (!heart || !field) return;

  const cards = gsap.utils.toArray(".valentine .page-card");
  gsap.from(cards, {
    y: 30,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: "power2.out"
  });

  gsap.to(heart, { scale: 1.08, duration: 1.4, yoyo: true, repeat: -1, ease: "sine.inOut" });
  heart.addEventListener("click", () => {
    const rect = heart.getBoundingClientRect();
    for (let i = 0; i < 24; i += 1) {
      spawnEmoji(field, "❤️", rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    const ring = document.createElement("div");
    ring.className = "valentine-ring";
    heart.appendChild(ring);
    gsap.fromTo(
      ring,
      { scale: 0.6, opacity: 0.7 },
      { scale: 1.35, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => ring.remove() }
    );
  });
  setInterval(() => {
    spawnEmoji(field, "💖", gsap.utils.random(0, window.innerWidth), window.innerHeight + 10);
  }, 800);

  if (sky) {
    const skyEmojis = ["💗", "💖", "✨", "💞"];
    setInterval(() => {
      const el = document.createElement("div");
      el.className = "valentine-float";
      el.textContent = skyEmojis[Math.floor(Math.random() * skyEmojis.length)];
      el.style.left = `${gsap.utils.random(0, window.innerWidth)}px`;
      el.style.top = `${window.innerHeight + 30}px`;
      el.style.fontSize = `${gsap.utils.random(1.2, 2.4)}rem`;
      sky.appendChild(el);
      gsap.to(el, {
        y: gsap.utils.random(-200, -420),
        x: `+=${gsap.utils.random(-60, 60)}`,
        opacity: 0,
        duration: gsap.utils.random(4, 6),
        ease: "power1.out",
        onComplete: () => el.remove()
      });
    }, 500);
  }

  if (roseField) {
    const positions = [8, 20, 32, 44, 58, 72, 86];
    positions.forEach((pos, index) => {
      const rose = document.createElement("div");
      rose.className = "hanging-rose";
      rose.textContent = "🌹";
      rose.style.left = `${pos}%`;
      rose.style.setProperty("--thread", `${gsap.utils.random(110, 170)}px`);
      roseField.appendChild(rose);
      gsap.to(rose, {
        rotation: index % 2 === 0 ? 7 : -7,
        duration: gsap.utils.random(2.6, 4.2),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    });
  }

  if (roseButton && field) {
    gsap.to(roseButton, { scale: 1.05, duration: 1.8, yoyo: true, repeat: -1, ease: "sine.inOut" });
    roseButton.addEventListener("click", () => {
      const rect = roseButton.getBoundingClientRect();
      for (let i = 0; i < 50; i += 1) {
        spawnPetal(field, rect.left + rect.width / 2, rect.top + rect.height / 2, "burst");
      }
      for (let i = 0; i < 60; i += 1) {
        spawnFallingEmoji(field, "🌹", gsap.utils.random(0, window.innerWidth), -30);
      }
    });
  }
}

function setupCoupleHeart() {
  const heart = document.getElementById("coupleHeart");
  const boy = document.getElementById("coupleBoy");
  const girl = document.getElementById("coupleGirl");
  const grid = document.getElementById("coupleGrid");
  if (!heart || !boy || !girl) return;
  heart.addEventListener("click", () => {
    if (grid) {
      grid.classList.add("close");
    }
    const burst = document.createElement("div");
    burst.className = "merge-heart";
    burst.textContent = "💞";
    grid?.appendChild(burst);
    gsap.fromTo(
      burst,
      { scale: 0.6, opacity: 0 },
      { scale: 1.3, opacity: 1, duration: 0.5, ease: "power2.out" }
    );
    gsap.to(burst, {
      scale: 0.2,
      opacity: 0,
      duration: 0.6,
      delay: 0.6,
      onComplete: () => burst.remove()
    });
    boy.classList.add("active");
    girl.classList.remove("active");
    setTimeout(() => {
      boy.classList.remove("active");
      girl.classList.add("active");
    }, 1300);
    setTimeout(() => {
      girl.classList.remove("active");
      grid?.classList.remove("close");
    }, 2800);
  });
}

function setupAmbientHearts() {
  const container = document.createElement("div");
  container.className = "ambient-hearts";
  document.body.appendChild(container);
  const emojis = ["💗", "💖", "💞", "✨"];
  setInterval(() => {
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    spawnEmoji(container, emoji, gsap.utils.random(0, window.innerWidth), window.innerHeight + 10);
  }, 700);
}

function setupPromiseReveal() {
  const button = document.getElementById("promiseBtn");
  const reveal = document.getElementById("promiseReveal");
  const lamp = document.querySelector(".promise-lamp");
  const field = document.getElementById("promiseField");
  const heartField = document.getElementById("promiseHeartField");
  if (!button || !reveal) return;
  if (lamp) {
    gsap.to(lamp, { scale: 1.05, duration: 1.6, yoyo: true, repeat: -1, ease: "sine.inOut" });
  }
  if (heartField) {
    const positions = [8, 20, 32, 44, 58, 72, 86];
    positions.forEach((pos, index) => {
      const heart = document.createElement("div");
      heart.className = "promise-heart hanging";
      heart.textContent = "❤️";
      heart.style.left = `${pos}%`;
      heart.style.setProperty("--thread", `${gsap.utils.random(90, 150)}px`);
      heartField.appendChild(heart);
      gsap.to(heart, {
        rotation: index % 2 === 0 ? 6 : -6,
        duration: gsap.utils.random(2.6, 4),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      heart.addEventListener("click", (event) => {
        event.stopPropagation();
        const rect = heart.getBoundingClientRect();
        for (let j = 0; j < 24; j += 1) {
          spawnEmoji(field, "💖", rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
        for (let j = 0; j < 16; j += 1) {
          spawnEmoji(field, "✨", rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
      });
    });
    setInterval(() => {
      spawnEmoji(field, "💞", gsap.utils.random(0, window.innerWidth), window.innerHeight + 10);
    }, 700);
  }
  button.addEventListener("click", () => {
    reveal.classList.add("show");
    const envelope = document.getElementById("promiseEnvelope");
    envelope?.classList.add("open");
    if (envelope) {
      const flap = envelope.querySelector(".envelope-flap");
      const letter = envelope.querySelector(".envelope-letter");
      if (flap) {
        gsap.fromTo(
          flap,
          { rotationX: 0 },
          { rotationX: 160, duration: 0.9, ease: "power2.out" }
        );
      }
      if (letter) {
        const tl = gsap.timeline();
        tl.fromTo(
          letter,
          { y: 60, opacity: 0, rotation: -8 },
          { y: -70, opacity: 1, rotation: 8, duration: 0.7, ease: "power2.out" }
        )
          .to(letter, { y: -30, rotation: -4, duration: 0.5, ease: "sine.inOut" })
          .to(letter, { y: -20, rotation: 0, duration: 0.4, ease: "sine.out" })
          .eventCallback("onComplete", () => {
            gsap.to(letter, {
              y: "-=6",
              rotation: 1.5,
              duration: 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          });
      }
      gsap.fromTo(
        envelope,
        { scale: 0.98 },
        { scale: 1, duration: 0.4, ease: "power1.out" }
      );
    }
    if (lamp) {
      const ring = document.createElement("div");
      ring.className = "promise-ring";
      lamp.appendChild(ring);
      gsap.fromTo(
        ring,
        { scale: 0.5, opacity: 0.7 },
        { scale: 1.4, opacity: 0, duration: 0.8, ease: "power2.out", onComplete: () => ring.remove() }
      );
    }
    if (field) {
      const rect = button.getBoundingClientRect();
      for (let i = 0; i < 26; i += 1) {
        spawnEmoji(field, "✨", rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
      for (let i = 0; i < 18; i += 1) {
        spawnEmoji(field, "💛", gsap.utils.random(0, window.innerWidth), window.innerHeight + 10);
      }
      for (let i = 0; i < 14; i += 1) {
        spawnEmoji(field, "💖", gsap.utils.random(0, window.innerWidth), window.innerHeight + 10);
      }
      if (envelope) {
        const eRect = envelope.getBoundingClientRect();
        for (let i = 0; i < 20; i += 1) {
          spawnEmoji(field, "💞", eRect.left + eRect.width / 2, eRect.top + 40);
        }
      }
    }
    gsap.fromTo(
      reveal,
      { opacity: 0, y: 20, scaleY: 0.7 },
      { opacity: 1, y: 0, scaleY: 1, duration: 0.9, ease: "power2.out" }
    );
  });
}

function setupKids() {
  const buttons = document.querySelectorAll(".kid-button");
  const field = document.getElementById("kidField");
  if (!buttons.length || !field) return;
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const rect = btn.getBoundingClientRect();
      for (let i = 0; i < 18; i += 1) {
        spawnEmoji(field, "💋", rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
      for (let i = 0; i < 12; i += 1) {
        spawnEmoji(field, "💖", gsap.utils.random(0, window.innerWidth), window.innerHeight + 10);
      }
      for (let i = 0; i < 16; i += 1) {
        spawnFallingEmoji(field, "🌹", gsap.utils.random(0, window.innerWidth), -30);
      }
    });
  });
}

setupDayCards();
setupPlayer();
setupRose();
setupClouds();
revealHero();
setupProposalFlow();
setupLoveLetter();
setupChocolateBox();
setupTeddy();
setupHugKiss();
setupValentine();
setupAmbientHearts();
setupCoupleHeart();
setupPromiseReveal();
setupKids();
