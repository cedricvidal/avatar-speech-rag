import { useState } from "react";
import { useTranslation } from "react-i18next";

import useRealTime from "@/hooks/useRealtime";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import useAudioPlayer from "@/hooks/useAudioPlayer";

import { GroundingFile, ToolResult } from "./types";

import { AvatarCanvas } from "./components/avatar/Avatar";
import { weatherTool } from "@/tools/weather";
import { moveTool } from "@/tools/move";
import { stopAnimate } from "./tools/stopAnimate";

import StatusMessage from "@/components/ui/status-message";
import RecordingButton from "@/components/ui/recording-button";

function App() {
    const [isRecording, setIsRecording] = useState(false);
    const [activeAnimation, setActiveAnimation] = useState<string | undefined>(undefined);

    const { startSession, addUserAudio, inputAudioBufferClear, sendJsonMessage } = useRealTime({
        onWebSocketOpen: () => console.log("WebSocket connection opened"),
        onWebSocketClose: () => console.log("WebSocket connection closed"),
        onWebSocketError: event => console.error("WebSocket error:", event),
        onReceivedError: message => console.error("error", message),
        onReceivedResponseAudioDelta: message => {
            isRecording && playAudio(message.delta);
        },
        onReceivedInputAudioBufferSpeechStarted: () => {
            stopAudioPlayer();
        },
        onReceivedExtensionMiddleTierToolResponse: message => {
            const result: ToolResult = JSON.parse(message.tool_result);

            const files: GroundingFile[] = result.sources.map(x => {
                return { id: x.chunk_id, name: x.title, content: x.chunk };
            });

            console.log("Received grounding files", files);
        },
        onReceivedAudioTranscriptionDone: message => {
            const { event_id, item_id, content_index, transcript } = message;
            console.log("Transcription done", { event_id, item_id, content_index, transcript });
        },
        tools: [
            weatherTool,
            moveTool(animation => {
                console.log("Set active animation", animation);
                setActiveAnimation(animation);
            }),
            stopAnimate(() => {
                console.log("Stop animation");
                setActiveAnimation(undefined);
            })
        ]
    });

    const { reset: resetAudioPlayer, play: playAudio, stop: stopAudioPlayer } = useAudioPlayer();
    const { start: startAudioRecording, stop: stopAudioRecording } = useAudioRecorder({ onAudioRecorded: addUserAudio });

    const onToggleListening = async () => {
        if (!isRecording) {
            startSession();
            await startAudioRecording();
            resetAudioPlayer();

            setIsRecording(true);
        } else {
            await stopAudioRecording();
            stopAudioPlayer();
            inputAudioBufferClear();

            setIsRecording(false);
        }
    };

    const onAnimationComplete = (animation: string) => {
        console.log("Animation completed", animation);
        //sendJsonMessage({
        //    type: "conversation.item.create",
        //    item: {
        //        type: "message",
        //        content: [
        //            {
        //                type: "text",
        //                content: "Animation completed: " + animation
        //            }
        //        ]
        //    }
        //});
    };

    const { t } = useTranslation();

    return (
        <div className="App relative min-h-screen w-full">
            {/* Overlay content */}
            <div className="absolute inset-0 flex flex-col items-center">
                <h1 className="z-10 mt-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent md:text-7xl">
                    {t("app.title")}
                </h1>

                <div className="flex-1"></div>

                {/* Controls at the bottom */}
                <div className="z-10 mb-20 flex flex-col items-center">
                    <RecordingButton isRecording={isRecording} onToggleListening={onToggleListening} />
                    <StatusMessage isRecording={isRecording} />
                </div>
            </div>

            <main className="h-screen w-full bg-black">
                <AvatarCanvas animation={activeAnimation} onAnimationComplete={onAnimationComplete} />
            </main>

            <footer className="absolute bottom-0 z-10 w-full py-4 text-center text-white">
                <p>{t("app.footer")}</p>
            </footer>
        </div>
    );
}

export default App;
