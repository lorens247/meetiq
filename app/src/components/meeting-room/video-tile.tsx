import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
  audioLevel?: number; // For audio level visualization (0-1)
  networkQuality?: 'good' | 'medium' | 'poor'; // For bandwidth adaptation
  isScreenSharing?: boolean; // For identifying screen sharing participants
  isSpotlighted?: boolean; // For spotlight mode
  isLoading?: boolean; // For loading state
}

interface VideoTileProps {
  participant: Participant;
  isLocal?: boolean;
  className?: string;
}

interface VideoTileProps {
  participant: Participant;
  isLocal?: boolean;
  className?: string;
  onSpotlight?: (id: string) => void;
  onPictureInPicture?: (id: string) => void;
}

export const VideoTile = ({ 
  participant, 
  isLocal = false, 
  className,
  onSpotlight,
  onPictureInPicture
}: VideoTileProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasVideoError, setHasVideoError] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);

  // Handle video stream setup and error handling
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
      
      // Exit PiP mode if active when unmounting
      if (document.pictureInPictureElement === videoRef.current) {
        document.exitPictureInPicture().catch(err => {
          console.error("Failed to exit Picture-in-Picture mode:", err);
        });
      }
    };
  }, [participant.stream, participant.isVideoOff]);

  // Handle Picture-in-Picture mode
  const togglePictureInPicture = async () => {
    try {
      if (document.pictureInPictureElement === videoRef.current) {
        await document.exitPictureInPicture();
        setIsPictureInPicture(false);
      } else if (videoRef.current && document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
        setIsPictureInPicture(true);
        if (onPictureInPicture) {
          onPictureInPicture(participant.id);
        }
      }
    } catch (error) {
      console.error("Picture-in-Picture error:", error);
    }
  };

  // Handle spotlight mode
  const handleSpotlight = () => {
    if (onSpotlight) {
      onSpotlight(participant.id);
    }
  };

  // Calculate audio level bar width based on participant's audio level
  const getAudioLevelWidth = () => {
    if (!participant.audioLevel || participant.isMuted) return '0%';
    return `${Math.min(participant.audioLevel * 100, 100)}%`;
  };

  // Get network quality indicator
  const getNetworkQualityIndicator = () => {
    switch (participant.networkQuality) {
      case 'good':
        return { color: 'bg-green-500', bars: 3 };
      case 'medium':
        return { color: 'bg-yellow-500', bars: 2 };
      case 'poor':
        return { color: 'bg-red-500', bars: 1 };
      default:
        return { color: 'bg-gray-500', bars: 0 };
    }
  };

  return (
    <div 
      className={cn(
        'relative rounded-lg overflow-hidden bg-slate-800 aspect-video group',
        participant.isSpeaking && 'ring-2 ring-blue-500',
        participant.isSpotlighted && 'ring-2 ring-yellow-400',
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Loading state */}
      {participant.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 z-10">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {/* Video off state */}
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
            isLocal && 'transform scale-x-[-1]', // Mirror local video
            participant.isScreenSharing && 'object-contain bg-black' // Better display for screen sharing
          )}
          muted={isLocal || participant.isMuted}
          playsInline
        />
      )}

      {/* Error state */}
      {hasVideoError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-500/20">
          <p className="text-sm text-white">Video unavailable</p>
        </div>
      )}

      {/* Audio level indicator */}
      {participant.isSpeaking && !participant.isMuted && (
        <div className="absolute bottom-10 left-2 right-2 h-1 bg-slate-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-100 ease-in-out"
            style={{ width: getAudioLevelWidth() }}
          ></div>
        </div>
      )}

      {/* Hover controls */}
      <div 
        className={cn(
          "absolute top-2 right-2 transition-opacity duration-200",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex space-x-1">
          {/* Picture-in-Picture button */}
          <button 
            onClick={togglePictureInPicture}
            className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white"
            title="Picture-in-Picture"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 4a3 3 0 00-3 3v10a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm9 6a1 1 0 00-1-1h-3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1v-3z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Spotlight button */}
          <button 
            onClick={handleSpotlight}
            className={cn(
              "p-1.5 rounded-full text-white",
              participant.isSpotlighted ? "bg-yellow-500" : "bg-slate-800/80 hover:bg-slate-700"
            )}
            title="Spotlight"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Network quality indicator */}
      {participant.networkQuality && (
        <div className="absolute top-2 left-2">
          <div className="flex space-x-0.5 items-end h-3">
            {Array.from({ length: 3 }).map((_, i) => {
              const { color, bars } = getNetworkQualityIndicator();
              return (
                <div 
                  key={i}
                  className={cn(
                    "w-1",
                    i < bars ? color : "bg-slate-600",
                    `h-${i + 1}/3 h-${(i + 1) * 1}`
                  )}
                  style={{ height: `${(i + 1) * 3}px` }}
                ></div>
              );
            })}
          </div>
        </div>
      )}

      {/* Participant info bar */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-white">
            {participant.name} {isLocal && '(You)'} {participant.isScreenSharing && '(Screen)'}
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