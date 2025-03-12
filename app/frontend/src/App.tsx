import { useState } from "react";
import { useTranslation } from "react-i18next";

import useRealTime from "@/hooks/useRealtime";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import useAudioPlayer from "@/hooks/useAudioPlayer";

import { GroundingFile, ToolResult } from "./types";

import { AvatarCanvas } from "./components/avatar/Avatar";
import { weatherTool } from "@/tools/weather";
import { animateTool } from "@/tools/animate";
import { stopAnimate } from "./tools/stopAnimate";

import { Mic, MicOff } from "lucide-react";
import StatusMessage from "@/components/ui/status-message";

function App() {
    const [isRecording, setIsRecording] = useState(false);
    const [activeAnimation, setActiveAnimation] = useState<string | undefined>(undefined);

    const { startSession, addUserAudio, inputAudioBufferClear } = useRealTime({
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
            animateTool(animation => {
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

    const { t } = useTranslation();

    return (
        <div className="App">
            <h1 className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent md:text-7xl">{t("app.title")}</h1>
            <main className="h-screen w-full bg-black">
                <AvatarCanvas animation={activeAnimation} />
            </main>
            <div>
                <button
                    className="bg-theme w-[100px] rounded-lg p-2 text-xs text-black duration-500 hover:scale-110 hover:bg-white sm:w-[200px] sm:text-lg"
                    onClick={onToggleListening}
                >
                    {isRecording ? (
                        <>
                            <MicOff className="mr-2 h-6 w-6 text-white" />
                        </>
                    ) : (
                        <>
                            <Mic className="mr-2 h-6 w-6 text-white" />
                        </>
                    )}
                </button>
                <StatusMessage isRecording={isRecording} />
            </div>

            <footer className="py-4 text-center text-white">
                <p>{t("app.footer")}</p>
            </footer>
        </div>
    );
}

export default App;
