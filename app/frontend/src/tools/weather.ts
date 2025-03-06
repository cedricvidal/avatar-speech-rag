import { makeTool } from "./tool";

const weatherToolSchema = {
    type: "function",
    name: "get_weather",
    description: "Gets the weather for a given location",
    parameters: {
        type: "object",
        properties: {
            location: {
                type: "string",
                description: "Location to get the weather for"
            }
        },
        required: ["location"],
        additionalProperties: false
    }
};

async function getWeather(location: string): Promise<object> {
    return {
        temperature: "20°C",
        condition: "Sunny",
        location: location
    };
}

export const weatherTool = makeTool(weatherToolSchema, getWeather);
