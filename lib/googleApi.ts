// lib/googleApi.ts

import { delay } from './csvUtils';

// Interface for cleaned email data
export interface CleanedEmail {
  dateSent: string;
  subject: string;
  toName: string;  // New field for recipient's name
  toEmail: string; // New field for recipient's email
  link: string;
}

// Function to clean and extract required email data
function cleanEmailData(emailData: any): CleanedEmail {
  const headers = emailData.payload.headers;
  const dateSent = new Date(parseInt(emailData.internalDate)).toISOString();
  const subject = headers.find((h: any) => h.name === "Subject")?.value || "";
  const to = headers.find((h: any) => h.name === "To")?.value || "";
  const link = `https://mail.google.com/mail/u/0/#sent/${emailData.id}`;

  // Separate name and email address
  const match = to.match(/^(.*?)\s*<(.+@.+)>$/);
  let toName = "";
  let toEmail = to;

  if (match) {
    toName = match[1].trim();
    toEmail = match[2];
  } else {
    // If the email doesn't have a name part, use the part before @ as the name
    toName = to.split('@')[0];
  }

  return { dateSent, subject, toName, toEmail, link };
}

export async function exportEmails(accessToken: string, startDate: Date, endDate: Date, onProgress: (progress: number) => void): Promise<CleanedEmail[]> {
  const emails: CleanedEmail[] = [];
  let pageToken = '';
  let totalEmails = 0;
  let processedEmails = 0

  console.log('Starting sent email export process...');

  // First, get the total number of emails
  const countResponse = await fetch(
    `https://www.googleapis.com/gmail/v1/users/me/messages?q=in:sent after:${Math.floor(startDate.getTime() / 1000)} before:${Math.floor(endDate.getTime() / 1000)}&maxResults=1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const countData = await countResponse.json();
  totalEmails = countData.resultSizeEstimate;

  do {
    try {
      console.log('Fetching sent messages list...');
      const response = await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages?q=in:sent after:${Math.floor(startDate.getTime() / 1000)} before:${Math.floor(endDate.getTime() / 1000)}${pageToken ? `&pageToken=${pageToken}` : ''}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        console.error(`Error fetching messages list: ${response.status} ${response.statusText}`);
        if (response.status === 429) {
          console.log('Rate limit reached. Waiting before retrying...');
          await delay(5000);
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`Fetched ${data.messages ? data.messages.length : 0} messages`);

      if (data.messages && data.messages.length > 0) {
        for (const message of data.messages) {
          console.log(`Fetching details for message ${message.id}...`);
          const emailResponse = await fetch(
            `https://www.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!emailResponse.ok) {
            console.error(`Error fetching message details: ${emailResponse.status} ${emailResponse.statusText}`);
            if (emailResponse.status === 429) {
              console.log('Rate limit reached. Waiting before retrying...');
              await delay(5000);
              continue;
            }
            throw new Error(`HTTP error! status: ${emailResponse.status}`);
          }

          const emailData = await emailResponse.json();
          const cleanedEmail = cleanEmailData(emailData);
          emails.push(cleanedEmail);
          console.log(`Added cleaned message ${message.id} to export list`);

          processedEmails++;
          onProgress((processedEmails / totalEmails) * 100);

          await delay(100);
        }
      } else {
        console.log('No messages found in this page');
      }

      pageToken = data.nextPageToken;
      console.log(`Next page token: ${pageToken}`);
    } catch (error) {
      console.error('Error in export process:', error);
      break;
    }
  } while (pageToken);

  console.log(`Export complete. Total sent emails exported: ${emails.length}`);
  return emails;
}