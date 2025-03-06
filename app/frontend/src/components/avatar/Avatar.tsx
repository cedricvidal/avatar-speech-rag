import { Html, OrbitControls, Preload, useAnimations, useGLTF, useFBX } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimationMixer } from "three";
import { act, Suspense, useEffect, useRef, useState } from "react";
import { MyLoader } from "./MyLoader";
import hi_animation_url from "@/assets/Hi_animation.fbx";
import myavatar_url from "@/assets/myavatar.glb";

const Avatar = ({ animation }: { animation?: string }) => {
    const { scene, animations } = useGLTF(myavatar_url);
    const { actions, names } = useAnimations(animations, scene);

    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        console.log("names", names);
        if (animation) {
            console.log("animation changed", animation);
            actions[animation]?.reset().fadeIn(0.5).play();
        }

        return () => {
            if (animation) {
                actions[animation]?.fadeOut(0.5);
            }
        };
    }, [actions, names, animation]);

    return (
        <group>
            <primitive object={scene} scale={2} position-y={-2} rotation-y={-0.5} position-x={[-1]} />

            <Html position={[-3.7, 0.3, 0]}>
                <button
                    className="bg-theme w-[100px] rounded-lg p-2 text-xs text-black duration-500 hover:scale-110 hover:bg-white sm:w-[200px] sm:text-lg"
                    onClick={() => {
                        console.log("next animation");
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
                <Avatar animation={activeAnimation} />
            </Suspense>
            <Preload all />
        </Canvas>
    );
};
