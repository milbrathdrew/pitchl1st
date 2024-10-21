// lib/googleApi.ts

import { delay } from './csvUtils';

export async function exportEmails(accessToken: string, startDate: Date, endDate: Date) {
  const emails = [];
  let pageToken = '';

  console.log('Starting email export process...');

  do {
    try {
      console.log('Fetching messages list...');
      const response = await fetch(
        `https://www.googleapis.com/gmail/v1/users/me/messages?q=in:sent =after:${Math.floor(startDate.getTime()/1000)} before:${Math.floor(endDate.getTime()/1000)}${pageToken ? `&pageToken=${pageToken}` : ''}`,
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
          emails.push(emailData);
          console.log(`Added message ${message.id} to export list`);

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

  console.log(`Export complete. Total emails exported: ${emails.length}`);
  return emails;
}
