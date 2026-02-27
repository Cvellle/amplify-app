import type { DynamoDBStreamHandler } from 'aws-lambda';

/**
 * Notifications microservice handler.
 * Triggered by DynamoDB Streams when items are created/updated/deleted.
 * Extend this to send emails (SES), push notifications (SNS), etc.
 */
export const handler: DynamoDBStreamHandler = async (event) => {
  console.log('[notifications-service] Stream event received');

  for (const record of event.Records) {
    const eventType = record.eventName; // INSERT | MODIFY | REMOVE

    if (eventType === 'INSERT') {
      const newItem = record.dynamodb?.NewImage;
      console.log('[notifications-service] New item created:', JSON.stringify(newItem));
      // TODO: Send welcome/confirmation email via SES
      // await sendEmail({ to: userEmail, subject: 'Item created!', body: '...' });
    }

    if (eventType === 'MODIFY') {
      const oldItem = record.dynamodb?.OldImage;
      const newItem = record.dynamodb?.NewImage;
      console.log('[notifications-service] Item updated:', {
        before: JSON.stringify(oldItem),
        after: JSON.stringify(newItem),
      });
      // TODO: Notify user of changes via SNS
    }

    if (eventType === 'REMOVE') {
      const deletedItem = record.dynamodb?.OldImage;
      console.log('[notifications-service] Item deleted:', JSON.stringify(deletedItem));
    }
  }
};
