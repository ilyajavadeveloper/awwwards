import { useState, useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";

/* ===========================
   BENTO TILT (3D Hover)
=========================== */
export const BentoTilt = ({ children, className = "" }) => {
    const [transformStyle, setTransformStyle] = useState("");
    const itemRef = useRef(null);

    const handleMouseMove = (event) => {
        if (!itemRef.current) return;

        const { left, top, width, height } = itemRef.current.getBoundingClientRect();

        const x = (event.clientX - left) / width;
        const y = (event.clientY - top) / height;

        const tiltX = (y - 0.5) * 6;
        const tiltY = (x - 0.5) * -6;

        setTransformStyle(
            `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.96,.96,.96)`
        );
    };

    const handleMouseLeave = () => setTransformStyle("");

    return (
        <div
            ref={itemRef}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transform: transformStyle }}
        >
            {children}
        </div>
    );
};

/* ===========================
   BENTO CARD
=========================== */
export const BentoCard = ({ src, title, description, isComingSoon }) => {
    const [cursor, setCursor] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);
    const hoverRef = useRef(null);

    const handleMove = (e) => {
        if (!hoverRef.current) return;
        const rect = hoverRef.current.getBoundingClientRect();

        setCursor({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div className="relative w-full h-full">
            <video
                src={src}
                muted
                loop
                autoPlay
                className="absolute inset-0 w-full h-full object-contain bg-black"
            />

            <div className="relative z-10 flex h-full flex-col justify-between p-6 text-blue-50">
                <div>
                    <h1 className="bento-title special-font text-4xl md:text-5xl lg:text-6xl">
                        {title}
                    </h1>

                    {description && (
                        <p className="mt-3 max-w-64 text-xs md:text-base opacity-80">
                            {description}
                        </p>
                    )}
                </div>

                {isComingSoon && (
                    <div
                        ref={hoverRef}
                        onMouseMove={handleMove}
                        onMouseEnter={() => setOpacity(1)}
                        onMouseLeave={() => setOpacity(0)}
                        className="relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black/80 px-5 py-2 text-xs uppercase text-white/40 border border-white/10"
                    >
                        <div
                            className="pointer-events-none absolute -inset-px transition duration-300"
                            style={{
                                opacity,
                                background: `radial-gradient(120px circle at ${cursor.x}px ${cursor.y}px, #8a92ff66, transparent)`,
                            }}
                        />
                        <TiLocationArrow className="relative z-20" />
                        <p className="relative z-20">coming soon</p>
                    </div>
                )}
            </div>
        </div>
    );
};

/* ===========================
   FULL FEATURES SECTION (UPDATED)
=========================== */
const Features = () => (
    <section className="bg-black pb-52">
        <div className="container mx-auto px-4 md:px-10">

            {/* TOP TEXT */}
            <div className="px-5 py-28">
                <p className="font-circular-web text-lg text-blue-50">
                    Into the Metagame Layer
                </p>
                <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
                    Immerse yourself in a rich and expanding universe where products converge
                    into an interconnected overlay on your world.
                </p>
            </div>

            {/* MAIN BIG CARD */}
            <BentoTilt className="
                relative mb-10 overflow-hidden rounded-2xl border border-white/10
                bg-black/20 backdrop-blur-xl
                h-[420px] md:h-[70vh] lg:h-[75vh] xl:h-[82vh]
                transition-all duration-300
            ">
                <BentoCard
                    src="videos/feature-1.mp4"
                    title={<>radia<b>n</b>t</>}
                    description="A cross-platform metagame app turning your activities into a rewarding adventure."
                    isComingSoon
                />
            </BentoTilt>

            {/* GRID WITHOUT COMING SOON */}
            <div className="
                grid w-full gap-7
                grid-cols-1 md:grid-cols-2
                auto-rows-[420px] md:auto-rows-[55vh] lg:auto-rows-[60vh]
            ">

                <BentoTilt className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl">
                    <BentoCard
                        src="videos/feature-2.mp4"
                        title={<>zig<b>m</b>a</>}
                        description="Anime & gaming inspired IP ready for expansion."
                        isComingSoon
                    />
                </BentoTilt>

                <BentoTilt className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl">
                    <BentoCard
                        src="videos/feature-3.mp4"
                        title={<>n<b>e</b>xus</>}
                        description="A gamified social hub adding new layers of play."
                        isComingSoon
                    />
                </BentoTilt>

                <BentoTilt className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl">
                    <BentoCard
                        src="videos/feature-4.mp4"
                        title={<>az<b>u</b>l</>}
                        description="A cross-world AI Agent enhancing your gameplay."
                        isComingSoon
                    />
                </BentoTilt>

                {/* LAST VIDEO */}
                <BentoTilt className="relative overflow-hidden rounded-2xl border border-white/10 bg-black">
                    <video
                        src="videos/feature-5.mp4"
                        autoPlay
                        muted
                        loop
                        className="absolute inset-0 w-full h-full object-contain bg-black"
                    />
                </BentoTilt>
            </div>
        </div>
    </section>
);

export default Features;
