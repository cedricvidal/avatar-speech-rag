import { makeTool } from "./tool";
import { Tool } from "@/types";

const schema = {
    type: "function",
    name: "stop_avatar_animation",
    description: "The avatar is the embodiement of the AI. This function allows to stop any ongoing animation.",
    parameters: {
        type: "object",
        properties: {},
        additionalProperties: false
    }
};

export function stopAnimate(handler: () => void): Tool {
    return makeTool(schema, async () => {
        console.log("Stop animate");
        handler();
        return {};
    });
}
