---
inclusion: always
---

# Chimera Frontend Coding Standards

## Technology Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand
- **3D Graphics**: Three.js with React Three Fiber
- **Routing**: React Router v6
- **Forms**: React Hook Form with Zod validation

## Code Style
- Use TypeScript strict mode
- Prefer functional components with hooks
- Use named exports for components
- File naming: PascalCase for components, camelCase for utilities
- Keep components under 200 lines, extract logic to custom hooks

## Component Structure
```typescript
// 1. Imports (external, then internal)
// 2. Types/Interfaces
// 3. Component definition
// 4. Styles (if using styled-components)
// 5. Export
```

## State Management
- Use Zustand stores for global state
- Keep stores focused and small
- Use selectors to prevent unnecessary re-renders
- Persist critical state to localStorage

## API Integration
- All API calls go through `/src/lib/api.ts`
- Use the standard response envelope `{ok, data, error}`
- Handle errors gracefully with user feedback
- Use optimistic updates where appropriate

## Accessibility
- All interactive elements must be keyboard accessible
- Use semantic HTML elements
- Include ARIA labels where needed
- Maintain color contrast ratios (WCAG AA)

## Performance
- Lazy load routes and heavy components
- Memoize expensive computations
- Use React.memo for pure components
- Optimize 3D scene with proper disposal
