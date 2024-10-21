// app/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import DateRangePicker from '@/components/DateRangePicker';
import ExportButton from '@/components/ExportButton';
import { exportEmails } from '@/lib/googleApi';
import { convertToCSV, downloadCSV } from '@/lib/csvUtils';
import GoogleSignInButton from '@/components/GoogleSignInButton';

export default function Home() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportCount, setExportCount] = useState(0);
  const [exportMessage, setExportMessage] = useState('');

  useEffect(() => {
    // Load the Google Sign-In API script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

const handleExport = async () => {
  if (!session || !startDate || !endDate) {
    console.error('Cannot export: missing authentication or date range');
    return;
  }

  setIsExporting(true);
  setExportCount(0);
  setExportMessage('');

  try {
    const accessToken = (session as any).accessToken;
    
    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    console.log('Starting email export...');
    const emails = await exportEmails(accessToken, startDate, endDate, setExportCount);
    console.log('Emails exported:', emails);

    if (emails.length === 0) {
      setExportMessage('No emails found in the selected date range');
      return;
    }

    console.log('Converting to CSV...');
    const csvContent = convertToCSV(emails);
    console.log('CSV content:', csvContent);

    console.log('Initiating download...');
    downloadCSV(csvContent, 'exported_emails.csv');

    setExportMessage(`Your PitchL1st is ready, ${emails.length} messages exported`);
    setStartDate(null);
    setEndDate(null);
  } catch (error) {
    console.error('Error exporting emails:', error);
    setExportMessage('Error exporting emails. Please try again.');
  } finally {
    setIsExporting(false);
  }
};

return (
  <main className="flex min-h-screen flex-col items-center justify-center p-24">
    <h1 className="text-4xl font-bold mb-8">Pitchl1st</h1>
    {status === "authenticated" ? (
      <>
        <button onClick={() => signOut()} className="mb-4">Sign out</button>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />
        <ExportButton
          onClick={handleExport}
          disabled={!startDate || !endDate || isExporting}
        />
        {isExporting && (
          <p>Exporting emails, please wait... ({exportCount} exported)</p>
        )}
        {exportMessage && <p>{exportMessage}</p>}
      </>
    ) : (
      <GoogleSignInButton />
    )}
  </main>
);

}
