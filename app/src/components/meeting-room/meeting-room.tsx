import React, { useState } from 'react';
import { useWebRTC } from '@/hooks/useWebRTC';
import VideoTile from './video-tile';
import { Button } from '@/components/ui/button';
import { formatDuration } from '@/lib/utils';

interface MeetingRoomProps {
  roomId: string;
  title: string;
  userName: string;
  onEndMeeting?: () => void;
}

export const MeetingRoom = ({
  roomId,
  title,
  userName,
  onEndMeeting
}: MeetingRoomProps) => {
  const {
    participants,
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    meetingDuration,
    error,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    endMeeting
  } = useWebRTC({ roomId, userName });

  const handleEndMeeting = () => {
    endMeeting();
    if (onEndMeeting) onEndMeeting();
  };

  // Calculate grid layout based on participant count
  const getGridLayout = () => {
    const count = participants.length;
    
    if (count <= 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2 md:grid-cols-2';
    if (count <= 6) return 'grid-cols-2 md:grid-cols-3';
    if (count <= 9) return 'grid-cols-3 md:grid-cols-3';
    return 'grid-cols-3 md:grid-cols-4';
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Meeting Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div>
          <h1 className="text-lg font-medium">{title}</h1>
          <div className="flex items-center text-sm text-slate-400">
            <span>{formatDuration(meetingDuration)}</span>
            <span className="mx-2">•</span>
            <span>{participants.length} participants</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 p-3 text-center">
          <p className="text-sm text-white">{error}</p>
        </div>
      )}

      {/* Video Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className={`grid ${getGridLayout()} gap-4 auto-rows-fr`}>
          {participants.map((participant) => (
            <VideoTile
              key={participant.id}
              participant={participant}
              isLocal={participant.id === 'local-user'}
            />
          ))}
        </div>
      </div>

      {/* Meeting Controls */}
      <div className="flex items-center justify-center space-x-2 p-4 bg-slate-800 border-t border-slate-700">
        <Button
          variant={isAudioMuted ? "destructive" : "secondary"}
          size="icon"
          onClick={toggleAudio}
          title={isAudioMuted ? "Unmute" : "Mute"}
        >
          {isAudioMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.05 3.636a1 1 0 011.414 0L10 7.172l3.536-3.536a1 1 0 111.414 1.414L11.414 8.586l3.536 3.536a1 1 0 11-1.414 1.414L10 9.999l-3.536 3.536a1 1 0 11-1.414-1.414l3.536-3.536-3.536-3.536a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          )}
        </Button>

        <Button
          variant={isVideoOff ? "destructive" : "secondary"}
          size="icon"
          onClick={toggleVideo}
          title={isVideoOff ? "Turn on camera" : "Turn off camera"}
        >
          {isVideoOff ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2-2V9h1v2h-1zm0-4V5h1v2h-1z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
            </svg>
          )}
        </Button>

        <Button
          variant={isScreenSharing ? "destructive" : "secondary"}
          size="icon"
          onClick={toggleScreenShare}
          title={isScreenSharing ? "Stop sharing" : "Share screen"}
        >
          {isScreenSharing ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
            </svg>
          )}
        </Button>

        <Button
          variant="destructive"
          onClick={handleEndMeeting}
          title="End meeting"
        >
          End
        </Button>
      </div>
    </div>
  );
};

export default MeetingRoom;