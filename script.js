
/* ==========================================================
   HET SONI - ANIMATED PORTFOLIO
   COMPLETE SCRIPT.JS - 7 SLIDES

   01 HOME
   02 ABOUT
   03 PROJECTS
   04 JOURNEY
   05 ORBIT
   06 AWARDS - 3D CYLINDER
   07 CONTACT - FINAL RED SLIDE

   GSAP + SCROLLTRIGGER REQUIRED
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ======================================================
     01. HELPERS
  ====================================================== */

  const gs = window.gsap;
  const ST = window.ScrollTrigger;

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const clamp = (n) => Math.max(0, Math.min(1, n));

  function smooth(a, b, value) {
    const t = clamp((value - a) / (b - a));
    return t * t * (3 - 2 * t);
  }

  const pad = (n) => String(n).padStart(2, "0");
  const TWO_PI = Math.PI * 2;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ======================================================
     02. SETTINGS
  ====================================================== */

  // Scroll distance of first 5 slides.
  const FIRST_FIVE_DISTANCE = 20;

  // Previous 6-slide total distance.
  const SIX_SLIDE_DISTANCE = 26;

  // Extra scroll space for final contact slide.
  const CONTACT_DISTANCE = 4;

  const TOTAL_DISTANCE =
    SIX_SLIDE_DISTANCE + CONTACT_DISTANCE;

  // Slide 6 began here in the old animation timeline.
  const AWARDS_START = 0.94;

  // Rotation speeds (radians per second).
  const ORBIT_SPEED = 0.22;
  const CYLINDER_SPEED = 0.28;

  // Keyboard hold scrolling.
  const KEYBOARD_SPEED = 1.25;

  let controller = null;
  let loaded = false;
  let currentFace = "";

  let orbitElapsed = 0;
  let orbitScroll = 0;
  let cylinderRotation = 0;

  let lastProgress = 0;
  let lastContactProgress = 0;

  const pressedKeys = new Set();

  /* ======================================================
     03. MAIN SECTIONS
  ====================================================== */

  const stage = $("#slidesStage");

  const home = $("#home");
  const about = $("#about");
  const work = $("#work");
  const journey = $("#journey");
  const orbit = $("#orbit");
  const awards = $("#awards");
  const contact = $("#contact");

  const header = $("#header");
  const nav = $("#nav");
  const menu = $("#menuToggle");

  /* ======================================================
     04. LOADER
  ====================================================== */

  const loader = $("#loader");
  const upper = $("#loaderUpper");
  const lower = $("#loaderLower");
  const loaderText = $("#loaderContent");
  const splitLine = $("#splitLine");
  const counter = $("#counter");

  /* ======================================================
     05. HOME
  ====================================================== */

  const front = $("#faceFront");
  const left = $("#faceLeft");

  const heroName = $(".hero-background-name");
  const heroContent = $(".hero-content");
  const heroPerson = $("#heroPerson");
  const heroFooter = $(".hero-footer");

  /* ======================================================
     06. ABOUT
  ====================================================== */

  const aboutLabel = $(".about-label");
  const aboutPerson = $("#aboutPerson");
  const aboutCaption = $(".about-image-caption");
  const aboutSmall = $(".about-small");
  const aboutWords = $$(".about-word");
  const aboutParagraph = $(".about-paragraph");
  const aboutFacts = $$(".about-fact");
  const aboutBottom = $(".about-bottom");

  const aboutParts = [
    aboutLabel,
    aboutPerson,
    aboutCaption,
    aboutSmall,
    ...aboutWords,
    aboutParagraph,
    ...aboutFacts,
    aboutBottom
  ].filter(Boolean);

  /* ======================================================
     07. PROJECTS
  ====================================================== */

  const projectTop = $(".projects-top");
  const projectIntro = $(".projects-intro");
  const projectVisual = $(".projects-visual");
  const projectPerson = $("#projectsPerson");
  const projectBottom = $(".projects-bottom");
  const projectNumber = $("#projectsBigNumber");
  const projectStack = $("#projectStack");
  const projectProgress = $(".projects-progress");

  const panels = $$(".project-panel");

  const projectCounter = $("#projectCounter");
  const progressCurrent = $("#progressCurrent");
  const progressFill = $("#projectProgressFill");

  const projectParts = [
    projectTop,
    projectIntro,
    projectVisual,
    projectBottom,
    projectNumber,
    projectStack,
    projectProgress
  ].filter(Boolean);

  /* ======================================================
     08. JOURNEY
  ====================================================== */

  const journeyTop = $(".journey-top");
  const journeyVisual = $(".journey-visual");
  const journeyContent = $(".journey-content");
  const journeyBottom = $(".journey-bottom");
  const journeyYear = $("#journeyBackgroundYear");
  const journeyCounter = $("#journeyCounter");
  const journeyItems = $$(".journey-item");

  const journeyParts = [
    journeyTop,
    journeyVisual,
    journeyContent,
    journeyBottom,
    journeyYear
  ].filter(Boolean);

  /* ======================================================
     09. ORBIT
  ====================================================== */

  const orbitTop = $(".orbit-top");
  const orbitContent = $(".orbit-content");
  const orbitUniverse = $("#orbitUniverse");
  const orbitBottom = $(".orbit-bottom");
  const orbitMarquee = $(".orbit-marquee");
  const orbitPerson = $("#orbitPerson");
  const orbitSkills = $$(".orbit-floating");

  const orbitParts = [
    orbitTop,
    orbitContent,
    orbitUniverse,
    orbitBottom,
    orbitMarquee
  ].filter(Boolean);

  /* ======================================================
     10. AWARDS
  ====================================================== */

  const awardsTop = $(".awards-top");
  const awardsContent = $(".awards-content");
  const awardsVisual = $(".awards-visual");
  const awardsBottom = $(".awards-bottom");
  const awardsPerson = $("#awardsPerson");

  const awardsCarousel = $("#awardsCarousel");
  const awardsCards = $$(".awards-card");
  const awardsStats = $$(".awards-stat strong");
  const awardsCounter = $("#awardCardCounter");

  const awardsParts = [
    awardsTop,
    awardsContent,
    awardsVisual,
    awardsBottom
  ].filter(Boolean);

  /* ======================================================
     11. FINAL CONTACT SLIDE
  ====================================================== */

  const contactTop = $(".contact-top");
  const contactTitle = $(".contact-big-title");
  const contactCharacter = $(".contact-character");

  const contactSide = $("#contactPersonSide");
  const contactFront = $("#contactPersonFront");

  const contactLeft = $(".contact-left");
  const contactRight = $(".contact-right");
  const contactFooter = $(".contact-footer");

  const contactParts = [
    contactTop,
    contactTitle,
    contactCharacter,
    contactLeft,
    contactRight,
    contactFooter
  ].filter(Boolean);

  /* ======================================================
     12. TRANSITION SVG ELEMENTS
  ====================================================== */

  const svg12 = $("#sceneDiagonal");
  const path12 = $("#sceneDiagonalPath");

  const svg23 = $("#projectsTransitionSvg");
  const path23 = $("#projectsTransitionPath");

  const svg34 = $("#journeyTransitionSvg");
  const path34 = $("#journeyTransitionPath");

  const svg45 = $("#orbitTransitionSvg");
  const path45 = $("#orbitTransitionPath");

  const svg56 = $("#awardsTransitionSvg");
  const path56 = $("#awardsTransitionPath");

  const svg67 = $("#contactTransitionSvg");
  const path67 = $("#contactTransitionPath");

  const transitions = [
    [svg12, path12],
    [svg23, path23],
    [svg34, path34],
    [svg45, path45],
    [svg56, path56],
    [svg67, path67]
  ];

  /* ======================================================
     13. MOBILE MENU
  ====================================================== */

  function closeMenu() {
    if (!nav || !menu) return;

    nav.classList.remove("open");

    menu.textContent = "☰";

    menu.setAttribute(
      "aria-expanded",
      "false"
    );
  }

  if (nav && menu) {
    menu.addEventListener("click", () => {
      const open = nav.classList.toggle("open");

      menu.textContent = open ? "×" : "☰";

      menu.setAttribute(
        "aria-expanded",
        String(open)
      );
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  /* ======================================================
     14. ACTIVE NAVIGATION
  ====================================================== */

  function activeNav(section) {
    if (!nav) return;

    nav.querySelectorAll("a").forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === section
      );
    });
  }

  /* ======================================================
     15. CHARACTER FACE CHANGE
  ====================================================== */

  function changeFace(showLeft) {
    if (!front || !left) return;

    const next = showLeft ? "left" : "front";

    if (currentFace === next) return;

    currentFace = next;

    front.style.opacity = showLeft ? "0" : "1";
    front.style.visibility =
      showLeft ? "hidden" : "visible";

    left.style.opacity = showLeft ? "1" : "0";
    left.style.visibility =
      showLeft ? "visible" : "hidden";
  }

  changeFace(false);

  /* ======================================================
     16. RED DIAGONAL WIPE
  ====================================================== */

  function wipe(section, svg, path, progress) {
    if (!stage || !section) return;

    const t = clamp(progress);

    const w = stage.clientWidth;
    const h = stage.clientHeight;

    const tilt = w * 0.20;

    const topX =
      -tilt - 10 +
      t * (w + tilt * 2 + 30);

    const bottomX = topX - tilt;

    if (t <= 0) {
      section.style.clipPath =
        "inset(0 100% 0 0)";

    } else if (t >= 1) {
      section.style.clipPath = "none";

    } else {
      section.style.clipPath = `polygon(
        0px 0px,
        ${topX}px 0px,
        ${bottomX}px ${h}px,
        0px ${h}px
      )`;
    }

    if (!svg || !path) return;

    svg.setAttribute(
      "viewBox",
      `0 0 ${w} ${h}`
    );

    path.setAttribute(
      "d",
      t > 0 && t < 1
        ? `M ${topX} 0 L ${bottomX} ${h}`
        : ""
    );
  }

  /* ======================================================
     17. GENERIC REVEAL
  ====================================================== */

  function reveal(
    element,
    p,
    start,
    end,
    x = 0,
    y = 0
  ) {
    if (!gs || !element) return;

    const t = smooth(start, end, p);

    gs.set(element, {
      x: x * (1 - t),
      y: y * (1 - t),
      autoAlpha: t
    });
  }

  /* ======================================================
     18. PROJECT ANIMATION
  ====================================================== */

  function updateProjects(p) {
    if (!gs || panels.length !== 3) return;

    const first = smooth(0.52, 0.58, p);
    const second = smooth(0.62, 0.68, p);

    gs.set(panels[0], {
      yPercent: -105 * first
    });

    gs.set(panels[1], {
      yPercent: -105 * second
    });

    gs.set(panels[2], {
      yPercent: 0
    });

    const active =
      p >= 0.65 ? 2 :
      p >= 0.55 ? 1 : 0;

    const label = pad(active + 1);

    if (projectCounter) {
      projectCounter.textContent = label + " / 03";
    }

    if (progressCurrent) {
      progressCurrent.textContent = label;
    }

    if (projectNumber) {
      projectNumber.textContent = label;
    }

    if (progressFill) {
      gs.set(progressFill, {
        width: `${((1 + first + second) / 3) * 100}%`
      });
    }

    if (projectPerson) {
      const motion = smooth(0.48, 0.72, p);

      gs.set(projectPerson, {
        y: -15 * motion,
        rotation: -1.5 * motion
      });
    }

    panels.forEach((panel, index) => {
      const selected = index === active;

      panel.style.pointerEvents =
        selected ? "auto" : "none";

      panel.inert = !selected;

      panel.setAttribute(
        "aria-hidden",
        String(!selected)
      );
    });
  }

  /* ======================================================
     19. JOURNEY ANIMATION
  ====================================================== */

  function updateJourney(p) {
    if (!gs || !journeyItems.length) return;

    const progress = clamp(
      (p - 0.79) / 0.065
    );

    const count = journeyItems.length;

    const active = Math.min(
      count - 1,
      Math.floor(progress * count)
    );

    journeyItems.forEach((item, index) => {
      const enter = smooth(
        index / count - 0.05,
        index / count + 0.08,
        progress
      );

      item.classList.toggle(
        "active",
        index === active
      );

      gs.set(item, {
        y: 22 * (1 - enter),

        opacity:
          index === active ? 1 :
          index < active ? 0.68 : 0.32,

        visibility: "visible"
      });
    });

    if (journeyYear) {
      journeyYear.textContent =
        journeyItems[active]?.dataset.year ||
        String(2024 + active);
    }

    if (journeyCounter) {
      journeyCounter.textContent =
        pad(active + 1) +
        " / " +
        pad(count);
    }
  }

  /* ======================================================
     20. SKILL ORBIT - SLIDE 5
  ====================================================== */

  function renderOrbit() {
    if (!gs || !orbitUniverse || !orbitSkills.length) {
      return;
    }

    const w = orbitUniverse.clientWidth;
    const h = orbitUniverse.clientHeight;

    if (!w || !h) return;

    const mobile = window.innerWidth <= 700;

    const centerX = w * 0.50;
    const centerY = h * 0.49;

    const outerX = w * (mobile ? 0.40 : 0.43);
    const outerY = h * (mobile ? 0.37 : 0.39);

    const innerX = w * (mobile ? 0.30 : 0.32);
    const innerY = h * (mobile ? 0.28 : 0.29);

    const rotation =
      orbitScroll * Math.PI * 1.4 +
      orbitElapsed * ORBIT_SPEED;

    orbitSkills.forEach((skill, index) => {
      const angle =
        index / orbitSkills.length * TWO_PI +
        rotation -
        Math.PI / 2;

      const outer = index % 2 === 0;

      const rx = outer ? outerX : innerX;
      const ry = outer ? outerY : innerY;

      const x = centerX + Math.cos(angle) * rx;
      const y = centerY + Math.sin(angle) * ry;

      const depth = (Math.sin(angle) + 1) / 2;

      gs.set(skill, {
        x: x - skill.offsetWidth / 2,
        y: y - skill.offsetHeight / 2,
        rotation: 0,
        scale: 0.82 + depth * 0.20,
        opacity: 0.65 + depth * 0.35,
        visibility: "visible",
        zIndex: depth > 0.5 ? 10 : 2
      });
    });

    if (orbitPerson) {
      gs.set(orbitPerson, {
        y: -8 * orbitScroll,
        rotation: -orbitScroll,
        scale: 1 + 0.025 * orbitScroll
      });
    }
  }

  function updateOrbit(p) {
    orbitScroll = smooth(0.885, 0.94, p);
    renderOrbit();
  }

  /* ======================================================
     21. AWARDS 3D CYLINDER - SLIDE 6
  ====================================================== */

  function updateAwards(p) {
    if (!gs || !awards) return;

    const visible = smooth(0.94, 0.98, p);

    awardsStats.forEach((element) => {
      const target = Number(element.dataset.count) || 0;

      element.textContent = Math.round(
        target * visible
      );
    });

    const total = awardsCards.length;

    if (!total || !awardsCarousel) return;

    const mobile = window.innerWidth <= 700;
    const width = awardsCarousel.clientWidth;

    if (!width) return;

    const radius = width * (
      mobile ? 0.35 : 0.44
    );

    let activeIndex = 0;
    let closest = -Infinity;

    awardsCards.forEach((card, index) => {
      const angle =
        index / total * TWO_PI -
        cylinderRotation;

      const face = Math.cos(angle);

      const x = Math.sin(angle) * radius;
      const z = (face - 1) * radius;

      const depth = (face + 1) / 2;

      // Keep rotation angle bounded.
      const normalizedAngle = Math.atan2(
        Math.sin(angle),
        Math.cos(angle)
      );

      const rotationY =
        normalizedAngle * 180 / Math.PI;

      const scale = 0.82 + 0.18 * depth;

      const opacity =
        face < -0.2
          ? 0
          : Math.min(1, 0.30 + depth * 0.70);

      if (face > closest) {
        closest = face;
        activeIndex = index;
      }

      gs.set(card, {
        xPercent: -50,
        yPercent: -50,
        x,
        y: 0,
        z,
        rotationY,
        scale,
        opacity,
        visibility: opacity > 0.01
          ? "visible"
          : "hidden",
        zIndex: Math.round(depth * 100)
      });
    });

    awardsCards.forEach((card, index) => {
      const selected = index === activeIndex;

      card.style.pointerEvents =
        selected ? "auto" : "none";

      card.inert = !selected;
    });

    if (awardsCounter) {
      awardsCounter.textContent =
        pad(activeIndex + 1) +
        " / " +
        pad(total);
    }

    if (awardsPerson) {
      gs.set(awardsPerson, {
        y: -8 * visible,
        rotation: 1.2 * visible
      });
    }
  }

  /* ======================================================
     22. ORIGINAL SIX-SLIDE SCROLL MAPPING

     First 5 slides have 20 viewport heights.
     Awards receives 6 additional viewport heights.
  ====================================================== */

  const RAW_AWARDS_START =
    FIRST_FIVE_DISTANCE *
    AWARDS_START /
    SIX_SLIDE_DISTANCE;

  function mapSixProgress(raw) {
    const p = clamp(raw);

    if (p <= RAW_AWARDS_START) {
      return clamp(
        p * SIX_SLIDE_DISTANCE /
        FIRST_FIVE_DISTANCE
      );
    }

    return clamp(
      AWARDS_START +
      (
        (p - RAW_AWARDS_START) /
        (1 - RAW_AWARDS_START)
      ) * (1 - AWARDS_START)
    );
  }

  function inverseSixProgress(progress) {
    const p = clamp(progress);

    if (p <= AWARDS_START) {
      return clamp(
        p * FIRST_FIVE_DISTANCE /
        SIX_SLIDE_DISTANCE
      );
    }

    return clamp(
      RAW_AWARDS_START +
      (
        (p - AWARDS_START) /
        (1 - AWARDS_START)
      ) * (1 - RAW_AWARDS_START)
    );
  }

  /* ======================================================
     23. SEVEN-SLIDE SCROLL MAPPING

     Slide 7 begins after old six-slide timeline ends.
     Previous animations keep their existing timings.
  ====================================================== */

  const CONTACT_RAW_START =
    SIX_SLIDE_DISTANCE / TOTAL_DISTANCE;

  function mapSevenProgress(rawProgress) {
    const raw = clamp(rawProgress);

    const sixRaw = clamp(
      raw * TOTAL_DISTANCE /
      SIX_SLIDE_DISTANCE
    );

    const sixProgress = mapSixProgress(sixRaw);

    const contactProgress = clamp(
      (raw - CONTACT_RAW_START) /
      (1 - CONTACT_RAW_START)
    );

    return {
      sixProgress,
      contactProgress
    };
  }

  /* ======================================================
     24. MAIN FIRST SIX SLIDES
  ====================================================== */

  function updateSixScenes(p) {
    if (!gs) return;

    p = clamp(p);

    changeFace(p >= 0.065 && p < 0.22);

    /* HOME EXIT */

    const homeExit = smooth(0.13, 0.22, p);

    if (heroContent) {
      gs.set(heroContent, {
        y: -80 * homeExit,
        opacity: 1 - homeExit
      });
    }

    if (heroName) {
      gs.set(heroName, {
        y: -90 * homeExit,
        opacity: 1 - homeExit
      });
    }

    if (heroPerson) {
      gs.set(heroPerson, {
        opacity: 1 - homeExit
      });
    }

    if (heroFooter) {
      gs.set(heroFooter, {
        y: -30 * homeExit,
        opacity: 1 - homeExit
      });
    }

    /* HOME -> ABOUT */

    wipe(
      about, svg12, path12,
      smooth(0.17, 0.29, p)
    );

    /* ABOUT */

    reveal(aboutLabel, p, 0.20, 0.29, 0, 25);
    reveal(aboutPerson, p, 0.21, 0.30, 0, 75);
    reveal(aboutCaption, p, 0.23, 0.31, 0, 25);
    reveal(aboutSmall, p, 0.22, 0.29, 100, 0);

    aboutWords.forEach((word, index) => {
      const start = 0.24 + index * 0.012;

      reveal(
        word, p,
        start, start + 0.055,
        130, 0
      );
    });

    reveal(
      aboutParagraph, p,
      0.28, 0.34,
      100, 0
    );

    aboutFacts.forEach((fact, index) => {
      const start = 0.31 + index * 0.012;

      reveal(
        fact, p,
        start, start + 0.05,
        70, 0
      );
    });

    reveal(aboutBottom, p, 0.34, 0.39, 0, 25);

    /* ABOUT -> PROJECTS */

    wipe(
      work, svg23, path23,
      smooth(0.38, 0.49, p)
    );

    /* PROJECTS */

    reveal(projectNumber, p, 0.40, 0.49, 50, 0);
    reveal(projectVisual, p, 0.41, 0.50, 70, 60);
    reveal(projectTop, p, 0.42, 0.49, 0, 25);
    reveal(projectIntro, p, 0.43, 0.51, -100, 0);
    reveal(projectBottom, p, 0.44, 0.52, 0, 25);
    reveal(projectStack, p, 0.44, 0.52, -80, 0);
    reveal(projectProgress, p, 0.44, 0.52, 0, 20);

    updateProjects(p);

    /* PROJECTS -> JOURNEY */

    wipe(
      journey, svg34, path34,
      smooth(0.71, 0.79, p)
    );

    /* JOURNEY */

    reveal(journeyTop, p, 0.72, 0.79, 0, 25);
    reveal(journeyVisual, p, 0.73, 0.80, -65, 55);

    if (journeyContent) {
      gs.set(journeyContent, {
        autoAlpha: smooth(0.73, 0.80, p)
      });
    }

    reveal(journeyBottom, p, 0.74, 0.81, 0, 25);
    reveal(journeyYear, p, 0.73, 0.80, -45, 0);

    updateJourney(p);

    /* JOURNEY -> ORBIT */

    wipe(
      orbit, svg45, path45,
      smooth(0.855, 0.915, p)
    );

    /* ORBIT */

    reveal(orbitTop, p, 0.865, 0.920, 0, 25);

    if (orbitContent) {
      gs.set(orbitContent, {
        autoAlpha: smooth(0.865, 0.925, p)
      });
    }

    if (orbitUniverse) {
      gs.set(orbitUniverse, {
        autoAlpha: smooth(0.865, 0.925, p)
      });
    }

    reveal(orbitMarquee, p, 0.885, 0.935, 0, 45);
    reveal(orbitBottom, p, 0.885, 0.935, 0, 25);

    updateOrbit(p);

    /* ORBIT -> AWARDS */

    wipe(
      awards, svg56, path56,
      smooth(0.940, 0.975, p)
    );

    /* AWARDS */

    reveal(awardsTop, p, 0.945, 0.975, 0, 25);

    if (awardsContent) {
      gs.set(awardsContent, {
        autoAlpha: smooth(0.945, 0.980, p)
      });
    }

    reveal(
      awardsVisual, p,
      0.948, 0.980,
      70, 50
    );

    reveal(
      awardsBottom, p,
      0.950, 0.982,
      0, 25
    );

    updateAwards(p);
  }

  /* ======================================================
     25. FINAL CONTACT ANIMATION
  ====================================================== */

  function updateContact(progress) {
    if (!gs || !contact) return;

    const p = clamp(progress);

    /* RED CONTACT TRANSITION */

    wipe(
      contact,
      svg67,
      path67,
      smooth(0.05, 0.65, p)
    );

    /* CONTACT LABEL */

    reveal(
      contactTop,
      p,
      0.12,
      0.57,
      0,
      30
    );

    /* BIG LET'S */

    if (contactTitle) {
      gs.set(contactTitle, {
        autoAlpha: smooth(0.15, 0.62, p)
      });
    }

    /* CHARACTER */

    if (contactCharacter) {
      gs.set(contactCharacter, {
        autoAlpha: smooth(0.18, 0.65, p)
      });
    }

    /* LEFT CONTACT TEXT */

    reveal(
      contactLeft,
      p,
      0.43,
      0.77,
      -100,
      0
    );

    /* RIGHT SOCIAL LINKS */

    reveal(
      contactRight,
      p,
      0.48,
      0.82,
      100,
      0
    );

    /* FOOTER */

    reveal(
      contactFooter,
      p,
      0.64,
      0.90,
      0,
      25
    );

    /* CHARACTER MOTION */

    const characterMove = smooth(
      0.20,
      0.78,
      p
    );

    if (contactCharacter) {
      gs.set(contactCharacter, {
        y: 45 * (1 - characterMove)
      });
    }

    /* SIDE -> FRONT CROSSFADE */

    if (contactSide) {
  gs.set(contactSide, {
    autoAlpha: 1
  });
}

    /* HEADER THEME */

    document.body.classList.toggle(
      "on-contact",
      p >= 0.55
    );
  }

  /* ======================================================
     26. MASTER SCENE CONTROLLER
  ====================================================== */

  function updateScene(rawProgress) {
    const {
      sixProgress,
      contactProgress
    } = mapSevenProgress(rawProgress);

    lastProgress = sixProgress;
    lastContactProgress = contactProgress;

    updateSixScenes(sixProgress);
    updateContact(contactProgress);

    if (header) {
      gs.set(header, {
        y: 0,
        autoAlpha: 1
      });
    }

    if (contactProgress >= 0.55) {
      activeNav("#contact");

    } else if (sixProgress < 0.24) {
      activeNav("#home");

    } else if (sixProgress < 0.43) {
      activeNav("#about");

    } else if (sixProgress < 0.75) {
      activeNav("#work");

    } else if (sixProgress < 0.885) {
      activeNav("#journey");

    } else if (sixProgress < 0.960) {
      activeNav("#orbit");

    } else {
      activeNav("#awards");
    }
  }

  /* ======================================================
     27. STATIC FALLBACK
  ====================================================== */

  function staticFallback() {
    loader?.remove();

    document.body.classList.remove("loading");

    const sections = [
      home,
      about,
      work,
      journey,
      orbit,
      awards,
      contact
    ].filter(Boolean);

    if (stage) {
      Object.assign(stage.style, {
        height: "auto",
        minHeight: "0",
        overflow: "visible",
        isolation: "auto"
      });
    }

    sections.forEach((section) => {
      Object.assign(section.style, {
        position: "relative",
        inset: "auto",
        width: "100%",
        height: "100svh",
        minHeight: "0",
        clipPath: "none"
      });
    });

    transitions.forEach(([svg]) => {
      if (svg) {
        svg.style.display = "none";
      }
    });

    [
      ...aboutParts,
      ...projectParts,
      ...journeyParts,
      ...journeyItems,
      ...orbitParts,
      ...orbitSkills,
      ...awardsParts,
      ...contactParts
    ].forEach((element) => {
      element.style.opacity = "1";
      element.style.visibility = "visible";

      if (
        ![
          journeyContent,
          orbitContent,
          orbitUniverse,
          awardsContent,
          contactTitle,
          contactCharacter
        ].includes(element)
      ) {
        element.style.transform = "none";
      }
    });

    panels.forEach((panel, index) => {
      panel.style.transform = "none";
      panel.style.display = index === 0
        ? "block"
        : "none";
    });

    // Show first carousel card if animations disabled.
    awardsCards.forEach((card, index) => {
      Object.assign(card.style, {
        transform: "translate(-50%, -50%)",
        opacity: index === 0 ? "1" : "0",
        visibility: index === 0
          ? "visible"
          : "hidden",
        zIndex: String(100 - index)
      });

      card.inert = index !== 0;
    });

    awardsStats.forEach((element) => {
      element.textContent =
        element.dataset.count || "0";
    });

    if (contactSide) {
      contactSide.style.opacity = "1";
      contactSide.style.visibility = "visible";
    }

    if (contactFront) {
      contactFront.style.opacity = "0";
      contactFront.style.visibility = "hidden";
    }

    if (header) {
      Object.assign(header.style, {
        opacity: "1",
        visibility: "visible",
        transform: "none"
      });
    }

    function fallbackNavigation() {
      let selected = "#home";

      sections.forEach((section) => {
        if (
          section.getBoundingClientRect().top <
          window.innerHeight * 0.4
        ) {
          selected = "#" + section.id;
        }
      });

      activeNav(selected);

      document.body.classList.toggle(
        "on-contact",
        selected === "#contact"
      );
    }

    window.addEventListener(
      "scroll",
      fallbackNavigation,
      { passive: true }
    );

    fallbackNavigation();
  }

  /* ======================================================
     28. VALIDATION
  ====================================================== */

  if (
    !gs ||
    !ST ||
    !stage ||
    !home ||
    !about ||
    !work ||
    !journey ||
    !orbit ||
    !awards ||
    !contact ||
    reducedMotion
  ) {
    console.warn(
      "Portfolio animations unavailable. Static layout enabled."
    );

    staticFallback();
    return;
  }

  gs.registerPlugin(ST);

  /* ======================================================
     29. INITIAL STATES
  ====================================================== */

  [
    about,
    work,
    journey,
    orbit,
    awards,
    contact
  ].forEach((section) => {
    gs.set(section, {
      clipPath: "inset(0 100% 0 0)"
    });
  });

  gs.set(
    [
      ...aboutParts,
      ...projectParts,
      ...journeyParts,
      ...orbitParts,
      ...awardsParts,
      ...contactParts
    ],
    {
      autoAlpha: 0
    }
  );

  panels.forEach((panel) => {
    gs.set(panel, {
      yPercent: 0
    });
  });

  journeyItems.forEach((item) => {
    gs.set(item, {
      y: 22,
      opacity: 0.32,
      visibility: "visible"
    });
  });

  transitions.forEach(([, path]) => {
    if (path) path.setAttribute("d", "");
  });

  cylinderRotation = 0;
  updateAwards(0);

  // Set initial face for last slide.
  if (contactSide) {
    gs.set(contactSide, {
      autoAlpha: 1
    });
  }

  if (contactFront) {
    gs.set(contactFront, {
      autoAlpha: 0
    });
  }

  /* ======================================================
     30. SINGLE PINNED SCROLLTRIGGER
  ====================================================== */

  function setupScroll() {
    if (controller) {
      controller.kill();
      controller = null;
    }

    controller = ST.create({
      trigger: stage,
      start: "top top",

      end: () =>
        "+=" + Math.round(
          window.innerHeight * TOTAL_DISTANCE
        ),

      pin: true,
      pinSpacing: true,
      scrub: 0.65,
      anticipatePin: 1,
      invalidateOnRefresh: true,

      onUpdate(self) {
        updateScene(self.progress);
      },

      onRefresh(self) {
        updateScene(self.progress);
      }
    });

    updateScene(controller.progress);
  }

  /* ======================================================
     31. HEADER NAVIGATION
  ====================================================== */

  const sixTargets = {
    "#home": 0,
    "#about": 0.32,
    "#work": 0.50,
    "#journey": 0.81,
    "#orbit": 0.925,
    "#awards": 0.982
  };

  function sixProgressToRaw(progress) {
    const sixRaw = inverseSixProgress(progress);

    return (
      sixRaw * SIX_SLIDE_DISTANCE /
      TOTAL_DISTANCE
    );
  }

  const targets = {
    "#home": sixProgressToRaw(sixTargets["#home"]),
    "#about": sixProgressToRaw(sixTargets["#about"]),
    "#work": sixProgressToRaw(sixTargets["#work"]),
    "#journey": sixProgressToRaw(sixTargets["#journey"]),
    "#orbit": sixProgressToRaw(sixTargets["#orbit"]),
    "#awards": sixProgressToRaw(sixTargets["#awards"]),

    // Show final contact after its transition.
    "#contact": CONTACT_RAW_START +
      0.90 * (1 - CONTACT_RAW_START)
  };

  function goTo(hash, behavior = "smooth") {
    if (!controller || !(hash in targets)) return;

    const position =
      controller.start +
      (
        controller.end -
        controller.start
      ) * targets[hash];

    window.scrollTo({
      top: position,
      behavior
    });
  }

  Object.keys(targets).forEach((hash) => {
    $$(`a[href="${hash}"]`).forEach((link) => {
      link.addEventListener("click", (event) => {
        if (!controller) return;

        event.preventDefault();
        closeMenu();

        goTo(hash);
      });
    });
  });

  /* ======================================================
     32. CONTINUOUS ORBIT AND CYLINDER ANIMATION
  ====================================================== */

  gs.ticker.add((time, deltaTime) => {
    if (!loaded || !controller) return;
    if (document.hidden) return;

    const seconds = Math.min(
      deltaTime / 1000,
      0.05
    );

    // Slide 5
    if (
      lastProgress >= 0.87 &&
      lastProgress < 0.975
    ) {
      orbitElapsed += seconds;
      renderOrbit();
    }

    // Slide 6 - rotate while visible.
    if (
      lastProgress >= 0.975 &&
      lastContactProgress < 0.65
    ) {
      cylinderRotation =
        (
          cylinderRotation +
          seconds * CYLINDER_SPEED
        ) % TWO_PI;

      updateAwards(lastProgress);
    }
  });

  /* ======================================================
     33. KEYBOARD UP / DOWN SCROLL
  ====================================================== */

  function isTyping() {
    const element = document.activeElement;

    if (!element) return false;

    return (
      [
        "INPUT",
        "TEXTAREA",
        "SELECT"
      ].includes(element.tagName) ||
      element.isContentEditable
    );
  }

  window.addEventListener("keydown", (event) => {
    if (
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp"
    ) return;

    if (
      !loaded ||
      !controller ||
      isTyping() ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey
    ) return;

    const y = window.scrollY;

    if (
      y < controller.start - 2 ||
      y > controller.end + 2
    ) return;

    event.preventDefault();

    pressedKeys.add(event.key);
  });

  window.addEventListener("keyup", (event) => {
    pressedKeys.delete(event.key);
  });

  window.addEventListener("blur", () => {
    pressedKeys.clear();
  });

  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) {
        pressedKeys.clear();
      }
    }
  );

  gs.ticker.add((time, deltaTime) => {
    if (!loaded || !controller) return;
    if (!pressedKeys.size) return;

    const down = pressedKeys.has("ArrowDown");
    const up = pressedKeys.has("ArrowUp");

    if (down === up) return;

    const direction = down ? 1 : -1;

    const speed =
      window.innerHeight * KEYBOARD_SPEED;

    const seconds = Math.min(
      deltaTime / 1000,
      0.05
    );

    const next = Math.max(
      controller.start,
      Math.min(
        controller.end,
        window.scrollY +
          direction * speed * seconds
      )
    );

    window.scrollTo({
      top: next,
      behavior: "instant"
    });
  });

  /* ======================================================
     34. FINISH LOADER
  ====================================================== */

  function finishLoader() {
    if (loaded) return;

    loaded = true;

    if (counter) {
      counter.textContent = "100";
    }

    loader?.remove();

    document.body.classList.remove("loading");

    setupScroll();
    ST.refresh();

    if (window.location.hash in targets) {
      goTo(window.location.hash, "auto");
    }
  }

  /* ======================================================
     35. LOADER PREPARATION
  ====================================================== */

  if (header) {
    gs.set(header, {
      y: -25,
      autoAlpha: 0
    });
  }

  if (heroName) {
    gs.set(heroName, {
      y: 65,
      autoAlpha: 0
    });
  }

  if (heroContent) {
    gs.set(heroContent.children, {
      y: 65,
      autoAlpha: 0
    });
  }

  if (heroPerson) {
    gs.set(heroPerson, {
      autoAlpha: 0
    });
  }

  if (heroFooter) {
    gs.set(heroFooter, {
      y: 35,
      autoAlpha: 0
    });
  }

  /* ======================================================
     36. INTRO TIMELINE
  ====================================================== */

  if (!loader) {
    gs.set(
      [
        header,
        heroName,
        heroPerson,
        heroFooter
      ].filter(Boolean),
      {
        y: 0,
        autoAlpha: 1
      }
    );

    if (heroContent) {
      gs.set(heroContent.children, {
        y: 0,
        autoAlpha: 1
      });
    }

    finishLoader();

  } else {
    const value = { count: 0 };

    const intro = gs.timeline({
      defaults: {
        ease: "power3.out"
      },
      onComplete: finishLoader
    });

    // Counter 000 -> 100
    intro.to(value, {
      count: 100,
      duration: 1.15,
      ease: "power2.inOut",

      onUpdate() {
        if (counter) {
          counter.textContent =
            String(
              Math.round(value.count)
            ).padStart(3, "0");
        }
      }
    });

    // Loader split line
    if (splitLine) {
      intro.fromTo(
        splitLine,
        { scaleX: 0, opacity: 1 },
        {
          scaleX: 1,
          duration: 0.5,
          ease: "power3.inOut"
        }
      );
    }

    if (loaderText) {
      intro.to(loaderText, {
        opacity: 0,
        duration: 0.25
      });
    }

    // Red panels opening
    if (upper && lower) {
      intro.to(upper, {
        yPercent: -101,
        duration: 1,
        ease: "power4.inOut"
      });

      intro.to(
        lower,
        {
          yPercent: 101,
          duration: 1,
          ease: "power4.inOut"
        },
        "<"
      );
    }

    if (splitLine) {
      intro.to(
        splitLine,
        {
          opacity: 0,
          duration: 0.15
        },
        "<"
      );
    }

    if (header) {
      intro.to(header, {
        y: 0,
        autoAlpha: 1,
        duration: 0.5
      });
    }

    if (heroName) {
      intro.to(
        heroName,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85
        },
        "-=0.15"
      );
    }

    if (heroPerson) {
      intro.to(
        heroPerson,
        {
          autoAlpha: 1,
          duration: 0.8
        },
        "-=0.6"
      );
    }

    if (heroContent) {
      intro.to(
        heroContent.children,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.85,
          stagger: 0.10
        },
        "-=0.55"
      );
    }

    if (heroFooter) {
      intro.to(
        heroFooter,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6
        },
        "-=0.5"
      );
    }
  }

  /* ======================================================
     37. IMAGE ERROR CHECK
  ====================================================== */

  $$("img").forEach((image) => {
    image.addEventListener("error", () => {
      console.error(
        "Image not loading:",
        image.getAttribute("src")
      );
    });
  });

  /* ======================================================
     38. RESPONSIVE REFRESH
  ====================================================== */

  window.addEventListener("resize", () => {
    if (loaded && controller) {
      ST.refresh();
    }
  });

  window.addEventListener("load", () => {
    if (loaded && controller) {
      ST.refresh();
    }
  });

  console.log(
    "Het Soni Portfolio - All 7 Slides Initialized"
  );
});
