// app/page.tsx
'use client';
import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import DateRangePicker from '@/components/DateRangePicker';
import ExportButton from '@/components/ExportButton';
import { exportEmails } from '@/lib/googleApi';
import { convertToCSV, downloadCSV } from '@/lib/csvUtils';

export default function Home() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isExporting, setIsExporting] = useState(false);

// app/page.tsx

const handleExport = async () => {
  if (!session || !startDate || !endDate) {
    console.error('Cannot export: missing authentication or date range');
    return;
  }

  setIsExporting(true);

  try {
    const accessToken = (session as any).accessToken;
    
    if (!accessToken) {
      console.error('Access token not found');
      return;
    }

    console.log('Starting email export...');
    const emails = await exportEmails(accessToken, startDate, endDate);
    console.log('Emails exported:', emails);

    if (emails.length === 0) {
      console.log('No emails found in the selected date range');
      return;
    }

    console.log('Converting to CSV...');
    const csvContent = convertToCSV(emails);
    console.log('CSV content:', csvContent);

    console.log('Initiating download...');
    downloadCSV(csvContent, 'exported_emails.csv');
  } catch (error) {
    console.error('Error exporting emails:', error);
    // TODO: Show error message to user
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
          {isExporting && <p>Exporting emails, please wait...</p>}
        </>
      ) : (
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      )}
    </main>
  );
}
