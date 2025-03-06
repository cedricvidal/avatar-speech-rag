import { Html, OrbitControls, Preload, useAnimations, useGLTF, useFBX } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { AnimationMixer } from "three";
import { act, Suspense, useEffect, useRef, useState } from "react";
import { MyLoader } from "./MyLoader";
import hi_animation_url from "@/assets/Hi_animation.fbx";
import myavatar_url from "@/assets/myavatar.glb";

const Avatar = () => {
    const [index, setIndex] = useState(0);
    //const { scene } = useGLTF("https://readyplayerme.github.io/visage/male.glb");

    const { scene, animations } = useGLTF(myavatar_url);
    //    const hi_animation_fbx = useFBX(hi_animation_url);
    //    const male_idle_fbx = useGLTF("https://readyplayerme.github.io/visage/male-idle.glb");

    //    const { actions, clips, names } = useAnimations([...hi_animation_fbx.animations, ...male_idle_fbx.animations]);
    const { actions, clips, names } = useAnimations(animations);

    const clips_by_name = Object.fromEntries(clips.map(clip => [clip.name, clip]));
    const [isClicked, setIsClicked] = useState(false);
    const armatureMixerRef = useRef<AnimationMixer | null>(null);

    useEffect(() => {
        if (scene) {
            const armatureMixer = new AnimationMixer(scene);
            armatureMixerRef.current = armatureMixer;
        }

        return () => {
            armatureMixerRef.current?.stopAllAction();
            armatureMixerRef.current?.uncacheRoot(scene);
            armatureMixerRef.current = null;
        };
    }, [scene]);

    useEffect(() => {
        const mixer = armatureMixerRef.current;
        const actionName = names[index];
        const clip = clips_by_name[actionName];

        console.log("index", index);
        console.log("names", names);
        console.log("actions", actions);
        console.log("clips", clips_by_name);
        console.log("actionName", actionName);
        console.log("clip", clip);
        if (!clip || !mixer) return;
        const action = mixer.clipAction(clip);
        console.log("action", action);

        console.log("play action", actionName);
        action.reset().fadeIn(0.5).play();
        console.log("play action", actionName);

        return () => {
            console.log("stop all action");
            action.fadeOut(0.5);

            armatureMixerRef.current?.stopAllAction();
            armatureMixerRef.current?.uncacheRoot(scene);
            armatureMixerRef.current = null;
        };
    }, [index, actions, names]);

    //    useFrame((state, delta) => {
    //        armatureMixerRef.current?.update(delta);
    //    });

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
                <Avatar />
            </Suspense>
            <Preload all />
        </Canvas>
    );
};
