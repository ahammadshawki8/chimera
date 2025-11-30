---
trigger: manual
description: Run before committing code to ensure quality
---

# Pre-Commit Hook

## Actions
1. Run TypeScript type checking
2. Run ESLint for code quality
3. Run Prettier for formatting
4. Build the project to catch errors

## Commands
```bash
npm run lint
npm run build
```

## Checklist
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Build succeeds
- [ ] Tests pass (if applicable)
