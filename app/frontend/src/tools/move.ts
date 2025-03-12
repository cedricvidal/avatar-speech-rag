import { makeTool } from "./tool";
import { Tool } from "@/types";

const schema = {
    type: "function",
    name: "move_body",
    description:
        "The body is the embodiement of the AI. This function allows to move the AI's body with one of the available moves supported by the avatar body.",
    parameters: {
        type: "object",
        properties: {
            name: {
                type: "string",
                description: "Name of the move",
                enum: ["clap", "point", "dance", "happy", "sad", "idle", "point-left", "point-right", "wave"]
            }
        },
        required: ["location"],
        additionalProperties: false
    }
};

export function moveTool(handler: (animation: string) => void): Tool {
    return makeTool(schema, async ({ name: animation }) => {
        console.log("Animation tool called", animation);
        handler(animation);
        return {
            result: "Body feedback: move " + animation + " started"
        };
    });
}
