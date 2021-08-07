import React, { useEffect, useState, useRef } from "react";
import "./styles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import aa2 from "./assets/aa2.mp4";

export default function App() {
  gsap.registerPlugin(ScrollTrigger);
  const videoRef = useRef(null);
  const [count, setCount] = useState(0);
  const srcRef = useRef(null);

  function once(el, event, fn, opts) {
    var onceFn = function (e) {
      el.removeEventListener(event, onceFn);
      fn.apply(this, arguments);
    };
    el.addEventListener(event, onceFn, opts);
    return onceFn;
  }

  const scrollEnd = () => {
    console.log("scroll end");
  };

  let tl = useRef(
    gsap.timeline({
      defaults: { duration: 1 },
      scrollTrigger: {
        trigger: ".videoElement",
        start: "top top",
        end: "+=1000",
        scrub: true,
        markers: true,
        pin: true
        // pinType: "fixed",
        // anticipatePin: 2
      },
      onComplete: scrollEnd
    })
  );

  useEffect(() => {
    if (videoRef.current && count === 0) {
      setCount(1);
      console.log("videoRef Loaded");
      srcRef.current = videoRef.current.currentSrc || videoRef.current.src;

      once(document.documentElement, "touchstart", function (e) {
        console.log("touchstart");
        videoRef.current.play();
        videoRef.current.pause();
      });

      setTimeout(function () {
        if (window["fetch"]) {
          fetch(srcRef.current)
            .then((response) => response.blob())
            .then((response) => {
              var blobURL = URL.createObjectURL(response);

              var t = videoRef.current.currentTime;
              once(document.documentElement, "touchstart", function (e) {
                videoRef.current.play();
                videoRef.current.pause();
              });

              videoRef.current.setAttribute("src", blobURL);
              videoRef.current.currentTime = t + 0.01;
            });
        }
      }, 1000);

      once(videoRef.current, "loadedmetadata", () => {
        tl.current.fromTo(
          videoRef.current,
          { currentTime: 0 },
          { currentTime: videoRef.current.duration || 1 }
        );
      });
      ScrollTrigger.refresh();
    }
  }, []);

  return (
    <div className="App">
      <video
        // style={animFixed ? {position: "fixed"} : {position: "relative"}}
        ref={videoRef}
        src={aa2}
        playsInline
        webkit-playsinline="true"
        preload="auto"
        muted
        className="videoElement"
      ></video>
      <div id="mycontainer"></div>
      <h2>Here is some text!</h2>
    </div>
  );
}
