import AnimatedTitle from "./AnimatedTitle";
import Button from "./Button";

const ImageClipBox = ({ src, clipClass }) => (
    <div className={clipClass}>
        <img src={src} alt="img" className="w-full h-auto" />
    </div>
);

const Contact = () => {
    return (
        <div
            id="contact"
            className="
                w-screen
                max-w-full
                min-h-screen
                px-4 sm:px-8 md:px-12 lg:px-20
                py-20
                flex justify-center
            "
        >
            <div
                className="
                    relative
                    w-full max-w-[1600px]
                    rounded-2xl
                    bg-black
                    py-24
                    px-6 sm:px-10 lg:px-16
                    text-blue-50
                    overflow-hidden
                    border border-white/10
                    shadow-[0_0_40px_rgba(0,0,0,0.45)]
                "
            >
                {/* LEFT FLOATING IMAGES */}
                <div
                    className="
                        absolute -left-24 top-0 hidden sm:block
                        h-full w-72 lg:w-96
                        overflow-visible
                    "
                >
                    <ImageClipBox
                        src="/img/contact-1.webp"
                        clipClass="contact-clip-path-1"
                    />
                    <ImageClipBox
                        src="/img/contact-2.webp"
                        clipClass="contact-clip-path-2 translate-y-60 lg:translate-y-40"
                    />
                </div>

                {/* RIGHT CHARACTER */}
                <div
                    className="
                        absolute left-10 sm:left-auto
                        -top-40 sm:top-1/2
                        md:right-10
                        lg:top-20
                        w-52 sm:w-60 lg:w-80
                    "
                >
                    <ImageClipBox
                        src="/img/swordman-partial.webp"
                        clipClass="absolute md:scale-125"
                    />
                    <ImageClipBox
                        src="/img/swordman.webp"
                        clipClass="sword-man-clip-path md:scale-125"
                    />
                </div>

                {/* CENTER TEXT */}
                <div className="flex flex-col items-center text-center relative z-10">
                    <p className="mb-10 font-general text-[10px] uppercase tracking-wider">
                        Join Zentry
                    </p>

                    <AnimatedTitle
                        title="let&#39;s b<b>u</b>ild the <br /> new era of <br /> g<b>a</b>ming t<b>o</b>gether."
                        className="
                            special-font
                            w-full font-zentry
                            !font-black
                            !leading-[0.9]
                            !text-4xl sm:!text-5xl md:!text-[5rem] lg:!text-[6rem]
                        "
                    />

                    <Button
                        title="contact us"
                        containerClass="
                            mt-10 cursor-pointer
                        "
                    />
                </div>
            </div>
        </div>
    );
};

export default Contact;
