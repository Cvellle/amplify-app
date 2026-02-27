import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * GraphQL schema — AppSync auto-creates DynamoDB tables for @model types.
 * @auth(allow: owner) means each user only sees their own data.
 */
const schema = a.schema({
  Item: a
    .model({
      title: a.string().required(),
      description: a.string(),
      status: a.enum(['ACTIVE', 'DONE', 'ARCHIVED']),
      priority: a.enum(['LOW', 'MEDIUM', 'HIGH']),
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = typeof schema;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
