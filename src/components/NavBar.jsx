import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./Button";

const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];

const NavBar = () => {
    const [isAudioPlaying, setIsAudioPlaying] = useState(false);
    const [isIndicatorActive, setIsIndicatorActive] = useState(false);

    const audioRef = useRef(null);
    const navRef = useRef(null);

    const { y: scrollY } = useWindowScroll();
    const [isVisible, setIsVisible] = useState(true);
    const [lastY, setLastY] = useState(0);

    /* ==============================
       DIRECT AUDIO PLAY/PAUSE FIX
       REQUIRED BY BROWSER POLICIES
    =============================== */
    const toggleAudio = () => {
        const audio = audioRef.current;

        if (!audio) return;

        if (!isAudioPlaying) {
            audio
                .play()
                .then(() => {
                    setIsAudioPlaying(true);
                    setIsIndicatorActive(true);
                })
                .catch((err) => {
                    console.warn("Audio blocked:", err);
                });
        } else {
            audio.pause();
            setIsAudioPlaying(false);
            setIsIndicatorActive(false);
        }
    };

    /* ==============================
       NAVBAR VISIBILITY ON SCROLL
    =============================== */
    useEffect(() => {
        if (scrollY === 0) {
            setIsVisible(true);
            navRef.current?.classList.remove("floating-nav");
        } else if (scrollY > lastY) {
            setIsVisible(false);
            navRef.current?.classList.add("floating-nav");
        } else if (scrollY < lastY) {
            setIsVisible(true);
            navRef.current?.classList.add("floating-nav");
        }
        setLastY(scrollY);
    }, [scrollY, lastY]);

    /* ==============================
       GSAP SHOW / HIDE ANIMATION
    =============================== */
    useEffect(() => {
        gsap.to(navRef.current, {
            y: isVisible ? 0 : -100,
            opacity: isVisible ? 1 : 0,
            duration: 0.25,
            ease: "power2.out",
        });
    }, [isVisible]);

    return (
        <div
            ref={navRef}
            className="fixed inset-x-0 top-4 z-50 h-16 transition-all duration-700 sm:inset-x-6"
        >
            <header className="absolute top-1/2 w-full -translate-y-1/2">
                <nav className="flex size-full items-center justify-between p-4">

                    {/* LEFT SIDE */}
                    <div className="flex items-center gap-7">
                        <img src="/img/logo.png" alt="logo" className="w-10" />

                        <Button
                            id="product-button"
                            title="Products"
                            rightIcon={<TiLocationArrow />}
                            containerClass="
                                bg-blue-50 md:flex hidden
                                items-center justify-center gap-1
                            "
                        />
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex h-full items-center">
                        {/* NAV LINKS */}
                        <div className="hidden md:block">
                            {navItems.map((item, i) => (
                                <a
                                    key={i}
                                    href={`#${item.toLowerCase()}`}
                                    className="nav-hover-btn"
                                >
                                    {item}
                                </a>
                            ))}
                        </div>

                        {/* AUDIO BTN */}
                        <button
                            onClick={toggleAudio}
                            className="ml-10 flex items-center space-x-0.5 group"
                        >
                            <audio
                                ref={audioRef}
                                src="/audio/loop.mp3"
                                className="hidden"
                                loop
                            />

                            {/* Animated bars */}
                            {[1, 2, 3, 4].map((bar) => (
                                <div
                                    key={bar}
                                    className={clsx("indicator-line", {
                                        active: isIndicatorActive,
                                    })}
                                    style={{
                                        animationDelay: `${bar * 0.12}s`,
                                    }}
                                />
                            ))}
                        </button>
                    </div>
                </nav>
            </header>
        </div>
    );
};

export default NavBar;
