"use client"

import LocomotiveScroll from "locomotive-scroll";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import "./scrollAnimation.css"

// Register GSAP plugin safely
if (typeof window !== "undefined" && !(gsap as typeof gsap & { ScrollTrigger?: unknown }).ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

const frameCount = 300;

function getImagePath(index: number): string {
  return `/frame_Image/male${String(index + 1).padStart(4, "0")}.png`;
}

const ScrollAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const images = useRef<HTMLImageElement[]>([]);
  const imageSeq = useRef({ frame: 1 });

  //_This usEffect for the Scroll and pin mechanism...
  useEffect(() => {

    if (!mainRef.current) return;
    const locoScroll = new LocomotiveScroll({
      el: mainRef.current,
      smooth: true,
    });
    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(mainRef.current, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          locoScroll.scrollTo(value, { duration: 0, disableLerp: true });
        } else {

         // @ts-expect-error accessing scroll property from Locomotive instance
          return locoScroll.scroll.instance.scroll.y;
        }
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
  
      pinType: (mainRef.current as HTMLElement).style.transform ? "transform" : "fixed",
    });
  
    ScrollTrigger.addEventListener("refresh", ()=>{      locoScroll.update();});


    ScrollTrigger.refresh();

    gsap.to("#page1", {
      scrollTrigger: {
        trigger: "#page1",
        start: "top top",
        end: "bottom top",
        pin: true,
        scroller: mainRef.current,
      }
    });
    gsap.to("#page2", {
      scrollTrigger: {
        trigger: "#page2",
        start: "top top",
        end: "bottom top",
        pin: true,
        scroller: mainRef.current,
      }
    });
    gsap.to("#page3", {
      scrollTrigger: {
        trigger: "#page3",
        start: "top top",
        end: "bottom top",
        pin: true,
        scroller: mainRef.current,
      }
    });

    return () => {
      ScrollTrigger.removeEventListener("refresh", ()=>{     
         locoScroll.update();
        });

      locoScroll.destroy();
      ScrollTrigger.killAll();
    };
  }, []);

  //_This useEffect for the canvas making... 
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    images.current = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.src = getImagePath(i);
      images.current.push(img);
    }

    function render() {
      if (context) {
        scaleImage(images.current[imageSeq.current.frame], context);
      }
    }

    function scaleImage(img: HTMLImageElement, ctx: CanvasRenderingContext2D) {
      if (!img || !img.complete) return;
      const canvas = ctx.canvas;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShift_x = (canvas.width - img.width * ratio) / 2;
      const centerShift_y = (canvas.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        centerShift_x,
        centerShift_y,
        img.width * ratio,
        img.height * ratio
      );
    }

    images.current[1].onload = render;

    gsap.to(imageSeq.current, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        scrub: 0.15,
        trigger: "#page>canvas",
        start: "top top",
        end: "600% top",
        scroller: mainRef.current,
      },
      onUpdate: render,
    });

    ScrollTrigger.create({
      trigger: "#page>canvas",
      pin: true,
      scroller: mainRef.current,
      start: "top top",
      end: "600% top",
    });

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      render();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div id="nav">
              <h3 className="text-[25px] font-normal">
                <span className="text-black px-1">CYBER</span>
                <span
                  className="ml-1 text-transparent"
                  style={{ WebkitTextStroke: "1px black" }}
                >
                   FUNK
                </span>
              </h3>
              <button className="cursor-pointer">Github</button>
      </div>
            <div id="main" ref={mainRef}>
        <div id="page">
          <div id="loop">
            <h1>CYBER FICTION IS THE  REAL <span>STORY</span> IN THE <span><i>METAVERSE.</i></span></h1>
            <h1><b>CYBER</b>FICTION IS THE <b><i>REAL</i></b> <span>STORY</span> IN THE <span><i>METAVERSE.</i></span></h1>
            <h1><b>CYBER</b>FICTION IS THE <b><i>REAL</i></b> <span>STORY</span> IN THE <span><i>METAVERSE.</i></span></h1>
          </div>
          <h3>CYBERFICTION AIMS TO BE A DECENTRALIZED COMMUNITY THAT CAN <br /> CREATE NEW VALUES AND PROFITS THROUGH PLAY IN THE VIRTUAL <br /> WORLD.</h3>
          <h4>...SCROLL TO READ</h4>
          <canvas ref={canvasRef}></canvas>
        </div>
        <div id="page1">
          <div id="right-text">
            <h3>CYBERFICTION / KEY WORD</h3>
            <h1>HAVE FUN<br />LET&apos;S PLAY<br />JUST BE TOGETHER</h1>
          </div>
          <div id="left-text">
            <h1>MAKE A STORY<br />TAKE A CHANCE<br />BUILD AND OWNED</h1>
            <h3>..AND MAINTAIN GOOD HUMANITY</h3>
          </div>
        </div>
        <div id="page2">
          <div id="text1">
            <h3>CYBERFICTION / HAVE FUN</h3>
            <h1>LET&apos;S<br />HAVE FUN<br />TOGETHER</h1>
          </div>
          <div id="text2">
            <p>LET&apos;S HAVE A BLAST! LET&apos;S JUST THROW AWAY AGE, GENDER, REGION, <br /> STATUS, ETC., DON&apos;T COMPETE, DON&apos;T FIGHT, COOPERATE AND SHARE <br /> WITH EACH OTHER AND ENJOY IT TOGETHER! SO THAT YOU CAN STAND <br /> THERE IN THE NOT-TOO-DISTANT FUTURE AND DREAM OF ANOTHER NEW <br /> FUTURE</p>
          </div>
        </div>
        <div id="page3">
          <div id="text3">
            <h3>CYBERFICTION / PLAYGROUND</h3>
            <h1>CYBERFIELD<br />IS OUR<br />PLAYGROUND</h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScrollAnimation; 