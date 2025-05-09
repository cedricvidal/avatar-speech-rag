import { makeTool } from "./tool";
import { Tool } from "@/types";

const schema = {
    type: "function",
    name: "show_qrcode",
    description: "Show the project's URL QR code to the user. This function allows to show a QR code to the user.",
    parameters: {
        type: "object",
        properties: {},
        additionalProperties: false
    }
};

export function showQrCode(handler: () => void): Tool {
    return makeTool(schema, async () => {
        console.log("Show qrcode");
        handler();
        return {
            feedback: "QR Code shown"
        };
    });
}
