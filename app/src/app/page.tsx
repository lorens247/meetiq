'use client';

import { useState } from 'react';
import MeetingRoom from '@/components/meeting-room/meeting-room';
import { Button } from '@/components/ui/button';
import Image from "next/image";

export default function Home() {
  const [isMeetingStarted, setIsMeetingStarted] = useState(false);
  const [userName, setUserName] = useState('Guest User');
  
  const startMeeting = () => {
    setIsMeetingStarted(true);
  };
  
  const endMeeting = () => {
    setIsMeetingStarted(false);
  };
  
  return (
    <div className="min-h-screen">
      {!isMeetingStarted ? (
        <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
          <main className="flex flex-col gap-[32px] row-start-2 items-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">MeetIQ</h1>
              <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Smart AI-Powered Conferencing</p>
            </div>
            
            <div className="w-full max-w-md space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Your Name
                </label>
                <input
                  id="username"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white"
                  placeholder="Enter your name"
                />
              </div>
              
              <Button 
                onClick={startMeeting}
                className="w-full"
              >
                Start Meeting
              </Button>
            </div>
            
            <Image
              className="dark:invert mt-8"
              src="/next.svg"
              alt="Next.js logo"
              width={120}
              height={25}
              priority
            />
          </main>
          <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Built with Next.js and Tailwind CSS
            </span>
          </footer>
        </div>
      ) : (
        <div className="h-screen">
          <MeetingRoom
            roomId="demo-room-123"
            title="MeetIQ Demo Meeting"
            userName={userName}
            onEndMeeting={endMeeting}
          />
        </div>
      )}
    </div>
  );
}
