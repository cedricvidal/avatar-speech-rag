import { Tool } from "@/hooks/useRealtime";

export function makeTool(schema: any, target: (input: any) => Promise<any>): Tool {
    return {
        schema,
        target
    };
}
