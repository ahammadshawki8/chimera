---
trigger: fileMatch
filePattern: "src/lib/api.ts"
description: Guidelines for API integration changes
---

# API Integration Hook

When modifying the API layer, follow these guidelines:

## Response Handling
All API responses use the envelope format:
```typescript
interface ApiResponse<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
}
```

## Error Handling
- Parse error objects from backend validation
- Display user-friendly error messages
- Log errors for debugging

## Authentication
- Include JWT token in Authorization header
- Handle 401 responses by redirecting to login
- Refresh tokens when expired

## New Endpoint Checklist
- [ ] Add TypeScript types for request/response
- [ ] Add function to appropriate API namespace
- [ ] Handle errors appropriately
- [ ] Update relevant store if needed
