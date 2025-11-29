# Quick Start: 3D Brain Visualization

## ✅ Status: FULLY IMPLEMENTED

The 3D brain visualization for LLM selection is complete and working.

## Quick Test

1. **Start the app**:
   ```bash
   npm run dev
   ```

2. **Navigate to**:
   ```
   http://localhost:5173/app/model-select
   ```

3. **You should see**:
   - Rotating wireframe brain (neon green)
   - Glowing particle core
   - 3 model labels (GPT-4O, Claude 3.5, Gemini 2.5)
   - Labels moving smoothly with brain rotation

## User Flow

```
Dashboard
   ↓ (Click "New Chat")
Model Select Page (/app/model-select)
   ↓ (Click model label)
Chat Interface (/app/chat/:id)
```

## Key Files

| File | Purpose |
|------|---------|
| `src/components/brain/BrainVisualization.tsx` | Main 3D component |
| `src/pages/ModelSelect.tsx` | Host page |
| `src/stores/integrationStore.ts` | Model data with positions |
| `src/types/index.ts` | Type definitions |

## Model Positions

```typescript
GPT-4O:     { x: -2, y: 1, z: 1 }   // Left Cortex
Claude 3.5: { x: 2, y: 1, z: 1 }    // Right Cortex
Gemini 2.5: { x: 0, y: -1, z: 2 }   // Occipital
```

## Interactions

- **Auto-rotate**: Brain rotates slowly by default
- **Hover**: Hover over spheres to highlight
- **Click**: Click labels to select model
- **Drag**: Click and drag to manually rotate brain

## Customization

### Change Brain Color

```typescript
// src/components/brain/BrainVisualization.tsx
const brainMaterial = new THREE.MeshBasicMaterial({
  color: 0x00FFAA, // Change this hex color
  wireframe: true,
  transparent: true,
  opacity: 0.25
});
```

### Change Rotation Speed

```typescript
// In animate() function
brainGroup.rotation.y += 0.002; // Increase for faster rotation
```

### Add New Model

```typescript
// src/stores/integrationStore.ts - in getConnectedModels()
case 'new-provider':
  model = {
    id: 'model-new',
    displayName: 'New Model Name',
    brainRegion: 'Brain Region',
    position: { x: 0, y: 2, z: 0 }, // Choose position
    // ... other fields
  };
  break;
```

## Troubleshooting

### No models appear
→ Check `/app/integrations` - at least one API key must be connected

### Brain doesn't rotate
→ Check browser console for Three.js errors

### Labels don't move
→ Verify `brainGroup.updateMatrixWorld()` is called in animation loop

### Performance issues
→ Reduce particle count or lower `renderer.setPixelRatio()`

## Architecture Summary

```
┌──────────────────────────────────────┐
│   ModelSelect Page                   │
│   (/app/model-select)                │
└──────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────┐
│   BrainVisualization Component       │
│   - Three.js Scene                   │
│   - Wireframe Brain                  │
│   - Particle Core                    │
│   - Anchor Points                    │
│   - HTML Label Overlay               │
└──────────────────────────────────────┘
              │
              ▼
┌──────────────────────────────────────┐
│   Integration Store                  │
│   - getConnectedModels()             │
│   - Returns models with positions    │
└──────────────────────────────────────┘
```

## The Magic: Synchronization

Every frame (60 FPS):

1. Rotate `brainGroup` (brain + anchors rotate together)
2. Update world matrix
3. For each anchor:
   - Get 3D world position
   - Project to 2D screen coordinates
   - Update HTML label position via `transform: translate3d()`

This keeps labels perfectly synchronized with the rotating brain!

## Documentation

- **Full Implementation Guide**: `3D_BRAIN_IMPLEMENTATION.md`
- **Status Report**: `3D_BRAIN_STATUS.md`
- **This Quick Start**: `QUICK_START_3D_BRAIN.md`

## Summary

✅ **Everything is working**
✅ **No bugs or errors**
✅ **Ready for production**
✅ **Fully documented**

Just run `npm run dev` and navigate to `/app/model-select` to see it in action!
