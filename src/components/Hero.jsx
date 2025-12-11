import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import VideoPreview from "./VideoPreview";

const TOTAL_VIDEOS = 4;

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [transitionIndex, setTransitionIndex] = useState(null);
    const [isTransitionReady, setIsTransitionReady] = useState(false);
    const [hasClicked, setHasClicked] = useState(false);

    const [loaded, setLoaded] = useState(0);
    const [loading, setLoading] = useState(true);

    const bgRef = useRef(null);
    const zoomRef = useRef(null);
    const miniRef = useRef(null);

    const isMobile =
        typeof window !== "undefined" && window.innerWidth < 640;

    const nextIndex = (currentIndex % TOTAL_VIDEOS) + 1;

    /* SELECT VIDEO VERSION */
    const getVideoSrc = (i) =>
        isMobile
            ? `/videos/mobile/hero-${i}.mp4`
            : `/videos/hero-${i}.mp4`;

    const handleLoaded = () => {
        setLoaded((p) => p + 1);
    };

    useEffect(() => {
        if (loaded >= 2) setLoading(false);
    }, [loaded]);

    const handleZoomLoaded = () => {
        handleLoaded();
        setIsTransitionReady(true);
    };

    const startTransition = () => {
        if (loading || hasClicked) return;
        setTransitionIndex(nextIndex);
        setHasClicked(true);
    };

    /* ===========================
         GSAP TRANSITION FIXED
    =========================== */
    useGSAP(
        () => {
            if (!hasClicked || !transitionIndex || !isTransitionReady) return;

            const ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    defaults: { ease: "power2.out" },

                    onStart: () => {
                        if (zoomRef.current) {
                            zoomRef.current.currentTime = 0;
                            zoomRef.current.play().catch(() => {});
                        }
                    },

                    onComplete: () => {
                        setCurrentIndex(transitionIndex);
                        setTransitionIndex(null);
                        setIsTransitionReady(false);
                        setHasClicked(false);

                        gsap.set("#zoom-video", {
                            autoAlpha: 0,
                            scale: 1,
                        });
                    },
                });

                // Safe initial state
                gsap.set("#zoom-video", {
                    autoAlpha: 1,
                    scale: isMobile ? 1 : 0.3,
                });

                tl.to("#zoom-video", {
                    scale: isMobile ? 1 : 1,
                    duration: 0.9,
                });

                tl.to(
                    "#mini-video-wrapper",
                    {
                        opacity: 0,
                        scale: 0.6,
                        duration: 0.8,
                    },
                    0
                );
            });

            return () => ctx.revert();
        },
        [
            hasClicked,
            transitionIndex,
            isTransitionReady
        ]
    );

    return (
        <div className="relative h-dvh w-screen overflow-x-hidden bg-black">

            {/* LOADER */}
            {loading && (
                <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/80">
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                </div>
            )}

            {/* ===============================
                VIDEO FRAME (NO overflow-hidden)
            =============================== */}
            <div
                id="video-frame"
                className="
                    relative z-10 h-dvh w-screen
                    bg-blue-75
                    rounded-none
                    overflow-visible
                "
            >
                {/* BACKGROUND VIDEO */}
                <video
                    ref={bgRef}
                    src={getVideoSrc(currentIndex)}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster="/fallback.jpg"
                    className="
                        absolute top-0 left-0
                        w-full h-full
                        object-cover
                        max-sm:object-fill
                    "
                    onLoadedData={handleLoaded}
                />

                {/* ZOOM VIDEO — Samsung-safe */}
                <video
                    ref={zoomRef}
                    id="zoom-video"
                    src={
                        transitionIndex
                            ? getVideoSrc(transitionIndex)
                            : getVideoSrc(currentIndex)
                    }
                    loop
                    muted
                    playsInline
                    autoPlay={false}
                    preload="auto"
                    poster="/fallback.jpg"
                    className="
                        absolute
                        top-1/2 left-1/2
                        -translate-x-1/2 -translate-y-1/2
                        w-[26rem] h-[26rem]
                        max-sm:w-[100vw] max-sm:h-[100vh]
                        object-fill
                        opacity-0
                        rounded-none
                    "
                    onLoadedData={handleZoomLoaded}
                />

                {/* MINI PREVIEW — SAFE CENTER */}
                <div
                    id="mini-video-wrapper"
                    className="
                        absolute z-50
                        top-1/2 left-1/2
                        -translate-x-1/2 -translate-y-1/2
                        w-64 h-64
                        max-sm:w-44 max-sm:h-44
                        cursor-pointer
                        overflow-visible
                        rounded-none
                    "
                    onClick={startTransition}
                >
                    <VideoPreview>
                        <video
                            ref={miniRef}
                            src={getVideoSrc(nextIndex)}
                            loop
                            muted
                            playsInline
                            preload="auto"
                            poster="/fallback.jpg"
                            className="w-full h-full object-fill"
                            onLoadedData={handleLoaded}
                        />
                    </VideoPreview>
                </div>

                {/* TEXT */}
                <div className="absolute left-0 top-0 z-40 w-full h-full pointer-events-none">
                    <div className="mt-20 px-5 sm:px-10 pointer-events-auto">
                        <h1 className="special-font hero-heading text-blue-100">
                            redefi<b>n</b>e
                        </h1>

                        <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
                            Enter the Metagame Layer <br /> Unleash the Play Economy
                        </p>

                        <Button
                            id="watch-trailer"
                            title="Watch trailer"
                            leftIcon={<TiLocationArrow />}
                            containerClass="bg-yellow-300 flex-center gap-1"
                        />
                    </div>
                </div>
            </div>

            <h1 className="special-font hero-heading absolute bottom-4 right-4 text-white">
                G<b>A</b>MING
            </h1>
        </div>
    );
};

export default Hero;
