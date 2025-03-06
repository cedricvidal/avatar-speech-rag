import { useState } from "react";
import { Avatar } from "@readyplayerme/visage";

const modelSrc = "https://readyplayerme.github.io/visage/male.glb";

export function RTAvatar(props: { animationSrc?: string }) {
    const { animationSrc } = props;
    return <Avatar modelSrc={modelSrc} animationSrc={animationSrc} />;
}
