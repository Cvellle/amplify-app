import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { itemsService } from './functions/items-service/resource';
import { notificationsService } from './functions/notifications-service/resource';

/**
 * Root backend definition.
 * All AWS resources are wired here — Amplify/CDK deploys them.
 *
 * To add more resources:
 *   1. Create amplify/functions/my-service/resource.ts
 *   2. Import and add it below
 */
defineBackend({
  auth,
  data,
  itemsService,
  notificationsService,
});
