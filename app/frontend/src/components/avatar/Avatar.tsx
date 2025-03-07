import { Html, OrbitControls, Preload, useAnimations, useGLTF, useFBX, Environment, SpotLight } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { act, Suspense, useEffect, useRef, useState } from "react";
import { MyLoader } from "./MyLoader";
import myavatar_url from "@/assets/cedric-yellow-pullover-animated.glb";
import { Mic, MicOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import StatusMessage from "@/components/ui/status-message";
import { LoopOnce } from "three";

type Props = {
    animation?: string;
    onToggleListening?: () => void;
    isListening: boolean;
};

const Avatar = ({ animation, onToggleListening, isListening }: Props) => {
    const { scene, animations } = useGLTF(myavatar_url);
    const { actions, names } = useAnimations(animations, scene);

    useEffect(() => {
        console.log("names", names);
        if (animation) {
            console.log("animation changed", animation);
            actions[animation]?.reset().fadeIn(0.5).setLoop(LoopOnce, 1).play();
            console.log("animation done", animation);
        }

        return () => {
            if (animation) {
                console.log("animation fadeOut callback", animation);
                actions[animation]?.fadeOut(0.5);
            }
        };
    }, [actions, names, animation]);

    const { t } = useTranslation();

    return (
        <group>
            <primitive object={scene} scale={2} position-y={-2} rotation-y={-0.5} position-x={[-1]} />

            <Html position={[-3, 3, 0]}>
                <h1 className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent md:text-7xl">
                    {t("app.title")}
                </h1>
                <button
                    className="bg-theme w-[100px] rounded-lg p-2 text-xs text-black duration-500 hover:scale-110 hover:bg-white sm:w-[200px] sm:text-lg"
                    onClick={onToggleListening}
                >
                    {isListening ? (
                        <>
                            <MicOff className="mr-2 h-6 w-6 text-white" />
                        </>
                    ) : (
                        <>
                            <Mic className="mr-2 h-6 w-6 text-white" />
                        </>
                    )}
                </button>
                <StatusMessage isRecording={isListening} />
            </Html>
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
