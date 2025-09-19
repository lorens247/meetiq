import { useState, useEffect, useRef, useCallback } from 'react';
import type { Participant } from '@/components/meeting-room/video-tile';

interface UseWebRTCProps {
  roomId: string;
  userName: string;
}

export const useWebRTC = ({ roomId, userName }: UseWebRTCProps) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meetingDuration, setMeetingDuration] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const screenShareStreamRef = useRef<MediaStream | null>(null);

  // Mock function to simulate participants for demo purposes
  const mockAddParticipant = useCallback(() => {
    const mockParticipants: Participant[] = [
      {
        id: 'mock-user1',
        name: 'Jane Smith',
        isMuted: false,
        isVideoOff: false,
        isSpeaking: false
      },
      {
        id: 'mock-user2',
        name: 'John Doe',
        isMuted: true,
        isVideoOff: false,
        isSpeaking: false
      },
      {
        id: 'mock-user3',
        name: 'Alex Johnson',
        isMuted: false,
        isVideoOff: true,
        isSpeaking: false
      }
    ];
    
    setParticipants(prev => [...prev, ...mockParticipants]);
  }, []);

  // Initialize local media stream
  const initLocalStream = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
      });
      
      setLocalStream(stream);
      
      // Add local user to participants
      setParticipants([{
        id: 'local-user',
        name: userName,
        stream,
        isMuted: false,
        isVideoOff: false,
        isSpeaking: false
      }]);
      
      // For demo purposes, add mock participants
      setTimeout(mockAddParticipant, 1000);
      
      // Start meeting timer
      timerRef.current = setInterval(() => {
        setMeetingDuration(prev => prev + 1);
      }, 1000);
      
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Could not access camera or microphone. Please check permissions.');
    }
  }, [userName, mockAddParticipant]);

  // Toggle audio mute
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsAudioMuted(!isAudioMuted);
      
      // Update local participant
      setParticipants(prev => 
        prev.map(p => 
          p.id === 'local-user' ? { ...p, isMuted: !isAudioMuted } : p
        )
      );
    }
  }, [localStream, isAudioMuted]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
      
      // Update local participant
      setParticipants(prev => 
        prev.map(p => 
          p.id === 'local-user' ? { ...p, isVideoOff: !isVideoOff } : p
        )
      );
    }
  }, [localStream, isVideoOff]);

  // Toggle screen sharing
  const toggleScreenShare = useCallback(async () => {
    try {
      if (isScreenSharing) {
        // Stop screen sharing
        if (screenShareStreamRef.current) {
          screenShareStreamRef.current.getTracks().forEach(track => track.stop());
          screenShareStreamRef.current = null;
        }
        
        // Restore video from camera if it was enabled
        if (localStream && !isVideoOff) {
          const videoTracks = localStream.getVideoTracks();
          if (videoTracks.length > 0) {
            videoTracks.forEach(track => {
              track.enabled = true;
            });
          }
        }
      } else {
        // Start screen sharing
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });
        
        screenShareStreamRef.current = screenStream;
        
        // For a real implementation, you would replace the video track in the peer connections
        // Here we just update the local participant's stream for demo purposes
        if (localStream) {
          const newStream = new MediaStream([
            ...localStream.getAudioTracks(),
            ...screenStream.getVideoTracks()
          ]);
          
          setParticipants(prev => 
            prev.map(p => 
              p.id === 'local-user' ? { ...p, stream: newStream } : p
            )
          );
        }
        
        // Handle the case when user stops sharing via the browser UI
        screenStream.getVideoTracks()[0].onended = () => {
          setIsScreenSharing(false);
          screenShareStreamRef.current = null;
          
          // Restore camera video
          if (localStream && !isVideoOff) {
            setParticipants(prev => 
              prev.map(p => 
                p.id === 'local-user' ? { ...p, stream: localStream } : p
              )
            );
          }
        };
      }
      
      setIsScreenSharing(!isScreenSharing);
    } catch (err) {
      console.error('Error toggling screen share:', err);
      setError('Could not start screen sharing. Please try again.');
    }
  }, [isScreenSharing, localStream, isVideoOff]);

  // End meeting
  const endMeeting = useCallback(() => {
    // Stop all media tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    if (screenShareStreamRef.current) {
      screenShareStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Clear timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // In a real implementation, you would close all peer connections here
    
    // Reset state
    setLocalStream(null);
    setParticipants([]);
    setIsAudioMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    setError(null);
    setMeetingDuration(0);
  }, [localStream]);

  // Initialize on component mount
  useEffect(() => {
    initLocalStream();
    
    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      
      if (screenShareStreamRef.current) {
        screenShareStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [initLocalStream]);

  // Simulate a participant speaking (for demo purposes)
  useEffect(() => {
    const speakingInterval = setInterval(() => {
      setParticipants(prev => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        return prev.map((p, idx) => {
          if (idx === randomIndex && !p.isMuted) {
            return { ...p, isSpeaking: true };
          }
          return { ...p, isSpeaking: false };
        });
      });
    }, 3000);
    
    return () => clearInterval(speakingInterval);
  }, []);

  return {
    localStream,
    participants,
    isAudioMuted,
    isVideoOff,
    isScreenSharing,
    error,
    meetingDuration,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    endMeeting
  };
};

export default useWebRTC;