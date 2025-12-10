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
    const [clicked, setClicked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadedVideos, setLoadedVideos] = useState(0);

    const totalVideos = 4;

    // три разных рефа — НИКАКИХ ДУБЛЕЙ
    const previewRef = useRef(null);      // мини-видео в кнопке
    const transitionRef = useRef(null);   // видео, которое анимируется при клике
    const bgRef = useRef(null);           // фоновое видео

    const getVideoSrc = (i) => `videos/hero-${i}.mp4`;

    const handleVideoLoad = () => {
        setLoadedVideos((prev) => prev + 1);
    };

    // показываем страницу ТОЛЬКО когда загружены все 4 видео
    useEffect(() => {
        if (loadedVideos >= totalVideos) {
            setLoading(false);
        }
    }, [loadedVideos]);

    const handleMiniClick = () => {
        if (clicked) return;
        setClicked(true);

        setCurrentIndex((prev) => (prev % totalVideos) + 1);
    };

    /* ======================================================
       ANIMATION FOR VIDEO SWITCH
    ======================================================= */
    useGSAP(
        () => {
            if (!clicked) return;

            const tl = gsap.timeline();

            gsap.set("#transition-video", { visibility: "visible" });

            tl.to("#transition-video", {
                transformOrigin: "center center",
                scale: 1,
                width: "100%",
                height: "100%",
                ease: "power2.inOut",
                duration: 1,
                onStart: () => transitionRef.current?.play(),
            }).from(
                "#preview-video",
                {
                    transformOrigin: "center center",
                    scale: 0,
                    ease: "power2.inOut",
                    duration: 1.3,
                },
                0
            );
        },
        { dependencies: [currentIndex], revertOnUpdate: true }
    );

    /* ======================================================
       SCROLLTRIGGER — FRAME MORPH
    ======================================================= */
    useGSAP(() => {
        gsap.set("#video-frame", {
            clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
            borderRadius: "0% 0% 40% 10%",
        });

        gsap.from("#video-frame", {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            borderRadius: "0% 0% 0% 0%",
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: "#video-frame",
                start: "center center",
                end: "bottom center",
                scrub: true,
            },
        });
    });

    return (
        <div className="relative h-dvh w-screen overflow-hidden">
            {/* ================= LOADING SCREEN ================= */}
            {loading && (
                <div className="absolute inset-0 z-[100] flex-center bg-violet-50">
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                </div>
            )}

            {/* ================= VIDEO FRAME ================= */}
            <div
                id="video-frame"
                className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
            >
                <div>
                    {/* MINI PREVIEW BUTTON */}
                    <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
                        <VideoPreview>
                            <div
                                onClick={handleMiniClick}
                                className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
                            >
                                <video
                                    ref={previewRef}
                                    id="preview-video"
                                    src={getVideoSrc((currentIndex % totalVideos) + 1)}
                                    loop
                                    muted
                                    className="size-64 origin-center scale-150 object-cover"
                                    onLoadedData={handleVideoLoad}
                                />
                            </div>
                        </VideoPreview>
                    </div>

                    {/* TRANSITION VIDEO */}
                    <video
                        ref={transitionRef}
                        id="transition-video"
                        src={getVideoSrc(currentIndex)}
                        loop
                        muted
                        className="absolute-center invisible absolute z-20 size-64 object-cover"
                        onLoadedData={handleVideoLoad}
                    />

                    {/* BACKGROUND VIDEO */}
                    <video
                        ref={bgRef}
                        src={getVideoSrc(currentIndex)}
                        autoPlay
                        loop
                        muted
                        className="absolute inset-0 size-full object-cover"
                        onLoadedData={handleVideoLoad}
                    />
                </div>

                {/* ================= HERO TEXT ================= */}
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

            {/* OUTLINE TEXT BELOW */}
            <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
                G<b>A</b>MING
            </h1>
        </div>
    );
};

export default Hero;
