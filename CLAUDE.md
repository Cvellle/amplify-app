# CLAUDE.md — AI Assistant Instructions

This file tells Claude how to work in this codebase.

---

## Project Context

This is an **AWS Amplify Gen 2** app:
- React 18 + TypeScript + Vite frontend
- Amazon Cognito authentication
- AWS AppSync (GraphQL) API
- Amazon DynamoDB (auto-created by `@model`)
- AWS Lambda microservices (items-service, notifications-service)

**Amplify Gen 2 is TypeScript-first IaC** — backend defined in `amplify/` as `.ts` files.

---

## Key Files

| File | Purpose |
|---|---|
| `amplify/backend.ts` | Root — wires all resources together |
| `amplify/auth/resource.ts` | Cognito User Pool config |
| `amplify/data/resource.ts` | GraphQL schema + DynamoDB tables |
| `amplify/functions/*/resource.ts` | Lambda function configs |
| `amplify/functions/*/handler.ts` | Lambda handler code |
| `src/App.tsx` | React root — wraps app with `<Authenticator>` |
| `src/components/Lists/ItemList.tsx` | Main item list component |
| `amplify_outputs.json` | Auto-generated — DO NOT EDIT |

---

## Coding Rules

- TypeScript everywhere — no plain `.js` files
- Functional React components + hooks only — no class components
- Use `@aws-amplify/ui-react` for auth UI
- Use `aws-amplify` v6 APIs: `generateClient`, `signIn`, `signOut`
- Do NOT use `amplify push` — use `npx ampx sandbox` (Gen 2)
- Do NOT import from `aws-amplify/API` (v5) — use `aws-amplify/data` (v6)
- Do NOT edit `amplify_outputs.json` manually

---

## Adding a Microservice

1. Create `amplify/functions/my-service/resource.ts` with `defineFunction()`
2. Create `amplify/functions/my-service/handler.ts` with the handler
3. Import and register in `amplify/backend.ts`

---

## Commands

```bash
npx ampx sandbox          # Deploy backend to your personal AWS sandbox
npx ampx sandbox delete   # Tear down sandbox (saves costs)
npm run dev               # Start React frontend (localhost:5173)
npm run build             # Production build
```
