# Recipe App — Project Context

## Tech Stack
- Backend: AWS CDK, Lambda, API Gateway, DynamoDB
- Auth: AWS Cognito (Day 2)
- AI: Hugging Face (Day 5-6)
- Frontend: React (Day 7)

## Decisions Made
- Single-Table DynamoDB design
- Monorepo structure (backend/ + frontend/)
- DynamoDB only (no PostgreSQL)
- Unit testing over SAM local
- Free tier only (watch AI costs on Day 5-6)
- Skip Docker for now (future project)

## Structure
- Handlers = entry point (like route + controller)
- Services = business logic
- Stacks split by feature/domain not AWS service

## Roadmap
- [x] Day 1 — CDK CRUD API
- [ ] Day 2 — Cognito Auth + Role Based
- [ ] Day 3 — Save, Rate, Tag
- [ ] Day 4 — Search
- [ ] Day 5 — AI Chatbot
- [ ] Day 6 — AI Image Generation
- [ ] Day 7 — React Frontend

## AWS Info
- Region: ap-southeast-1
- Environment: dev only for now