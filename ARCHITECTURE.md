# ARCHITECTURE.md

## System Diagram

```
React Frontend (Amplify Hosting / localhost)
        │
        │ JWT (Cognito)
        ▼
  Amazon Cognito ──── Auth flow (sign up, verify, sign in)
        │
        │ Authenticated token
        ▼
   AWS AppSync ──── GraphQL API (single endpoint)
        │
   ┌────┴─────────────────┐
   │                      │
   ▼                      ▼
DynamoDB             Lambda Functions
(Items table)        ├── items-service
                     └── notifications-service
                              │
                         DynamoDB Streams
```

## Auth Flow

```
Sign Up → Email Verification → Sign In → JWT → Access App
```

Tokens are managed automatically by Amplify SDK (refresh included).

## Data Model

**Item** (DynamoDB, owner-isolated):
- `id` — auto UUID
- `title` — String (required)
- `description` — String (optional)
- `status` — ACTIVE | DONE | ARCHIVED
- `priority` — LOW | MEDIUM | HIGH
- `owner` — set automatically by Cognito identity

## Microservices

| Service | Trigger | Responsibility |
|---|---|---|
| items-service | AppSync resolver / direct | Validate + enrich item operations |
| notifications-service | DynamoDB Streams | Notify users on item changes |

## Security

- Users see only their own items (`@auth(allow: owner)`)
- Lambda functions use least-privilege IAM roles
- No secrets in frontend code
- HTTPS enforced via CloudFront on Amplify Hosting
