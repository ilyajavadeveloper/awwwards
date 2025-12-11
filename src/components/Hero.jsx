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
    const [hasClicked, setHasClicked] = useState(false);
    const [transitionReady, setTransitionReady] = useState(false);

    const [loading, setLoading] = useState(true);
    const [loadedVideos, setLoadedVideos] = useState(0);

    const bgVideoRef = useRef(null);
    const zoomVideoRef = useRef(null);
    const miniVideoRef = useRef(null);

    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

    const nextIndex = (currentIndex % TOTAL_VIDEOS) + 1;

    const getVideoSrc = (i) =>
        isMobile
            ? `videos/mobile/hero-${i}.mp4`
            : `videos/hero-${i}.mp4`;

    const handleVideoLoad = () => {
        setLoadedVideos((p) => p + 1);
    };

    useEffect(() => {
        if (loadedVideos >= 2) setLoading(false);
    }, [loadedVideos]);

    const handleMiniVdClick = () => {
        if (loading || hasClicked) return;

        setTransitionIndex(nextIndex);
        setHasClicked(true);
    };

    const handleZoomLoad = () => {
        handleVideoLoad();
        if (transitionIndex) setTransitionReady(true);
    };

    /* =========================
       GSAP — ZOOM TRANSITION
       (mobile-safe)
    ========================== */
    useGSAP(
        () => {
            if (!hasClicked || transitionIndex == null || !transitionReady) return;

            const ctx = gsap.context(() => {
                const tl = gsap.timeline({
                    defaults: { ease: "power2.inOut" },

                    onStart: () => {
                        if (zoomVideoRef.current) {
                            zoomVideoRef.current.currentTime = 0;
                            zoomVideoRef.current
                                .play()
                                .catch(() => {});
                        }
                    },

                    onComplete: () => {
                        setCurrentIndex(transitionIndex);
                        setHasClicked(false);
                        setTransitionIndex(null);
                        setTransitionReady(false);

                        gsap.set("#zoom-video", {
                            autoAlpha: 0,
                            scale: isMobile ? 1 : 0.7,
                        });
                    },
                });

                // Мобилка не любит transforms → ставим минимальный
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
                        scale: 0.6,
                        opacity: 0,
                        duration: 0.9,
                    },
                    0
                );
            });

            return () => ctx.revert();
        },
        {
            dependencies: [hasClicked, transitionIndex, transitionReady],
        }
    );

    /* =========================
       GSAP — CLIP-PATH SCROLL
       (OFF ON MOBILE)
    ========================== */
    useGSAP(() => {
        if (isMobile) return;

        gsap.set("#video-frame", {
            clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
            borderRadius: "0% 0% 40% 10%",
        });

        gsap.from("#video-frame", {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            borderRadius: "0 0 0 0",
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: "#video-frame",
                start: "center center",
                end: "bottom center",
                scrub: true,
            },
        });
    }, []);

    return (
        <div className="relative h-dvh w-screen overflow-x-hidden">

            {/* ===== LOADER ===== */}
            {loading && (
                <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/70 pointer-events-none">
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
                    relative z-10 h-dvh w-screen bg-blue-75 rounded-lg
                    overflow-hidden max-sm:overflow-visible
                "
            >
                {/* ===== BACKGROUND VIDEO ===== */}
                <video
                    ref={bgVideoRef}
                    src={getVideoSrc(currentIndex)}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="absolute inset-0 size-full object-cover"
                    onLoadedData={handleVideoLoad}
                />

                {/* ===== ZOOM VIDEO ===== */}
                <video
                    ref={zoomVideoRef}
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
                    className="
                        absolute-center absolute z-40
                        size-[26rem] max-sm:size-[18rem]
                        object-cover
                        opacity-0
                        max-sm:rounded-none rounded-2xl
                    "
                    onLoadedData={handleZoomLoad}
                />

                {/* ===== MINI PREVIEW ===== */}
                <div
                    id="mini-video-wrapper"
                    className="
                        absolute-center absolute z-50
                        size-64 max-sm:size-44
                        cursor-pointer
                        overflow-hidden
                        max-sm:rounded-none rounded-2xl
                    "
                    onClick={handleMiniVdClick}
                >
                    <VideoPreview>
                        <video
                            ref={miniVideoRef}
                            src={getVideoSrc(nextIndex)}
                            loop
                            muted
                            playsInline
                            preload="auto"
                            className="size-full object-cover"
                            onLoadedData={handleVideoLoad}
                        />
                    </VideoPreview>
                </div>

                {/* ===== TEXT BLOCK ===== */}
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

            {/* ===== BOTTOM TEXT ===== */}
            <h1 className="special-font hero-heading absolute bottom-2 right-2 max-sm:bottom-1 max-sm:right-1 text-black">
                G<b>A</b>MING
            </h1>
        </div>
    );
};

export default Hero;
