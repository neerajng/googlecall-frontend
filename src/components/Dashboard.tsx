'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import apiCall from '@/lib/apiCall';
import { useRouter } from 'next/navigation';

export const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [success, setSuccess] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [state, setState] = useState<any>({});

  const handleLogout = async () => {
    try {
      await apiCall._get(`/v1/auth/logout`);      
    } catch (err) {
      console.error(err);
      router.push('/dashboard');
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await apiCall._get(`/v1/calendar/upcoming`);
      setState(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch calendar events.');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const updatePhoneNumber = async () => {
    if (!phoneNumber.match(/^[6-9]\d{9}$/)) {
      setPhoneError('Please enter a valid Indian phone number');
      return;
    }

    try {
      setPhoneLoading(true);
      setPhoneError('');
      await apiCall._patch(`/v1/phone`, { phone: phoneNumber });
      setSuccess('Phone number updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setPhoneError('Failed to update phone number');
    } finally {
      setPhoneLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const num = state?.data?.phone || '';
    setPhoneNumber(num);
  }, [state]);

  const user = state?.data;

  // Convert UTC to IST (Indian Standard Time)
  const formatToIST = (dateTime: string) => {
    if (!dateTime) return 'N/A';

    const date = new Date(dateTime);
    // IST is UTC+5:30
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Intl.DateTimeFormat('en-IN', options).format(date);
  };

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex justify-end pb-4">
        <button
          onClick={handleLogout}
          className="px-4 py-2 cursor-pointer bg-red-600 hover:bg-red-700 text-white font-medium rounded-md shadow-sm transition-colors"
        >
          Logout
        </button>
      </div>
      <div className="text-center mb-10">
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white">
            Calendar Call Reminder Dashboard
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Connect your Google Calendar to schedule phone reminders.
        </p>
        {error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg max-w-md mx-auto">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>

      {user && (
        <div className="flex flex-col items-center gap-6 mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
            <Image
              src={user.picture}
              alt="User Profile"
              width={80}
              height={80}
              className="rounded-full border-2 border-gray-200 dark:border-gray-600"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {user.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="w-full">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Phone Number for Reminders
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                id="phone"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, ''))
                }
                placeholder="Enter 10-digit Indian phone number"
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                maxLength={10}
                pattern="[6-9]\d{9}"
              />
              <button
                onClick={updatePhoneNumber}
                disabled={phoneLoading || !phoneNumber}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {phoneLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
            {phoneError && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {phoneError}
              </p>
            )}
            {success && (
              <p className="mt-1 text-sm text-green-600 dark:text-green-400">
                {success}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              We'll call this number 5 minutes before your events
            </p>
          </div>
        </div>
      )}

      {user?.events?.length > 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Start Time (IST)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    End Time (IST)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {user.events.map((event: any, index: number) => (
                  <tr
                    key={event.id || index}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {event.summary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatToIST(event.start?.dateTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatToIST(event.end?.dateTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${event.status === 'confirmed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <a
                        href={event.htmlLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:underline transition-colors"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No upcoming events found in your calendar.
            </p>
          </div>
        )
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};
