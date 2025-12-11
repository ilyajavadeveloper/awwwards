import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import VideoPreview from "./VideoPreview";

gsap.registerPlugin(ScrollTrigger);

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

    /* ============== VIDEO SOURCE SELECTOR ============== */
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

    /* ============== ZOOM LOAD ============== */
    const handleZoomLoaded = () => {
        handleLoaded();
        setIsTransitionReady(true);
    };

    /* ============== CLICK ============== */
    const startTransition = () => {
        if (loading || hasClicked) return;
        setTransitionIndex(nextIndex);
        setHasClicked(true);
    };

    /* ============== GSAP TRANSITION ============== */
    useGSAP(
        () => {
            if (
                !hasClicked ||
                !transitionIndex ||
                !isTransitionReady
            )
                return;

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
        <div className="relative h-dvh w-screen overflow-x-hidden">

            {/* ========== PRELOADER ========== */}
            {loading && (
                <div className="absolute inset-0 z-[200] flex items-center justify-center bg-black/70 pointer-events-none">
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                </div>
            )}

            <div
                id="video-frame"
                className="
                    relative z-10 h-dvh w-screen
                    bg-blue-75
                    rounded-lg
                    overflow-hidden
                    max-sm:overflow-visible
                "
            >
                {/* ========== BACKGROUND VIDEO ========== */}
                <video
                    ref={bgRef}
                    src={getVideoSrc(currentIndex)}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster="/fallback.jpg"
                    className="absolute inset-0 size-full object-cover"
                    onLoadedData={handleLoaded}
                />

                {/* ========== ZOOM VIDEO ========== */}
                <video
                    ref={zoomRef}
                    id="zoom-video"
                    src={
                        transitionIndex
                            ? getVideoSrc(transitionIndex)
                            : getVideoSrc(currentIndex)
                    }
                    autoPlay={false}
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster="/fallback.jpg"
                    className="
                        absolute-center absolute z-40
                        size-[26rem] max-sm:size-[19rem]
                        object-cover
                        opacity-0
                        rounded-2xl max-sm:rounded-none
                    "
                    onLoadedData={handleZoomLoaded}
                />

                {/* ========== MINI PREVIEW ========== */}
                <div
                    id="mini-video-wrapper"
                    className="
                        absolute-center absolute z-50
                        size-64 max-sm:size-44
                        cursor-pointer
                        overflow-hidden
                        rounded-2xl max-sm:rounded-none
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
                            className="size-full object-cover"
                            onLoadedData={handleLoaded}
                        />
                    </VideoPreview>
                </div>

                {/* ========== TEXT ========== */}
                <div className="absolute left-0 top-0 z-40 size-full">
                    <div className="mt-16 max-sm:mt-10 px-5 sm:px-10">
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

            <h1 className="special-font hero-heading absolute bottom-2 right-2 max-sm:bottom-1 max-sm:right-1 text-black">
                G<b>A</b>MING
            </h1>
        </div>
    );
};

export default Hero;
