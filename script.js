// Typed for .typed-name
document.addEventListener('DOMContentLoaded', () => {
  const typedTarget = document.querySelector(".typed-name");
  if (typedTarget) {
    new Typed(".typed-name", {
      strings: ["Natalie!^3000"],
      typeSpeed: 50,
      loop: true
    });
  }

  // Typed for .typing
  const typedAbout = document.querySelector(".typing-about");
  if (typedAbout) {
    new Typed(".typing-about", {
      strings: ["Creative Thinker", "User First Engineer", "Design-Driven Coder", "Aesthetics-Sensitive Builder"],
      typeSpeed: 50,
      backSpeed: 40,
      backDelay: 1500,
      startDelay: 500,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    });
  }

  // Element-based fade classes
  const hero = document.querySelector('.orbital-hero');
  if (hero) hero.classList.add('fade-up');

  const headImg = document.querySelector('.orbital-head-img');
  if (headImg) headImg.classList.add('fade-left');

  const probContent = document.querySelector('.orb-prob-content');
  if (probContent) probContent.classList.add('fade-right');

  // ScrollTrigger animations
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray(".slide-left").forEach((el) => {
      gsap.fromTo(el,
        { x: 100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 98%",
            toggleActions: "play none none none",
            markers: false
          }
        });
    });

    gsap.utils.toArray(".slide-right").forEach((el) => {
      gsap.fromTo(el,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 98%",
            toggleActions: "play none none none",
            markers: false
          }
        });
    });
  }
});

//MERCH STACK ANIMATION
const merchItems = document.querySelectorAll('.merch'); //select all merch elements
//const vals
const moveOffset = 400;
const delayBetween = 3000;
const delayBetweenLoops = 2000;
const totalItems = merchItems.length;


let animationStarted = false; //start once in view

//animation function
function animateMerch() {
  merchItems.forEach((item, index) => {
    const reverseIndex = totalItems - index - 1; //last merch slides first

    setTimeout(() => { //delays everything by certain amount of time
      item.style.transform = `translateX(${moveOffset}px)`; //slide right by const val
      item.style.zIndex = index + 1; //increase z index
    }, reverseIndex * delayBetween); //stagger start times
  });

  const totalForwardTime = (totalItems - 1) * delayBetween; //time all items to start
  const totalCycleTime = totalForwardTime + delayBetweenLoops; //total cycle

  // Reset all after delay
  setTimeout(() => {
    merchItems.forEach((item, i) => {
      item.style.transform = `translateX(0px)`; //restart all item to index x = 0
      item.style.zIndex = 1; //reset z index
    });
  }, totalCycleTime);

  // Call again after full cycle
  setTimeout(() => {
    animateMerch(); //loop
  }, totalCycleTime + delayBetweenLoops);
}

// Trigger on scroll into view (only once)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !animationStarted) {
      animationStarted = true;
      animateMerch();
    }
  });
}, {
  threshold: 0.5
});

const merchSection = document.querySelector('.urmo-merch');
if (merchSection) {
  observer.observe(merchSection);
}

