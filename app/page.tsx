// app/page.tsx
'use client';

import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import DateRangePicker from '@/components/DateRangePicker';
import ExportButton from '@/components/ExportButton';
import GoogleAuth from '@/components/GoogleAuth';

export default function Home() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const handleAuthSuccess = (credentialResponse: any) => {
    setIsAuthenticated(true);
    setToken(credentialResponse.credential);
  };

  const handleExport = async () => {
    if (!isAuthenticated || !token || !startDate || !endDate) {
      console.error('Cannot export: missing authentication or date range');
      return;
    }

    try {
      const response = await fetch('/api/export-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to export emails');
      }

      const data = await response.json();
      console.log('Emails exported:', data);
      // Handle successful export (e.g., show success message, offer download link)
    } catch (error) {
      console.error('Error exporting emails:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.GOOGLE_CLIENT_ID!}>
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-4xl font-bold mb-8">Pitchl1st</h1>
        <GoogleAuth onSuccess={handleAuthSuccess} />
        {isAuthenticated && (
          <>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
            <ExportButton onClick={handleExport} disabled={!startDate || !endDate} />
          </>
        )}
      </main>
    </GoogleOAuthProvider>
  );
}
