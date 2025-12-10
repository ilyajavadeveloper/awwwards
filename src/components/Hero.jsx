import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import VideoPreview from "./VideoPreview";

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [hasClicked, setHasClicked] = useState(false);

    const [loading, setLoading] = useState(true);
    const [loadedVideos, setLoadedVideos] = useState(0);

    const totalVideos = 4;

    const previewVideoRef = useRef(null); // мини-видео
    const transitionVideoRef = useRef(null); // выезжающее видео после клика

    const handleVideoLoad = () => {
        setLoadedVideos((prev) => prev + 1);
    };

    useEffect(() => {
        if (loadedVideos >= totalVideos) {
            setLoading(false);
        }
    }, [loadedVideos]);

    const handleMiniVdClick = () => {
        if (hasClicked) return;

        setHasClicked(true);
        setCurrentIndex((prev) => (prev % totalVideos) + 1);
    };

    /* ===========================
       VIDEO TRANSITION ANIMATION
    ============================ */
    useGSAP(
        () => {
            if (!hasClicked) return;

            gsap.set("#next-video", { visibility: "visible" });

            const tl = gsap.timeline();

            tl.to("#next-video", {
                transformOrigin: "center center",
                scale: 1,
                width: "100%",
                height: "100%",
                duration: 1.1,
                ease: "power2.inOut",
                onStart: () => transitionVideoRef.current?.play(),
            }).from(
                "#current-video",
                {
                    transformOrigin: "center center",
                    scale: 0,
                    duration: 1.2,
                    ease: "power2.inOut",
                },
                0
            );
        },
        { dependencies: [currentIndex], revertOnUpdate: true }
    );

    /* ===========================
       SCROLLTRIGGER SHAPE ANIMATION
    ============================ */
    useGSAP(() => {
        gsap.set("#video-frame", {
            clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
            borderRadius: "0% 0% 40% 10%",
        });

        gsap.from("#video-frame", {
            clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
            borderRadius: "0% 0% 0% 0%",
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: "#video-frame",
                start: "center center",
                end: "bottom center",
                scrub: true,
            },
        });
    });

    const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

    return (
        <div className="relative h-dvh w-screen overflow-x-hidden">
            {/* LOADING SCREEN */}
            {loading && (
                <div className="flex-center absolute z-[100] h-dvh w-screen bg-violet-50">
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                </div>
            )}

            {/* MAIN VIDEO FRAME */}
            <div
                id="video-frame"
                className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
            >
                <div>
                    {/* MINI PREVIEW BUTTON */}
                    <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
                        <VideoPreview>
                            <div
                                onClick={handleMiniVdClick}
                                className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
                            >
                                <video
                                    ref={previewVideoRef}
                                    src={getVideoSrc((currentIndex % totalVideos) + 1)}
                                    loop
                                    muted
                                    id="current-video"
                                    className="size-64 origin-center scale-150 object-cover"
                                    onLoadedData={handleVideoLoad}
                                />
                            </div>
                        </VideoPreview>
                    </div>

                    {/* TRANSITION VIDEO */}
                    <video
                        ref={transitionVideoRef}
                        src={getVideoSrc(currentIndex)}
                        loop
                        muted
                        id="next-video"
                        className="absolute-center invisible absolute z-20 size-64 object-cover"
                        onLoadedData={handleVideoLoad}
                    />

                    {/* MAIN BACKGROUND VIDEO */}
                    <video
                        src={getVideoSrc(
                            currentIndex === totalVideos ? 1 : currentIndex
                        )}
                        autoPlay
                        loop
                        muted
                        className="absolute left-0 top-0 size-full object-cover"
                        onLoadedData={handleVideoLoad}
                    />
                </div>

                {/* HERO TEXT + CTA */}
                <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
                    G<b>A</b>MING
                </h1>

                <div className="absolute left-0 top-0 z-40 size-full">
                    <div className="mt-24 px-5 sm:px-10">
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

            {/* BLACK OUTLINE DUPLICATE TEXT */}
            <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
                G<b>A</b>MING
            </h1>
        </div>
    );
};

export default Hero;
