import { makeTool } from "./tool";
import { Avatar } from "@/components/avatar/Avatar";
import { Tool } from "@/types";

const schema = {
    type: "function",
    name: "hi_animation",
    description: "Animates the avatar to wave hi",
    parameters: {
        type: "object",
        properties: {},
        additionalProperties: false
    }
};

export function hiTool(handler: () => void): Tool {
    return makeTool(schema, async () => {
        console.log("hi animation");
        handler();
        return {};
    });
}
