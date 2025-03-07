import { makeTool } from "./tool";
import { Tool } from "@/types";

const schema = {
    type: "function",
    name: "play_avatar_animation",
    description:
        "The avatar is the embodiement of the AI. This function allows to animate the avatar with one of the available animations supported by the avatar body.",
    parameters: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "Name of the animation to play",
                enum: ["clap", "point", "dance", "happy", "sad", "idle", "point-left", "point-right", "wave"]
            }
        },
        required: ["location"],
        additionalProperties: false
    }
};

export function animateTool(handler: (animation: string) => void): Tool {
    return makeTool(schema, async ({ name: animation }) => {
        console.log("Animation tool called", animation);
        handler(animation);
        return {
            result: "Here was my " + animation + " move, what do you think abou it?"
        };
    });
}
