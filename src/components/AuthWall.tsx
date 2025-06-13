'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import apiCall from '@/lib/apiCall';
import { useRouter, useSearchParams } from 'next/navigation';

export const AuthWall = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    window.location.href = process.env.NEXT_PUBLIC_GOOGLE_URL!;
  };

  return (
    <div className="w-full">
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-3">
          <h1 className="text-center block text-3xl font-bold text-gray-800 sm:text-4xl md:text-5xl lg:text-6xl dark:text-white">
            Calendar Call Reminder
          </h1>
          <p className="text-lg text-gray-800 text-center">
            Connect your Google Calendar to schedule phone reminders.
          </p>

          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className={`btn-style flex justify-center gap-3 border border-gray-200 bg-white w-full ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <span>Redirecting...</span>
            ) : (
              <>
                <Image
                  src="/assets/google.png"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  alt="Google"
                />
                Sign in with Google
              </>
            )}
          </button>

          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};
