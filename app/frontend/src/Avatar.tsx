import { Avatar } from "@readyplayerme/visage";
import hi_animation from "./assets/Hi_animation.fbx";

const modelSrc = "https://readyplayerme.github.io/visage/male.glb";

export function RTAvatar() {
    return <Avatar modelSrc={modelSrc} animationSrc={hi_animation} />;
}
