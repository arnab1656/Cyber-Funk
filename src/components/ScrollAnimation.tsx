"use client"

import { useState } from "react";
import LocomotiveScroll from "locomotive-scroll";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { FaGithub } from "react-icons/fa";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import Loader from "./laoder";
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [musicLoaded, setMusicLoaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying((prev) => !prev);
  };

  // Check if all resources are loaded
  useEffect(() => {
    if (imagesLoaded && musicLoaded) {
      setTimeout(() => {
        setShowLoader(false);
      }, 500);
    }
  }, [imagesLoaded, musicLoaded]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
      
      // Track music loading
      const handleCanPlayThrough = () => {
        setMusicLoaded(true);
      };
      
      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);
      
      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
        }
      };
    }
  }, []);

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

    function getCanvasSize() {
      const width = window.innerWidth;
      if (width <= 600) {
        return { width: window.innerWidth * 1.1, height: window.innerHeight * 0.6};
      } else if (width <= 1024) {
        return { width: window.innerWidth, height: window.innerHeight * 0.7 };
      } else {
        return { width: window.innerWidth, height: window.innerHeight };
      }
    }

    function setCanvasSize(canvas: HTMLCanvasElement) {
      const { width, height } = getCanvasSize();
      canvas.width = width;
      canvas.height = height;
    }

    setCanvasSize(canvas);

    images.current = [];
    let loadedImages = 0;
    
    for (let i = 0; i < frameCount; i++) {
      const img = new window.Image();
      img.onload = () => {
        loadedImages++;
        if (loadedImages === frameCount) {
          setImagesLoaded(true);
        }
      };
      img.src = getImagePath(i);
      images.current.push(img);
    }

    // Fallback timeout to prevent infinite loading
    setTimeout(() => {
      if (!imagesLoaded) {
        setImagesLoaded(true);
      }
    }, 10000); // 10 second timeout

    function render(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
      if (context) {
        scaleImage(images.current[imageSeq.current.frame], context);
      }
    }

    function scaleImage(img: HTMLImageElement, ctx: CanvasRenderingContext2D) {
      if (!img || !img.complete) return;
      const canvas = ctx.canvas;
      const hRatio = canvas.width / img.width;
      const vRatio = canvas.height / img.height;

      // Use hRatio for mobile (<=600px), else use cover logic

      const ratio = Math.max(hRatio, vRatio)

      // const ratio = window.innerWidth <= 600 ? hRatio : Math.max(hRatio, vRatio);

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

    images.current[1].onload = () => render(canvas, context);

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
      onUpdate: () => render(canvas, context),
    });

    ScrollTrigger.create({
      trigger: "#page>canvas",
      pin: true,
      scroller: mainRef.current,
      start: "top top",
      end: "600% top",
    });

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;
      setCanvasSize(canvas);
      render(canvas, context);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {showLoader && <Loader />}
      <div id="nav">
              <h3>
                <span className="text-black px-1"><b>CYBER</b></span>
                <span
                  className="ml-1 text-transparent"
                  style={{ WebkitTextStroke: "1px black" }}
                >
                   FUNK
                </span>
              </h3>
              <div id ="nav-button" className="flex items-center">
                <button id="but-play" className="flex items-center justify-center cursor-pointer rounded-md bg-black text-white" onClick={handlePlayPause}>
                  {isPlaying ? <CiPause1 /> : <CiPlay1 />}
                </button>
                <audio ref={audioRef} src="/music/cyberfunk.mp3" loop />
                <a
                  href="https://github.com/arnab1656/Cyber-Funk"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <button id="but-git-link" className="flex items-center justify-center cursor-pointer rounded-md bg-black text-white">
                    <FaGithub />
                    <span>Github</span>
                  </button>
                </a>
              </div>
      </div>
        <div id="main" ref={mainRef}>

        <div id="page">
          
          <div id="loop">
                <h1><b>CYBER</b> FUNK IS THE <b><i>VIBE</i></b> <span>WE</span> BRING TO THE <span><i>NEW WORLD</i></span>.</h1> 
                {" "}
                <h1><b>CYBER</b> FUNK IS THE <b><i>VIBE</i></b> <span>WE</span> BRING TO THE <span><i>NEW WORLD</i></span>.</h1>

                <h1><b>CYBER</b> FUNK IS THE <b><i>VIBE</i></b> <span>WE</span> BRING TO THE <span><i>NEW WORLD</i></span>.</h1>
          </div>

          <h3>CYBER FUNK EMPOWERS A GLOBAL COMMUNITY TO SHAPE, PLAY, <br />
              AND INNOVATE TOGETHER—CREATING REAL VALUE IN A VIRTUAL <br />
              REALITY WITHOUT LIMITS.</h3>
            <h4>...SCROLL TO READ</h4>

          <canvas ref={canvasRef}></canvas>
        </div>

        <div id="page1">
          <div id="lefty-text">
          
            <h3 >CYBER FUNK</h3>
          
            {/* Make it invisble in the 600 screen only" */}
            <h1 id="inVisible" className="inline-block">ARNAB HERE</h1> 
            
            {/* Make it visible in the <=600 screeen only */}

            <h1 id="lefty-text-visible" className="inline-block">ARNAB</h1>
            <br id="lefty-text-visible"/>
            <h1 id="lefty-text-visible" className="inline-block">HERE</h1>

            {/* End of it blocking for clear scoping */}

            <br />

             {/* Make it invisble in the 600 screen only" */}

            <h1 id="lefty-text-inVisible-1" className="inline-block">LET&apos;S PLAY</h1> 
            <br />
            <h1 id="lefty-text-inVisible-2" className="inline-block">JUST BE TOGETHER</h1>

             {/* Make it invisble in the 600 screen only scpoe ends" */}
           
          </div>
     

          <div id="right-text">

              {/* Make it invisble in the 600 screen only" */}
              <h1 id="inVisible" className="inline-block">MAKE A STORY</h1>


              {/* Make it visible in the 600 screeen only */}
              <h1 id="right-text-sm-vis" className="inline-block">MAKE</h1>
              <br id="right-text-sm-vis" />
              <h1 id="right-text-sm-vis" className="inline-block"> A STORY</h1>
              <br  />
              {/* Make it visible in the 600 screeen only scope ends*/}



              <h1 id="right-text-inVisible-1" className="inline-block">TAKE A CHANCE</h1>
              <br id="right-text-inVisible-1" />
              <h1 id="right-text-inVisible-2" className="inline-block">CHOICE AND OWNED</h1>
           
           
              <h3 id="inVisible">..AND MAINTAIN GOOD HUMANITY</h3>

              <h3 id="mid-invisible">..AND MAINTAIN</h3>
              <br id="mid-invisible"/>
              <h3 id="mid-invisible"> GOOD HUMANITY</h3>


          </div>


        </div>

        <div id="page2">

          <div id="left">
            <h3>CYBER FUNK</h3>
            <h1 className="inline-block">LET&apos;S </h1>
            <br />
            <h1 className="inline-block">HAVE FUN </h1> 
            <br /> 
            <h1 className="inline-block">TOGETHER</h1>
          </div>

          <div id="right">
            <p>LET&apos;S HAVE A BLAST! LET&apos;S JUST THROW AWAY AGE, GENDER, REGION, <br /> STATUS, ETC., DON&apos;T COMPETE, DON&apos;T FIGHT, COOPERATE AND SHARE <br /> WITH EACH OTHER AND ENJOY IT TOGETHER! SO THAT YOU CAN STAND <br /> THERE IN THE NOT-TOO-DISTANT FUTURE AND DREAM OF ANOTHER NEW <br /> FUTURE</p>
          </div>

          <div id="right-mobile">
            <p>HERE CYBER MEETS FUNK.<br />EXPERIENCE THE FUTURE.<br />ULTRA OF POSSIBILITY.
            </p>
          </div>
        
        </div>
        <div id="page3">


          <div id="right">

            <h3 id="mobile-invisible">CYBER FUNK</h3>
            <h1 id="mobile-invisible" className="inline-block">CYBER POWER</h1>
            <br id="mobile-invisible" />

             <h1  className="inline-block">IS OUR</h1>
             <br />

             <h1  className="inline-block">PLAYGROUND</h1>
             <br />
             <h3 id="invisible">GROUND IS YOURS</h3>

          </div>

          <div id="left">
            <h3>CYBER FUNK</h3>
            <h1 className="inline-block">CYBER POWER</h1>
          </div>


        </div>
      </div>
    </>
  );
};

export default ScrollAnimation; 




// see on every reload the  loader is runnign taht not what we want we want to mkae sure the laoder is only laoding for the fiist time the user land on the site . o first load tyhe images must be there in the local stroage on next time the user reload the images will be loaded form the loacal stroage okat this is the arc we are plananinn for ?