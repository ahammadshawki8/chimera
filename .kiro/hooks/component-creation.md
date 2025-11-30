---
trigger: fileCreated
filePattern: "src/components/**/*.tsx"
description: Ensure new components follow project standards
---

# Component Creation Hook

When a new component is created, ensure it follows these standards:

## Required Structure
1. TypeScript interface for props
2. Proper accessibility attributes
3. Tailwind CSS for styling
4. Export statement at the end

## Template
```typescript
import React from 'react';

interface ComponentNameProps {
  // Define props here
}

export const ComponentName: React.FC<ComponentNameProps> = ({ ...props }) => {
  return (
    <div className="...">
      {/* Component content */}
    </div>
  );
};
```

## Checklist
- [ ] Props interface defined
- [ ] Component is accessible
- [ ] Uses Tailwind for styling
- [ ] Has proper TypeScript types
