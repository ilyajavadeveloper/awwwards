import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import VideoPreview from "./VideoPreview";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_VIDEOS = 3;

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [hasClicked, setHasClicked] = useState(false);

    const [loading, setLoading] = useState(true);
    const [loadedVideos, setLoadedVideos] = useState(0);

    const currentVideoRef = useRef(null);
    const incomingVideoRef = useRef(null);

    const handleVideoLoad = () => {
        setLoadedVideos((prev) => prev + 1);
    };

    useEffect(() => {
        if (loadedVideos >= TOTAL_VIDEOS * 2) setLoading(false);
    }, [loadedVideos]);

    const nextIndex = currentIndex === TOTAL_VIDEOS ? 1 : currentIndex + 1;

    const handleMiniVdClick = () => {
        if (hasClicked) return;
        setHasClicked(true);
        setCurrentIndex(nextIndex);
    };

    const getVideoSrc = (i) => `videos/hero-${i}.mp4`;

    /* ================================
       VIDEO TRANSITION ANIMATION
    ================================= */
    useGSAP(
        () => {
            if (!hasClicked) return;

            gsap.set(incomingVideoRef.current, {
                visibility: "visible",
                scale: 0.2,
                opacity: 0,
            });

            gsap.to(incomingVideoRef.current, {
                scale: 1,
                opacity: 1,
                duration: 1.2,
                ease: "power2.inOut",
                onStart: () => incomingVideoRef.current.play(),
            });

            gsap.to(currentVideoRef.current, {
                scale: 1.5,
                opacity: 0,
                duration: 1.2,
                ease: "power2.inOut",
            });
        },
        { dependencies: [currentIndex], revertOnUpdate: true }
    );

    /* ================================
       MASK + FRAME SCROLL ANIMATION
    ================================= */
    useGSAP(() => {
        gsap.set("#video-frame", {
            clipPath: "polygon(12% 0, 75% 0, 90% 90%, 0 95%)",
            borderRadius: "0% 0% 40% 10%",
        });

        gsap.from("#video-frame", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            borderRadius: "0% 0% 0% 0%",
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: "#video-frame",
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
        });
    });

    return (
        <div className="relative h-dvh w-screen overflow-hidden">

            {/* ===== LOADER ===== */}
            {loading && (
                <div className="flex-center absolute inset-0 z-[100] bg-blue-50">
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                </div>
            )}

            {/* ===== FRAME ===== */}
            <div
                id="video-frame"
                className="relative z-10 h-dvh w-screen overflow-hidden rounded-xl bg-blue-75"
            >
                {/* MINI PREVIEW */}
                <div className="absolute-center absolute z-50 size-56 sm:size-64 cursor-pointer overflow-hidden rounded-xl">
                    <VideoPreview>
                        <div
                            onClick={handleMiniVdClick}
                            className="origin-center scale-75 sm:scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
                        >
                            <video
                                src={getVideoSrc(nextIndex)}
                                loop
                                muted
                                ref={incomingVideoRef}
                                className="size-64 object-cover object-center"
                                onLoadedData={handleVideoLoad}
                            />
                        </div>
                    </VideoPreview>
                </div>

                {/* NEXT VIDEO FULLSCREEN */}
                <video
                    ref={incomingVideoRef}
                    src={getVideoSrc(currentIndex)}
                    className="absolute inset-0 invisible z-20 size-full object-cover object-center transition-all"
                    loop
                    muted
                    onLoadedData={handleVideoLoad}
                />

                {/* CURRENT VIDEO FULLSCREEN */}
                <video
                    ref={currentVideoRef}
                    src={getVideoSrc(currentIndex)}
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 z-10 size-full object-cover object-center"
                    onLoadedData={handleVideoLoad}
                />

                {/* TITLES */}
                <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
                    G<b>A</b>MING
                </h1>

                <div className="absolute inset-0 z-40">
                    <div className="mt-20 sm:mt-24 px-5 sm:px-10">
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

            {/* OUTER TITLE (UNDER FRAME) */}
            <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
                G<b>A</b>MING
            </h1>
        </div>
    );
};

export default Hero;
