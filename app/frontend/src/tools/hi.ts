import { makeTool } from "./tool";

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

async function implementation(location: string): Promise<object> {
    console.log("hi animation");
    return {};
}

export const hiTool = makeTool(schema, implementation);
