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
    const [index, setIndex] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loaded, setLoaded] = useState(0);

    const previewRef = useRef(null);
    const transitionRef = useRef(null);
    const bgRef = useRef(null);
    const circleRef = useRef(null);

    const getSrc = (i) => `videos/hero-${i}.mp4`;

    const handleLoad = () => setLoaded((p) => p + 1);

    useEffect(() => {
        if (loaded >= TOTAL) setLoading(false);
    }, [loaded]);

    const next = () => setIndex((p) => (p % TOTAL) + 1);

    /* ===============================
          CIRCLE → EXPAND TRANSITION
    ================================ */
    useGSAP(
        () => {
            const tl = gsap.timeline();

            gsap.set(circleRef.current, {
                scale: 0,
                visibility: "visible",
            });

            tl.to(circleRef.current, {
                scale: 20,
                ease: "power3.inOut",
                duration: 1.1,
                onStart: () => transitionRef.current?.play(),
            })
                .to(
                    bgRef.current,
                    {
                        opacity: 0,
                        duration: 0.3,
                        ease: "none",
                        onComplete: () => {
                            bgRef.current.src = getSrc(index);
                            bgRef.current.play();
                        },
                    },
                    0.2
                )
                .to(
                    bgRef.current,
                    {
                        opacity: 1,
                        duration: 0.4,
                        ease: "none",
                    },
                    0.4
                )
                .to(
                    circleRef.current,
                    {
                        scale: 0,
                        duration: 0.8,
                        ease: "power3.inOut",
                    },
                    0.4
                );
        },
        {
            dependencies: [index],
            revertOnUpdate: true,
        }
    );

    /* ===============================
          FRAME MORPH ON SCROLL
    ================================ */
    useGSAP(() => {
        gsap.set("#frame", {
            clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
            borderRadius: "0% 0% 40% 10%",
        });

        gsap.from("#frame", {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            borderRadius: "0% 0% 0% 0%",
            ease: "power2.inOut",
            scrollTrigger: {
                trigger: "#frame",
                start: "center center",
                end: "bottom center",
                scrub: true,
            },
        });
    });

    return (
        <div className="relative h-dvh w-screen overflow-hidden">
            {/* LOADER */}
            {loading && (
                <div className="absolute inset-0 z-[100] flex-center bg-violet-50">
                    <div className="three-body">
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                        <div className="three-body__dot"></div>
                    </div>
                </div>
            )}

            {/* FRAME */}
            <div
                id="frame"
                className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
            >
                {/* MINI PREVIEW */}
                <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
                    <VideoPreview>
                        <div
                            onClick={next}
                            className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
                        >
                            <video
                                ref={previewRef}
                                src={getSrc((index % TOTAL) + 1)}
                                loop
                                muted
                                className="size-64 origin-center scale-150 object-cover"
                                onLoadedData={handleLoad}
                            />
                        </div>
                    </VideoPreview>
                </div>

                {/* CIRCLE TRANSITION */}
                <div
                    ref={circleRef}
                    className="absolute-center absolute z-30 size-40 rounded-full bg-white opacity-90"
                    style={{ visibility: "hidden" }}
                />

                {/* VIDEO FOR TRANSITION */}
                <video
                    ref={transitionRef}
                    src={getSrc(index)}
                    loop
                    muted
                    className="absolute-center invisible absolute z-20 size-64 object-cover"
                    onLoadedData={handleLoad}
                />

                {/* BACKGROUND VIDEO */}
                <video
                    ref={bgRef}
                    src={getSrc(index)}
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 size-full object-cover"
                    onLoadedData={handleLoad}
                />

                {/* TEXT */}
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

            {/* TEXT OUTLINE */}
            <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
                G<b>A</b>MING
            </h1>
        </div>
    );
};

export default Hero;
