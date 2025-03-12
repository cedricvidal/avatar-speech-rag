import { Html, OrbitControls, Preload, useAnimations, useGLTF, useFBX, Environment, SpotLight } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { act, Suspense, useEffect, useRef, useState } from "react";
import { MyLoader } from "./MyLoader";
import myavatar_url from "@/assets/cedric-yellow-pullover-animated.glb";
import { useTranslation } from "react-i18next";
import { LoopOnce, LoopRepeat } from "three";

type Props = {
    animation?: string;
};

const Avatar = ({ animation }: Props) => {
    const { scene, animations } = useGLTF(myavatar_url);
    const { actions, names } = useAnimations(animations, scene);

    useEffect(() => {
        console.log("names", names);

        if (animation) {
            console.log("animation changed", animation);
            actions[animation]?.reset().fadeIn(0.5).setLoop(LoopOnce, 1).play();
        }
        console.log("idle animation");
        actions["idle"]?.reset().fadeIn(0.5).setLoop(LoopRepeat, 100).play();

        return () => {
            if (animation) {
                console.log("animation fadeOut callback", animation);
                actions[animation]?.fadeOut(0.5);
            }
        };
    }, [actions, names, animation]);

    return (
        <group>
            <primitive object={scene} scale={2} position-y={-2} rotation-y={-0.5} position-x={[-1]} />
        </group>
    );
};

export const AvatarCanvas = (props: Props) => {
    return (
        <Canvas dpr={[0, 2]}>
            <SpotLight position={[0, 3, 3]} angle={0.5} opacity={0.5} />
            <ambientLight intensity={0.5} />
            <pointLight position={[1, 1, 1]} />
            <OrbitControls enabled={true} />
            <Suspense fallback={<MyLoader />}>
                <Avatar {...props} />
            </Suspense>
            <Environment preset="city" />
            <Preload all />
        </Canvas>
    );
};
