import { Html, OrbitControls, Preload, useAnimations, useGLTF, useFBX } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { AnimationMixer } from "three";
import { Suspense, useEffect, useRef, useState } from "react";
import { MyLoader } from "./MyLoader";
import hi_animation_url from "@/assets/Hi_animation.fbx";

const Avatar = () => {
    const [index, setIndex] = useState(1);
    const { scene } = useGLTF("https://readyplayerme.github.io/visage/male.glb");
    const { actions, names } = useAnimations([hi_animation_url]);
    const [isClicked, setIsClicked] = useState(false);
    const armatureMixerRef = useRef<AnimationMixer | null>(null);
    useEffect(() => {
        const armatureMixer = new AnimationMixer(scene);
        armatureMixerRef.current = armatureMixer;

        actions[names[index]]?.reset().fadeIn(0.5).play();

        return () => {
            actions[names[index]]?.fadeOut(0.5);
        };
    }, [index, actions, names, scene]);

    return (
        <group>
            <primitive object={scene} scale={2} position-y={-2} rotation-y={-0.5} position-x={[-1]} />

            <Html position={[-3.7, 0.3, 0]}>
                <button
                    className="bg-theme w-[100px] rounded-lg p-2 text-xs text-black duration-500 hover:scale-110 hover:bg-white sm:w-[200px] sm:text-lg"
                    onClick={() => {
                        setIndex((index + 1) % names.length);
                        setIsClicked(!isClicked);
                    }}
                >
                    {isClicked ? "Check out my moves" : "Impress Me!"}
                </button>
            </Html>
        </group>
    );
};

export const AvatarCanvas = (props: { activeAnimation?: string }) => {
    const { activeAnimation } = props;
    return (
        <Canvas dpr={[0, 2]}>
            <ambientLight intensity={0.5} />
            <pointLight position={[1, 1, 1]} />
            <OrbitControls enabled={true} />
            <Suspense fallback={<MyLoader />}>
                <Avatar />
            </Suspense>
            <Preload all />
        </Canvas>
    );
};
