import { Avatar } from "@readyplayerme/visage";
import hi_animation from "./assets/Hi_animation.fbx";

const modelSrc = "https://readyplayerme.github.io/visage/male.glb";

export function RTAvatar(props: { activeAnimation?: string }) {
    const { activeAnimation } = props;
    const onAnimationEnd = () => {
        console.log("Animation ended");
    };
    return (
        <Avatar
            modelSrc={modelSrc}
            activeAnimation={activeAnimation}
            animations={{
                hi: {
                    source: hi_animation,
                    repeat: 1
                }
            }}
            onAnimationEnd={onAnimationEnd}
        />
    );
}
