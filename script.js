// import {gsap} from "gsap";
// import {ScrollTrigger} from "/gsap.min.js/ScrollTrigger";
// import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);


const config = {
  gap: 0.08,
  speed: 0.3,
  arcRadius: 500,
};

const spotlightItems = [
  {name: "Silent Arc", img: "/img_1.png"},
  {name: "Motion Flare", img: "/img_2.png"},
  {name: "Nebula Fold", img: "/img_3.png"},
  {name: "KodakColor Peaks", img: "/img_4.png"},
  {name: "Nature's Tickle", img: "/img_5.png"},
  {name: "Abbrasive Floss", img: "/img_6.png"},
  {name: "Dusk creeps", img: "/img_7.png"},
  {name: "Rootsprout", img: "/img_8.png"},
  {name: "Chromestock", img: "/img_9.png"},
  {name: "Passionfruit", img: "/img_10.png"},
];

const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time)=> lenis.raf(time*1000));
gsap.ticker.lagSmoothing(0);

const titlesContainer = document.querySelector(".spotlight-titles");
const imagesContainer = document.querySelector(".spotlight-images");
const spotlightHeader = document.querySelector(".spotlight-header");
const titlesContainerElement = document.querySelector(".spotlight-titles-container");
const introTextElements=document.querySelectorAll(".spotlight-intro-text");
const imageElements = [];

spotlightItems.forEach((item, index) =>{
  const titleElement = document.createElement("h1");
  titleElement.textContent = item.name;
  if (index ==0 )titleElement.style.opacity ="1";
  titlesContainer.appendChild(titleElement);

  const imgWrapper = document.createElement("div");
  imgWrapper.className = "spotlight-img";
  const imgElement = document.createElement("img");
  imgElement.src = item.img;
  imgElement.alt = "";
  imgWrapper.appendChild(imgElement);
  imagesContainer.appendChild(imgWrapper);
  imageElements.push(imgWrapper);
});

const titleElements = titlesContainer.querySelectorAll("h1");
let currentActiveIndex=0;

const containerWidth = window.innerWidth*0.3;
const containerHeight = window.innerHeight;
const arcStartX = containerWidth -220;
const arcStartY = -200;
const arcEndY = containerHeight +200;
const arcControlPointX = arcStartX+ config.arcRadius;
const arcControlPointY= containerHeight/2
function getBezierPosition (t){
  const x = (1-t)*(1-t)*arcStartX+2*(1-t)*t*arcControlPointX+t*t*arcStartX;
  const y = (1-t)*(1-t)*arcStartY+2*(1-t)*t*arcControlPointY+t*t*arcEndY;
  return {x,y};
}
function getImgProgressState (index, overallProgress){
  const startTime=index*config.gap;
  const endTime= startTime+config.speed;
  if (overallProgress<startTime) return -1;
  if (overallProgress>endTime) return 2;

  return (overallProgress-startTime)/config.speed;
}

imageElements.forEach((img) => gsap.set(img,{opacity:0}));

ScrollTrigger.create({
  trigger:".spotlight",
  start: "top top",
  end: `+=${window.innerHeight*10}px`,
  pin: true,
  pinSpacing: true,
  scrub:1,
  onUpdate: (self) => {

    const progress = self.progress;

    if (progress<=0.2){
      const animationProgress = progress/0.2;
      const moveDistance = window.innerWidth*0.6;
      gsap.set(introTextElements[0], {
        x:-animationProgress*moveDistance,
      });
      gsap.set(introTextElements[1], {
        x: animationProgress *moveDistance,
      });
      gsap.set(".spotlight-bg-img",{
        transform:`scale(${animationProgress})`,
      });
      gsap.set(".spotlight-bg-img img", {
        transform:`scale(${1.5-animationProgress*0.5})`,
      });

      imageElements.forEach((img)=> gsap.set(img, {opacity:0}));
      spotlightHeader.style.opacity = "0";
      gsap.set(titlesContainerElement, {
        "--before-opacity":"0",
        "--after-opacity":"0",
      });

    }
    else if (progress >0.2 && progress <= 0.25){
      gsap.set(".spotlight-bg-img", {transform:"scale(1)"});
      gsap.set(".spotlight-bg-img img", {transform:"scale(1)"});

      gsap.set(introTextElements[0], {opacity: 0});
      gsap.set(introTextElements[1],{opacity:0});
      imageElements.forEach((img)=> gsap.set(img,{opacity:0}));
      spotlightHeader.style.opacity="1";
      gsap.set(titlesContainerElement,{
        "--before-opacity":"1",
        "--after-opacity":"1",
      });

    } else if (progress>0.25&&progress<=0.95) {
      gsap.set(".spotlight-bg-img", {transform:"scale(1)"});
      gsap.set(".spotlight-bg-img img", {transform:"scale(1)"});

      gsap.set(introTextElements[0], {opacity: 0});
      gsap.set(introTextElements[1],{opacity:0});
      spotlightHeader.style.opacity="1";
      gsap.set(titlesContainerElement,{
        "--before-opacity":"1",
        "--after-opacity":"1",

      });


      const switchProgress = (progress-0.25)/0.7;
      const viewportHeight = window.innerHeight;
      const titlesContainerHeight= titlesContainer.scrollHeight;
      const startPosition = viewportHeight;
      const targetPosition = -titlesContainerHeight;
      const totalDistance = startPosition - targetPosition;
      const currentY = startPosition - switchProgress*totalDistance;


      gsap.set(".spotlight-titles",{
        transform:`translateY(${currentY}px)`,
      });

      // gsap.to(".spotlight-titles", {
      //   y: currentY, // how much you want it to move
      //   scrollTrigger: {
      //     trigger: ".spotlight-titles", // element that triggers the animation
      //     start: "top 80%",              // when the animation should start
      //     end: "bottom 20%",             // when it should end
      //     scrub: true                    // ties animation progress to scrollbar
      //   }
      // });

      imageElements.forEach((img, index)=> {
        const imageProgress = getImgProgressState(index, switchProgress);

        if (imageProgress<0|| imageProgress>1){
          gsap.set(img, {opacity:0});
        }else {
          const pos=getBezierPosition(imageProgress);
          gsap.set(img,{
            x:pos.x+800,
            y:pos.y-7,
            opacity: 1,
          });
        }
      });
      const viewportMiddle=viewportHeight/2;
      let closestIndex=0;
      let closestDistance = Infinity;

      titleElements.forEach((title,index)=>{
        const titleRect=title.getBoundingClientRect();
        const titleCenter=titleRect.top +titleRect.height/2;
        const distanceFromCenter=Math.abs(titleCenter-viewportMiddle);
        if(distanceFromCenter<closestDistance){
          closestDistance=distanceFromCenter;
          closestIndex=index;
        }
      });
      if (closestIndex!= currentActiveIndex){
        if (titleElements[currentActiveIndex]){

          titleElements[currentActiveIndex].style.opacity = "0.25";
        }
        titleElements[closestIndex].style.opacity="1";
        document.querySelector(".spotlight-bg-img img").src =
        spotlightItems[closestIndex].img;
        currentActiveIndex=closestIndex;
      }

    } else if (progress > 0.95) {
      spotlightHeader.style.opacity="0";
      gsap.set(titlesContainerElement,{
        "--before-opacity":"0",
        "--after-opacity":"0",
      });
    }
    },
});
