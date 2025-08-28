
gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: ".spotlight",
  start: "top top",
  end: "+=3000",   // ← controls how long the pinned section lasts
  pin: true,
  scrub: 1,
  markers: true
});

pinSpacing: false,


gsap.to(".spotlight-titles",
  { yPercent: -100 ,   // start in place
   // move up by one viewport
    ease:"none",
    scrollTrigger: {
      trigger: ".spotlight",
      start: "top top",
      end: "+=3000",   // scroll distance
      scrub: true,
      pin: true,
    }
  }
);
