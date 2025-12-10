import React, { useRef, useState } from 'react'

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [hasClicked, setHasClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadedVideos, setLoadedVideos] = useState(0);

    const totalVideos = 4; // ← Было 3, поэтому ломалась карусель
    const nextVideoRef = useRef(null);

    const handleVideoLoad = () => {
        setLoadedVideos(prev => prev + 1);
    };

    // Правильный карусельный индекс
    const upcomingVideoIndex = currentIndex === totalVideos ? 1 : currentIndex + 1;

    const handleMiniVdClick = () => {
        setCurrentIndex(upcomingVideoIndex);
    };

    const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

    return (
        <div className='relative h-dvh w-screen overflow-x-hidden'>
            <div id='video-frame' className='relative z-10 h-dvh w-screen overflow-x-hidden rounded-lg bg-blue-75'>
                <div>
                    {/* MINI VIDEO */}
                    <div
                        className='mask-clip-path absolute-center absolute z-50 size-100 cursor-pointer over rounded-lg'
                    >
                        <div
                            onClick={handleMiniVdClick}
                            className='origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100'
                        >
                            <video
                                ref={nextVideoRef}
                                src={getVideoSrc(upcomingVideoIndex)}
                                loop
                                muted={true}
                                id='current-video'
                                className='size-64 origin-center scale-150 object-cover object-center'
                                onLoadedData={handleVideoLoad}
                            />
                        </div>
                    </div>

                    {/* PRELOAD NEXT VIDEO */}
                    <video
                        src={getVideoSrc(upcomingVideoIndex)}
                        loop
                        muted
                        id='next-video'
                        className='absolute-center invisible absolute z-20 size-64 object-cover object-center'
                        onLoadedData={handleVideoLoad}
                    />

                    {/* MAIN VIDEO */}
                    <video
                        src={getVideoSrc(currentIndex)}
                        autoPlay={true}
                        loop
                        muted={true}
                        className='absolute left-0 top-0 size-full object-cover object-center'
                        onLoadedData={handleVideoLoad}
                    />
                </div>

                {/* TEXT */}
                <h1 className='special-font hero-heading absolute-5 bottom-5 right-5 text-blue-75'>
                    G<b>a</b>ming
                </h1>

                <div className='absolute left-0 top-0 size-full'>
                    <div className='mt-24 px-5 sm:px-10'>
                        <h1 className='special-font hero-heading text-blue-100'>
                            redefi<b>n</b>e
                        </h1>
                    </div>

                    <div className="mt-3 px-5 sm:px-10">
                        <p className="font-robert-regular text-blue-100/90 leading-tight tracking-wide">
                            Enter the Metagame Layer
                            <span className="block text-blue-100/60">Unleash the Play Economy</span>
                        </p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Hero;
