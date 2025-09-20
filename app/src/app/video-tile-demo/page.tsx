'use client';

import { useState, useEffect } from 'react';
import VideoTile, { Participant } from '@/components/meeting-room/video-tile';

export default function VideoTileDemo() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [spotlightedId, setSpotlightedId] = useState<string | null>(null);
  
  // Initialize with mock participants
  useEffect(() => {
    const mockParticipants: Participant[] = [
      {
        id: 'local-user',
        name: 'You (Local)',
        isMuted: false,
        isVideoOff: false,
        isSpeaking: false,
        audioLevel: 0,
        networkQuality: 'good'
      },
      {
        id: 'user1',
        name: 'Jane Smith',
        isMuted: false,
        isVideoOff: false,
        isSpeaking: false,
        audioLevel: 0,
        networkQuality: 'good'
      },
      {
        id: 'user2',
        name: 'John Doe',
        isMuted: true,
        isVideoOff: false,
        isSpeaking: false,
        audioLevel: 0,
        networkQuality: 'medium'
      },
      {
        id: 'user3',
        name: 'Alex Johnson',
        isMuted: false,
        isVideoOff: true,
        isSpeaking: false,
        audioLevel: 0,
        networkQuality: 'poor'
      },
      {
        id: 'user4',
        name: 'Sam Wilson',
        isMuted: false,
        isVideoOff: false,
        isSpeaking: false,
        audioLevel: 0,
        networkQuality: 'good',
        isScreenSharing: true
      },
      {
        id: 'user5',
        name: 'Loading User',
        isMuted: false,
        isVideoOff: false,
        isSpeaking: false,
        audioLevel: 0,
        isLoading: true
      }
    ];
    
    setParticipants(mockParticipants);
    
    // Simulate speaking participants with audio levels
    const speakingInterval = setInterval(() => {
      setParticipants(prev => {
        return prev.map(p => {
          // Don't make muted participants speak
          if (p.isMuted) return p;
          
          // Random chance to speak
          const isSpeaking = Math.random() > 0.7;
          const audioLevel = isSpeaking ? Math.random() : 0;
          
          return {
            ...p,
            isSpeaking,
            audioLevel
          };
        });
      });
    }, 1000);
    
    return () => clearInterval(speakingInterval);
  }, []);
  
  // Handle spotlight toggle
  const handleSpotlight = (id: string) => {
    setSpotlightedId(prevId => {
      const newId = prevId === id ? null : id;
      
      // Update participants with spotlight status
      setParticipants(prev => 
        prev.map(p => ({
          ...p,
          isSpotlighted: p.id === newId
        }))
      );
      
      return newId;
    });
  };
  
  // Handle Picture-in-Picture
  const handlePictureInPicture = (id: string) => {
    console.log(`Picture-in-Picture toggled for participant: ${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-white mb-2">VideoTile Component Demo</h1>
        <p className="text-slate-300 mb-6">
          This page demonstrates the enhanced VideoTile component with all its features.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map(participant => (
            <div key={participant.id} className="flex flex-col">
              <VideoTile
                participant={participant}
                isLocal={participant.id === 'local-user'}
                onSpotlight={handleSpotlight}
                onPictureInPicture={handlePictureInPicture}
              />
              <div className="bg-slate-800 p-3 text-sm text-slate-300 rounded-b-lg">
                <p><strong>Features shown:</strong></p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {participant.isMuted && <li>Muted indicator</li>}
                  {participant.isVideoOff && <li>Video off state</li>}
                  {participant.isSpeaking && <li>Speaking indicator</li>}
                  {participant.audioLevel && participant.audioLevel > 0 && <li>Audio level visualization</li>}
                  {participant.networkQuality && <li>Network quality: {participant.networkQuality}</li>}
                  {participant.isScreenSharing && <li>Screen sharing mode</li>}
                  {participant.isSpotlighted && <li>Spotlight mode</li>}
                  {participant.isLoading && <li>Loading state</li>}
                  {participant.id === 'local-user' && <li>Local user (mirrored)</li>}
                </ul>
                <p className="mt-2 text-xs text-slate-400">Hover over tile to see controls</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-slate-800 rounded-lg">
          <h2 className="text-xl font-bold text-white mb-3">Component Features</h2>
          <ul className="list-disc pl-5 text-slate-300 space-y-2">
            <li>Displays participant's video stream</li>
            <li>Shows participant name and status indicators (speaking, muted, video off)</li>
            <li>Handles different states (loading, error, no video)</li>
            <li>Includes hover controls for spotlight and picture-in-picture</li>
            <li>Supports picture-in-picture and spotlight modes</li>
            <li>Has bandwidth adaptation indicators for different network conditions</li>
            <li>Includes visual indicators for audio levels when speaking</li>
          </ul>
        </div>
      </div>
    </div>
  );
}