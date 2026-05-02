document.addEventListener("DOMContentLoaded", function () {
  const layers = [
    {
      label: "📍. ˚⊹ User Input",
      desc: "<strong>Destination query, User preferences</strong>: cost sensitivity, walking distance, travel mode",
      tag: "User Interaction",
    },
    {
      label: " ๋࣭ ⭑💻  Frontend Interface",
      desc: "Streamlit UI, Search & Filter Inputs, User Interaction Layer",
      tag: "User Experience",
    },
    {
      label: ".ೃ 🌐 ︎ *:･ API ",
      desc: "<strong>Geoapify</strong> → location search <br> <strong>OpenStreetMap</strong> → parking data <br> <strong>OpenWeather</strong> → weather context",
      tag: "Core Data Sources",
    },
    {
      label: "₊˚📈⊹☆ Data Aggregation",
      desc: "Normalize API Responses, Merge heterogeneous data sources, Handle missing/inconsistent values",
      tag: "Data Processing",
    },
    {
      label: "˚⋆🥇｡⋆ Ranking Engine",
      desc: "<strong> Weighted Ranking Model: </strong>cost, distance, travel time, weather impact<br><strong>Configurable Weights</strong>",
      tag: "Core Logic",
    },
    {
      label: " ⋆₊˚ 🗄⊹ ⋆PostgreSQL + PostGIS",
      desc: "<strong> User search history: </strong>session based<br><strong>Spatial queries: </strong> geolocation<br><strong>Preference persistence</strong>",
      tag: "Database",
    },
    {
      label: " ݁⋆⭒🗺️˚.⋆Results",
      desc: "<strong>Ranked parking options</strong><br><strong>Interactive Map: </strong> Pydeck<br><strong>Spatial comparison of results</strong>",
      tag: "Final Product",
    },
  ];

  let cur = 0;

  const stage = document.getElementById("sysdesign-stage");
  const progressEl = document.getElementById("sysdesign-progress");
  const counterEl = document.getElementById("sysdesign-counter");
  const prevBtn = document.getElementById("sysdesign-prev");
  const nextBtn = document.getElementById("sysdesign-next");

  if (!stage) return;

  function getCardStyle(pos) {
    if (pos === 0) return { z: layers.length,     ty: 0,   scale: 1,    opacity: 1    };
    if (pos === 1) return { z: layers.length - 1, ty: -16, scale: 0.96, opacity: 0.65 };
    if (pos === 2) return { z: layers.length - 2, ty: -28, scale: 0.92, opacity: 0.4  };
    return               { z: 0,                  ty: -36, scale: 0.89, opacity: 0    };
  }

  function placeholderSVG() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke-width="1" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M3 9h18M9 21V9"/>
    </svg>`;
  }

  function renderStack() {
    stage.innerHTML = "";

    const visible = layers.slice(cur, cur + 4);

    visible
      .slice()
      .reverse()
      .forEach((layer, ri) => {
        const pos = visible.length - 1 - ri;
        const st = getCardStyle(pos);
        const globalIdx = cur + pos;

        const card = document.createElement("div");
        card.className = "sysdesign-card";
        card.dataset.pos = pos;
        card.style.zIndex = st.z;
        card.style.transform = `translateY(${st.ty}px) scale(${st.scale})`;
        card.style.opacity = st.opacity;
        card.style.pointerEvents = pos === 0 ? "auto" : "none";
        card.innerHTML = `
          <div class="sysdesign-card-inner">
            <span class="sysdesign-card-num">0${globalIdx + 1}</span>
            <div class="sysdesign-card-body">
              <div class="sysdesign-card-label">${layer.label}</div>
              <div class="sysdesign-card-desc">${layer.desc}</div>
              <span class="sysdesign-card-tag">${layer.tag}</span>
            </div>
            ${pos === 0 ? '<span class="sysdesign-card-arrow">&#8594;</span>' : ""}
          </div>
        `;

        if (pos === 0) card.addEventListener("click", () => move(1));
        stage.appendChild(card);
      });

    buildProgress();
    counterEl.textContent = `${cur + 1} / ${layers.length}`;
    prevBtn.disabled = cur === 0;
    nextBtn.disabled = cur === layers.length - 1;
  }

  function buildProgress() {
    progressEl.innerHTML = "";
    layers.forEach((_, i) => {
      const seg = document.createElement("div");
      seg.className = "sysdesign-prog-seg" + (i <= cur ? " done" : "");
      seg.addEventListener("click", () => goTo(i));
      progressEl.appendChild(seg);
    });
  }

  function move(dir) {
    goTo(cur + dir);
  }

  function goTo(idx) {
    if (idx < 0 || idx >= layers.length || idx === cur) return;
    cur = idx;
    renderStack();
  }

  prevBtn.addEventListener("click", () => move(-1));
  nextBtn.addEventListener("click", () => move(1));

  document.addEventListener("keydown", (e) => {
    const rect = stage.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inView) return;
    if (e.key === "ArrowLeft") move(-1);
    if (e.key === "ArrowRight") move(1);
  });

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    gsap.fromTo(
      ".sysdesign-carousel",
      { x: 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".sysdesign-carousel",
          start: "top 98%",
          toggleActions: "play none none none",
        },
      }
    );
  }

  renderStack();
});