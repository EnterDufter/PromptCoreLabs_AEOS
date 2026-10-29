import React, { useState } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { WhisperService } from '../../services/audio/whisperService';

interface VoiceRecorderButtonProps {
  onTranscriptionComplete: (text: string) => void;
}

export const VoiceRecorderButton: React.FC<VoiceRecorderButtonProps> = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const handleToggleRecord = async () => {
    if (isRecording) {
      setIsRecording(false);
      setIsTranscribing(true);
      const text = await WhisperService.stopRecordingAndTranscribe();
      setIsTranscribing(false);
      onTranscriptionComplete(text);
    } else {
      await WhisperService.startRecording();
      setIsRecording(true);
    }
  };

  return (
    <button
      onClick={handleToggleRecord}
      disabled={isTranscribing}
      className={`p-2 rounded-lg transition flex items-center space-x-1 ${
        isRecording
          ? 'bg-rose-500 text-white animate-pulse'
          : isTranscribing
          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
      }`}
      title={isRecording ? 'Parar gravação e transcrever via Whisper WASM Local' : 'Gravar áudio com transcrição open-source local'}
    >
      {isTranscribing ? (
        <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
      ) : isRecording ? (
        <MicOff className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
};
