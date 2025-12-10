import React, { useRef, useState } from "react";
import Button from "./Button.jsx";
import { TiLocationArrow } from "react-icons/ti";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [hasClicked, setHasClicked] = useState(false);

    const totalVideos = 4;

    const previewRef = useRef(null);
    const nextVideoRef = useRef(null);
    const mainVideoRef = useRef(null);

    const upcomingVideoIndex =
        currentIndex === totalVideos ? 1 : currentIndex + 1;

    const getVideoSrc = (i) => `videos/hero-${i}.mp4`;

    const handleMiniVdClick = () => {
        if (hasClicked) return;
        setHasClicked(true);
        setCurrentIndex(upcomingVideoIndex);
    };

    /* ===========================================================
        GSAP — FAST & CLEAN FULLSCREEN TRANSITION (NO MICRO-LAG)
    ============================================================ */
    useGSAP(() => {
        if (!hasClicked) return;

        const preview = previewRef.current;
        const nextV = nextVideoRef.current;
        const mainV = mainVideoRef.current;

        if (!preview || !nextV || !mainV) return;

        // Вычисляем идеальный scale, который покроет весь экран
        const rect = preview.getBoundingClientRect();
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;
        const finalScale = Math.max(screenW / rect.width, screenH / rect.height) * 1.1;

        // Подготовка
        gsap.set(nextV, { opacity: 0, visibility: "visible" });
        nextV.play();

        const tl = gsap.timeline({
            defaults: { ease: "power1.out" } // максимально плавная и быстрая ease
        });

        // 1) лёгкое вспыхивание
        tl.to(preview, {
            opacity: 0.55,
            scale: 0.32,
            duration: 0.10
        });

        // 2) быстрый clean-zoom
        tl.to(preview, {
            scale: finalScale,
            opacity: 1,
            rotate: 25,
            duration: 0.33, // 🔥 быстрее и чище
            ease: "expo.out"
        });

        // 3) плавное перекрытие видео
        tl.to(
            mainV,
            {
                opacity: 0,
                duration: 0.28,
                ease: "power1.out"
            },
            "-=0.18"
        );

        tl.to(
            nextV,
            {
                opacity: 1,
                duration: 0.35,
                ease: "power1.out"
            },
            "<"
        );

        // 4) ЧИСТЫЙ ресет (без прыжков)
        tl.add(() => {
            mainV.src = getVideoSrc(currentIndex);
            mainV.play();

            gsap.set(mainV, { opacity: 1 });
            gsap.set(nextV, { opacity: 0, visibility: "hidden" });

            gsap.set(preview, {
                scale: 0.25,
                opacity: 0.18,
                rotate: 0
            });

            setHasClicked(false);
        });
    }, { dependencies: [currentIndex] });

    return (
        <div className="relative h-dvh w-screen overflow-x-hidden">
            <div
                id="video-frame"
                className="relative z-10 h-dvh w-screen overflow-x-hidden rounded-lg bg-blue-75"
            >
                <div>
                    {/* MINI PREVIEW */}
                    <div className="absolute-center absolute z-50 size-100 cursor-pointer">
                        <div
                            ref={previewRef}
                            onClick={handleMiniVdClick}
                            className="
                                mini-preview
                                origin-center
                                scale-25
                                opacity-18
                                transition-all
                                duration-300
                                hover:scale-40
                                hover:opacity-35
                                hover:drop-shadow-[0_0_25px_rgba(0,255,255,0.4)]
                            "
                        >
                            <video
                                src={getVideoSrc(upcomingVideoIndex)}
                                loop
                                muted
                                className="size-64 object-cover rounded-lg"
                            />
                        </div>
                    </div>

                    {/* TRANSITION LAYER */}
                    <video
                        ref={nextVideoRef}
                        id="next-video"
                        src={getVideoSrc(upcomingVideoIndex)}
                        loop
                        muted
                        className="absolute left-0 top-0 size-full object-cover opacity-0"
                        style={{ visibility: "hidden" }}
                    />

                    {/* MAIN BACKGROUND */}
                    <video
                        ref={mainVideoRef}
                        id="main-video"
                        src={getVideoSrc(currentIndex)}
                        autoPlay
                        loop
                        muted
                        className="absolute left-0 top-0 size-full object-cover opacity-100"
                    />
                </div>

                {/* TEXT */}
                <h1 className="special-font hero-heading absolute z-30 right-6 bottom-6 text-blue-100">
                    G<b>a</b>ming
                </h1>

                <div className="absolute left-0 top-0 size-full">
                    <div className="mt-24 px-5 sm:px-10">
                        <h1 className="special-font hero-heading text-blue-100">
                            redefi<b>n</b>e
                        </h1>
                    </div>

                    <div className="mt-3 px-5 sm:px-10">
                        <p className="font-robert-regular text-blue-100/90">
                            Enter the Metagame Layer
                            <span className="block text-blue-100/60">
                                Unleash the Play Economy
                            </span>

                            <Button
                                id="watch-trailer"
                                title="Watch Trailer"
                                leftIcon={<TiLocationArrow />}
                                containerClass="!bg-yellow-300 flex-center gap-1 mt-4"
                            />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
