import { defineFunction } from '@aws-amplify/backend';

/**
 * Items microservice — handles business logic for item operations.
 * Can be invoked from AppSync custom resolvers or other Lambdas.
 */
export const itemsService = defineFunction({
  name: 'items-service',
  entry: './handler.ts',
  runtime: 18,
  timeoutSeconds: 30,
  environment: {
    SERVICE_NAME: 'items-service',
  },
});
