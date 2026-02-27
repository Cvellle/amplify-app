import { defineFunction } from '@aws-amplify/backend';

/**
 * Notifications microservice — fires when items are created or updated.
 * In production, wire this to DynamoDB Streams in the backend.ts.
 */
export const notificationsService = defineFunction({
  name: 'notifications-service',
  entry: './handler.ts',
  runtime: 18,
  timeoutSeconds: 30,
  environment: {
    SERVICE_NAME: 'notifications-service',
  },
});
