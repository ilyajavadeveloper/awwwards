import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import VideoPreview from "./VideoPreview";

gsap.registerPlugin(ScrollTrigger);

const TOTAL = 4;

const Hero = () => {
    const [current, setCurrent] = useState(1);
    const [clicked, setClicked] = useState(false);

    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(0);

    const previewRef = useRef(null);
    const transitionRef = useRef(null);

    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

    const handleLoad = () => setLoaded((p) => p + 1);

    useEffect(() => {
        if (loaded >= 2) setLoading(false);
    }, [loaded]);

    const nextIndex = (current % TOTAL) + 1;

    /* On preview click */
    const handleClick = () => {
        if (clicked) return;

        setClicked(true);
        setCurrent(nextIndex);
    };

    /* ============= Transition Fix ============= */
    useGSAP(
        () => {
            if (!clicked) return;

            const tl = gsap.timeline({
                defaults: { ease: "power2.out" },
                onStart: () => transitionRef.current?.play(),
                onComplete: () => {
                    gsap.set("#mini-box", { autoAlpha: 0 });
                    setClicked(false);
                },
            });

            gsap.set("#transition-video", {
                autoAlpha: 1,
                scale: isMobile ? 1 : 0.2,
                visibility: "visible",
            });

            tl.to("#transition-video", {
                scale: 1,
                duration: 1,
            });

            tl.to(
                "#mini-box",
                {
                    autoAlpha: 0,
                    scale: 0.4,
                    duration: 0.6,
                },
                0
            );
        },
        { dependencies: [current] }
    );

    /* Disable clip-path on mobile */
    useGSAP(() => {
        if (isMobile) return;

        gsap.set("#video-frame", {
            clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
            borderRadius: "0% 0% 40% 10%",
        });

        gsap.from("#video-frame", {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: "#video-frame",
                start: "center",
                end: "bottom center",
                scrub: true,
            },
        });
    });

    const src = (i) => `videos/hero-${i}.mp4`;

    return (
        <div className="relative h-dvh w-screen overflow-x-hidden">

            {/* LOADER */}
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                </div>
            )}

            <div
                id="video-frame"
                className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
            >
                {/* Background current video */}
                <video
                    src={src(current)}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 size-full object-cover"
                    onLoadedData={handleLoad}
                />

                {/* Transition video */}
                <video
                    ref={transitionRef}
                    id="transition-video"
                    src={src(current)}
                    loop
                    muted
                    playsInline
                    className="absolute-center invisible absolute z-20 size-full object-cover"
                    onLoadedData={handleLoad}
                />

                {/* Mini preview */}
                <div
                    id="mini-box"
                    className="absolute-center absolute z-40 size-64 cursor-pointer overflow-hidden rounded-xl"
                    onClick={handleClick}
                >
                    <VideoPreview>
                        <video
                            ref={previewRef}
                            src={src(nextIndex)}
                            loop
                            muted
                            playsInline
                            className="size-full object-cover"
                            onLoadedData={handleLoad}
                        />
                    </VideoPreview>
                </div>

                {/* TEXT */}
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

            <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
                G<b>A</b>MING
            </h1>
        </div>
    );
};

export default Hero;
