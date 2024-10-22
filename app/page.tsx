// app/page.tsx
'use client';
import { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import DateRangePicker from '@/components/DateRangePicker';
import ExportButton from '@/components/ExportButton';
import Trivia from '@/components/Trivia';  // Import the Trivia component
import { exportEmails } from '@/lib/googleApi';
import { convertToCSV, downloadCSV } from '@/lib/csvUtils';

export default function Home() {
  const { data: session, status } = useSession();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async () => {
    if (!session || !startDate || !endDate) {
      console.error('Cannot export: missing authentication or date range');
      return;
    }

    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);

    try {
      const accessToken = (session as any).accessToken;

      if (!accessToken) {
        console.error('Access token not found');
        return;
      }

      console.log('Starting email export...');
      const emails = await exportEmails(accessToken, startDate, endDate, (progress) => {
        setExportProgress(Math.round(progress));
      });
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
      setExportProgress(100);
      setExportComplete(true);  // Set this to true when export is complete
    } catch (error) {
      console.error('Error exporting emails:', error);
      // TODO: Show error message to user
    } finally {
      setIsExporting(false);
    }
  };

  const startNewExport = () => {
    setStartDate(null);
    setEndDate(null);
    setExportProgress(0);
    setExportComplete(false);
    setIsExporting(false);
  };

  const FeedbackLink = () => (
    <p className="mt-4 text-sm">
      We value your feedback! Please share your thoughts{' '}
      <a 
        href="https://forms.gle/D4W7daTsWQ5F17av5" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:text-blue-700 underline"
      >
        here
      </a>
    </p>
  );


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-2">Pitchl1st</h1>
      {status === "authenticated" ? (
        <>
          <button onClick={() => signOut()} className="mb-8">Sign out</button>
          <FeedbackLink />
          <p className="mb-4 text-center">
            Select two dates, and we will generate pitch list within that timeframe.
          </p>
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
          {(isExporting || exportProgress > 0) && (
            <p>
              {exportComplete
                ? `Your PitchL1st is ready! ${exportProgress}% | Check your downloads folder`
                : `Exporting your PitchL1st... ${exportProgress}%`}
            </p>
          )}
          {exportComplete && (
            <button
              onClick={startNewExport}
              className="btn-primary mt-4 mb-8"
            >
              Start new Pitchl1st
            </button>
          )}
          {(isExporting || exportProgress > 0) && (
            <>
              <p className="mt-4 mb-2 text-center font-semibold">
                Trivia while you wait?
              </p>
              <Trivia />
            </>
          )}
        </>
      ) : (
        <>
          <p className="mb-4">
            Trouble signing in? Request access to the BETA{' '}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=opentoolsco@gmail.com&su=Requesting Access to Pitchl1st BETA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 underline"
            >
              here
            </a>
          </p>
          <p className="mb-4">
            When you authenticate your Google account, be sure to accept all permissions for the app to work correctly!

          </p>
          <button onClick={() => signIn("google")}>Sign in with Google</button>
          <FeedbackLink/>
        </>
      )}
    </main>
  );
}
