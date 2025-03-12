import { makeTool } from "./tool";
import { Tool } from "@/types";

const schema = {
    type: "function",
    name: "hide_qrcode",
    description: "Hide the project URL's QR code",
    parameters: {
        type: "object",
        properties: {},
        additionalProperties: false
    }
};

export function hideQrCode(handler: () => void): Tool {
    return makeTool(schema, async () => {
        console.log("Hide qrcode");
        handler();
        return {
            feedback: "QR Code hidden"
        };
    });
}
