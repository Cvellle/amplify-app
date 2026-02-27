# My Amplify App

Auth + item list + microservices, built with AWS Amplify Gen 2.

**Stack:** React · TypeScript · Cognito · AppSync · DynamoDB · Lambda

---

## ⚡ Setup (copy these into VS Code terminal)

### 1 — AWS credentials (one-time)
```bash
aws configure
```
Enter your Access Key ID, Secret Key, region (`us-east-1`), format (`json`).
> Get keys from: AWS Console → IAM → Users → your user → Security credentials → Create access key

---

### 2 — Install and scaffold
```bash
npm install
```

---

### 3 — Deploy backend to AWS (keep this terminal open)
```bash
npx ampx sandbox
```
Wait for `✅ Deployment complete` — takes ~3 min first time.

---

### 4 — Start frontend (open a second terminal with the + button)
```bash
npm run dev
```
Open **http://localhost:5173** in your browser.

---

### 5 — Use the app
- Click **Create account** to register with your email
- Check email for verification code
- Sign in — you'll see the item list
- Add, complete, archive, and delete items in real time

---

## Deploy to production

```bash
git init && git add . && git commit -m "initial"
# Push to GitHub, then connect repo at console.aws.amazon.com/amplify
```

---

## Project structure

```
my-amplify-app/
├── amplify/
│   ├── backend.ts                         ← root backend wiring
│   ├── auth/resource.ts                   ← Cognito config
│   ├── data/resource.ts                   ← GraphQL schema + DynamoDB
│   └── functions/
│       ├── items-service/
│       │   ├── resource.ts                ← Lambda config
│       │   └── handler.ts                 ← Lambda code
│       └── notifications-service/
│           ├── resource.ts
│           └── handler.ts
├── src/
│   ├── App.tsx                            ← root with <Authenticator>
│   ├── components/Lists/ItemList.tsx      ← item list UI
│   └── main.tsx
├── CLAUDE.md
├── ARCHITECTURE.md
└── README.md
```
