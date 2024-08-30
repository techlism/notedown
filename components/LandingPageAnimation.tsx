"use client";
import { Player } from "@lottiefiles/react-lottie-player";
export default function LandingPageAnimation() {
    return (
        <Player
        autoplay
        loop
        src="https://lottie.host/f2db6d67-b8d0-4285-90d2-86440c48c776/4aNl89r1AN.json"
        className="max-w-full h-[100px] md:h-[250px] lg:h-[350px] xl:h-[450px] 2xl:h-[550px]"
        style={{ backgroundColor: 'transparent', width: '100%', height: '100%' }}
        />
        
    );
}