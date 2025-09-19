import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
}

interface VideoTileProps {
  participant: Participant;
  isLocal?: boolean;
  className?: string;
}

export const VideoTile = ({ participant, isLocal = false, className }: VideoTileProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideoError, setHasVideoError] = useState(false);

  useEffect(() => {
    let playPromise: Promise<void> | undefined;
    
    if (participant.stream && videoRef.current && !participant.isVideoOff) {
      // Store the current stream to avoid race conditions
      const currentStream = participant.stream;
      videoRef.current.srcObject = currentStream;
      
      // Handle play as a Promise
      playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Only set error if this is still the current stream
          if (videoRef.current?.srcObject === currentStream) {
            console.error('Error playing video:', error);
            setHasVideoError(true);
          }
        });
      }
    }
    
    // Cleanup function
    return () => {
      // If there's an ongoing play promise and we're unmounting/updating,
      // we don't need to handle its result anymore
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Intentionally empty to avoid unhandled rejection
        });
      }
    };
  }, [participant.stream, participant.isVideoOff]);

  return (
    <div 
      className={cn(
        'relative rounded-lg overflow-hidden bg-slate-800 aspect-video',
        participant.isSpeaking && 'ring-2 ring-blue-500',
        className
      )}
    >
      {participant.isVideoOff ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-700">
          <div className="h-16 w-16 rounded-full bg-slate-600 flex items-center justify-center">
            <span className="text-xl font-medium text-white">
              {participant.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          className={cn(
            'h-full w-full object-cover',
            isLocal && 'transform scale-x-[-1]' // Mirror local video
          )}
          muted={isLocal || participant.isMuted}
          playsInline
        />
      )}

      {hasVideoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
          <p className="text-sm text-white">Video unavailable</p>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">
            {participant.name} {isLocal && '(You)'}
          </span>
          <div className="flex space-x-1">
            {participant.isMuted && (
              <span className="p-1 rounded-full bg-red-500/80">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 3.636a1 1 0 011.414 0L10 7.172l3.536-3.536a1 1 0 111.414 1.414L11.414 8.586l3.536 3.536a1 1 0 11-1.414 1.414L10 9.999l-3.536 3.536a1 1 0 11-1.414-1.414l3.536-3.536-3.536-3.536a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            )}
            {participant.isSpeaking && !participant.isMuted && (
              <span className="p-1 rounded-full bg-green-500/80">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTile;