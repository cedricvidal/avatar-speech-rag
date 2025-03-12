import { Mic, MicOff } from "lucide-react";

interface RecordingButtonProps {
    isRecording: boolean;
    onToggleListening: () => void;
}

const RecordingButton = ({ isRecording, onToggleListening }: RecordingButtonProps) => {
    return (
        <button className="bg-theme rounded-lg p-2 text-xs text-black duration-500 hover:scale-110 hover:bg-white sm:text-lg" onClick={onToggleListening}>
            {isRecording ? <MicOff className="mr-2 h-6 w-6 text-white" /> : <Mic className="mr-2 h-6 w-6 text-white" />}
        </button>
    );
};

export default RecordingButton;
