import { Html, OrbitControls, Preload, useAnimations, useGLTF, useFBX, Environment, SpotLight } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { act, Suspense, useEffect, useRef, useState } from "react";
import { MyLoader } from "./MyLoader";
import myavatar_url from "@/assets/cedric-yellow-pullover-animated.glb";
import { useTranslation } from "react-i18next";
import { LoopOnce, LoopRepeat } from "three";
import { easing } from "maath";

type Props = {
    animation?: string;
    focusOnHead?: boolean;
};

const Avatar = ({ animation }: Props) => {
    const { scene, animations } = useGLTF(myavatar_url);
    const { actions, names, mixer } = useAnimations(animations, scene);
    const avatarMesh = useRef();
    const [isAnimating, setIsAnimating] = useState(false);

    useFrame(({ clock }, delta) => {
        //avatarMesh.current.rotation.y = clock.elapsedTime;
        //easing.damp3(avatarMesh.current.position, [0, 0, 0], 0.25, delta);
    });

    useEffect(() => {
        console.log("names", names);

        // Event listener for animation completion
        const onFinished = e => {
            if (animation && e.action.getClip().name === animation) {
                console.log("finished");
                setIsAnimating(false);
            }
        };

        mixer.addEventListener("finished", onFinished);

        if (animation) {
            console.log("animation changed", animation);
            setIsAnimating(true);
            actions[animation]?.reset().fadeIn(0.5).setLoop(LoopOnce, 1).play();
        } else {
            setIsAnimating(false);
        }

        console.log("idle animation");
        actions["idle"]?.reset().fadeIn(0.5).setLoop(LoopRepeat, 100).play();

        return () => {
            mixer.removeEventListener("finished", onFinished);
            if (animation) {
                console.log("animation fadeOut callback", animation);
                actions[animation]?.fadeOut(0.5);
            }
        };
    }, [actions, names, animation, mixer]);

    const focusOnHead = !isAnimating;
    // Adjust position and scale based on focus area
    const scale = focusOnHead ? 8 : 2.5;
    const positionY = focusOnHead ? -12 : -2;

    // If there's no active animation or animation is finished, print "finished"
    useEffect(() => {
        if (!isAnimating && !animation) {
            console.log("finished");
        }
    }, [isAnimating, animation]);

    return (
        <group>
            <primitive ref={avatarMesh} object={scene} scale={scale} position-y={positionY} rotation-y={0.5} position-x={[0]} />
        </group>
    );
};

export const AvatarCanvas = (props: Props) => {
    return (
        <Canvas dpr={[0, 2]}>
            <SpotLight position={[0, 3, 3]} angle={0.5} opacity={0.5} />
            <ambientLight intensity={0.5} />
            <pointLight position={[1, 1, 1]} />
            <OrbitControls enabled={true} target={[0, props.focusOnHead ? 1 : 0, 0]} />
            <Suspense fallback={<MyLoader />}>
                <Avatar {...props} />
            </Suspense>
            <Environment preset="city" />
            <Preload all />
        </Canvas>
    );
};
