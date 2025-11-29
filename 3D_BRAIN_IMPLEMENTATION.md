# 3D Brain Visualization Implementation Guide

## Overview

The 3D Brain visualization for LLM selection uses a **hybrid rendering approach** that combines WebGL (Three.js) for the 3D brain with HTML/CSS for the interactive labels. This provides the best of both worlds: performant 3D graphics and easily styled, accessible UI elements.

## Architecture

### The "Anchor" Technique

The core innovation is the **anchor synchronization system**:

1. **3D Layer (WebGL)**: Renders the rotating wireframe brain using Three.js
2. **DOM Layer (HTML/CSS)**: Renders the model labels as regular HTML elements
3. **Synchronization**: Invisible 3D "anchor" points are placed in the 3D scene, and their screen positions are calculated every frame to move the HTML labels

This avoids the limitations of rendering text directly in WebGL (blurry text, difficult styling) while maintaining perfect synchronization.

## File Structure

```
src/
├── components/
│   └── brain/
│       └── BrainVisualization.tsx    # Main 3D brain component
├── pages/
│   └── ModelSelect.tsx               # Page that hosts the brain
├── stores/
│   └── integrationStore.ts           # Provides model data with 3D positions
├── types/
│   └── index.ts                      # Type definitions
└── App.tsx                           # Routing configuration
```

## Implementation Details

### 1. Type Definitions (`src/types/index.ts`)

```typescript
export interface CognitiveModel {
  id: string;
  provider: 'openai' | 'anthropic' | 'google';
  name: string;
  displayName: string;
  brainRegion: string;
  status: 'connected' | 'error' | 'disconnected';
  position: Vector3; // 3D coordinates for brain visualization
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}
```

### 2. Model Data with 3D Positions (`src/stores/integrationStore.ts`)

Each LLM model is assigned specific 3D coordinates relative to the brain center (0, 0, 0):

```typescript
getConnectedModels: () => {
  const models: CognitiveModel[] = [];
  
  // OpenAI GPT-4O - Left Cortex
  {
    id: 'model-gpt4o',
    displayName: 'OpenAI GPT-4O',
    brainRegion: 'Left Cortex',
    position: { x: -2, y: 1, z: 1 }, // Left side of brain
  }
  
  // Anthropic Claude - Right Cortex
  {
    id: 'model-claude',
    displayName: 'Anthropic Claude 3.5',
    brainRegion: 'Right Cortex',
    position: { x: 2, y: 1, z: 1 }, // Right side of brain
  }
  
  // Google Gemini - Occipital
  {
    id: 'model-gemini',
    displayName: 'Google Gemini 2.5',
    brainRegion: 'Occipital',
    position: { x: 0, y: -1, z: 2 }, // Back/bottom of brain
  }
}
```

### 3. BrainVisualization Component (`src/components/brain/BrainVisualization.tsx`)

#### Step 1: Scene Setup

```typescript
// Create Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ 
  antialias: true, 
  alpha: true,
  powerPreference: 'high-performance'
});
```

#### Step 2: Brain Group Creation

All 3D objects are added to a single group so they rotate together:

```typescript
const brainGroup = new THREE.Group();
scene.add(brainGroup);

// Wireframe brain mesh
const brainGeometry = new THREE.IcosahedronGeometry(2, 1);
const brainMaterial = new THREE.MeshBasicMaterial({
  color: 0x00FFAA,
  wireframe: true,
  transparent: true,
  opacity: 0.25
});
const brainMesh = new THREE.Mesh(brainGeometry, brainMaterial);
brainGroup.add(brainMesh);

// Particle core (glowing center)
const particles = new THREE.Points(particleGeometry, particleMaterial);
brainGroup.add(particles);
```

#### Step 3: Anchor Point Creation

For each model, create an invisible anchor and a visible sphere:

```typescript
const anchors: { [key: string]: THREE.Object3D } = {};
const spheres: { [key: string]: THREE.Mesh } = {};

models.forEach(model => {
  // Invisible anchor for label positioning
  const anchor = new THREE.Object3D();
  anchor.position.set(model.position.x, model.position.y, model.position.z);
  brainGroup.add(anchor); // Add to group so it rotates with brain
  anchors[model.id] = anchor;

  // Visible sphere at anchor position
  const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 16);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x00FFAA,
    transparent: true,
    opacity: 0.8
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.copy(anchor.position);
  brainGroup.add(sphere);
  spheres[model.id] = sphere;
});
```

#### Step 4: Animation Loop with Synchronization

This is the **critical part** - the synchronization happens here:

```typescript
const animate = () => {
  requestAnimationFrame(animate);

  // 1. Rotate the brain group
  if (!isDragging) {
    brainGroup.rotation.y += 0.002;
  }

  // 2. Update world matrix for accurate positioning
  brainGroup.updateMatrixWorld();

  // 3. Synchronize HTML labels with 3D anchors
  models.forEach(model => {
    const anchor = anchors[model.id];
    if (!anchor) return;

    // Get world position of anchor (absolute 3D coordinates)
    anchor.getWorldPosition(tempV);

    // Project 3D position to 2D screen space (-1 to +1 range)
    tempV.project(camera);

    // Convert normalized device coordinates to pixel coordinates
    const x = (tempV.x * 0.5 + 0.5) * width;
    const y = (tempV.y * -0.5 + 0.5) * height;

    // Update HTML label position using GPU-accelerated transform
    const labelEl = labelRefs.current[model.id];
    if (labelEl) {
      labelEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      
      // Depth-based styling (fade if behind brain)
      const depth = tempV.z;
      labelEl.style.zIndex = depth < 0.2 ? '20' : '10';
      labelEl.style.opacity = depth > 0.5 ? '0.3' : '1';
    }
  });

  renderer.render(scene, camera);
};
```

**Key Points:**
- `getWorldPosition()` gets the absolute 3D position after all transformations
- `project()` converts 3D coordinates to normalized device coordinates (-1 to +1)
- We convert NDC to pixel coordinates for CSS positioning
- `translate3d()` uses GPU acceleration for smooth movement
- Depth (`tempV.z`) is used to fade labels that are behind the brain

#### Step 5: HTML Label Overlay

```tsx
return (
  <div className="relative w-full h-full">
    {/* 3D Canvas Container */}
    <div ref={containerRef} className="absolute inset-0" />

    {/* HTML Label Overlay */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {modelLabels.map((label) => (
        <div
          key={label.id}
          ref={el => labelRefs.current[label.id] = el}
          className="absolute top-0 left-0 pointer-events-auto cursor-pointer"
          onClick={() => handleLabelClick(label.id)}
        >
          <div className={`${label.offsetClass} flex items-center gap-2`}>
            {/* Connection dot */}
            <div className="w-3 h-3 rounded-full pulse-subtle" />
            
            {/* Label card */}
            <div className="bg-black/90 border-2 px-4 py-2 angular-frame">
              <div className="text-neon-green font-bold">
                {label.displayName}
              </div>
              <div className="text-gray-400 text-xs">
                {label.brainRegion}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
```

**Key Points:**
- Labels start at `top-0 left-0` (0, 0 position)
- The animation loop moves them via `transform: translate3d()`
- `pointer-events-none` on container, `pointer-events-auto` on labels for click handling
- `offsetClass` adjusts label position relative to the dot based on X coordinate

### 4. Label Offset Logic

Labels are positioned relative to their anchor point based on the X coordinate:

```typescript
const modelLabels: ModelLabel[] = models.map(model => {
  let offsetClass = '';
  if (model.position.x < -0.5) {
    offsetClass = '-translate-x-full -translate-y-1/2'; // Left side
  } else if (model.position.x > 0.5) {
    offsetClass = 'translate-x-0 -translate-y-1/2'; // Right side
  } else {
    offsetClass = '-translate-x-1/2 -translate-y-full'; // Center/bottom
  }
  
  return { ...model, offsetClass };
});
```

This ensures labels don't overlap the brain mesh.

### 5. Mouse Interaction

#### Hover Detection

```typescript
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onHover = (event: MouseEvent) => {
  // Convert mouse position to normalized device coordinates
  mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

  // Cast ray from camera through mouse position
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(Object.values(spheres));

  if (intersects.length > 0) {
    const modelId = findModelIdFromSphere(intersects[0].object);
    setHoveredModel(modelId);
    playSound('hover');
  }
};
```

#### Drag Rotation

```typescript
const onMouseMove = (event: MouseEvent) => {
  if (!isDragging) return;
  
  mouseX = ((event.clientX - rect.left) / width) * 2 - 1;
  mouseY = -((event.clientY - rect.top) / height) * 2 + 1;
  
  targetRotationY = mouseX * Math.PI;
  targetRotationX = mouseY * Math.PI * 0.5;
};

// In animation loop
brainGroup.rotation.y += (targetRotationY - brainGroup.rotation.y) * 0.05;
brainGroup.rotation.x += (targetRotationX - brainGroup.rotation.x) * 0.05;
```

### 6. ModelSelect Page (`src/pages/ModelSelect.tsx`)

The page that hosts the brain visualization:

```tsx
export default function ModelSelect() {
  const navigate = useNavigate();
  const getConnectedModels = useIntegrationStore(state => state.getConnectedModels);
  const models = getConnectedModels();

  const handleModelSelect = async (modelId: string) => {
    // Create conversation and navigate to chat
    const conversationId = createConversation(activeWorkspace.id, modelId);
    navigate(`/app/chat/${conversationId}`);
  };

  return (
    <div className="min-h-screen w-full bg-black">
      <div className="relative h-[600px] w-full">
        <Suspense fallback={<LoadingSpinner />}>
          <BrainVisualization
            models={models}
            onModelSelect={handleModelSelect}
          />
        </Suspense>
      </div>
    </div>
  );
}
```

### 7. Routing (`src/App.tsx`)

```tsx
<Route path="/app" element={<ProtectedRoute><AppShell /></ProtectedRoute>}>
  <Route path="model-select" element={<ModelSelect />} />
  {/* Other routes */}
</Route>
```

## Performance Optimizations

1. **Lazy Loading**: BrainVisualization is lazy-loaded to reduce initial bundle size
2. **GPU Acceleration**: Using `translate3d()` instead of `top/left` for smooth animations
3. **Pixel Ratio Limiting**: `Math.min(window.devicePixelRatio, 2)` prevents excessive rendering on high-DPI displays
4. **Efficient Geometry**: Low-poly icosahedron (subdivision level 1) for the brain mesh
5. **Proper Cleanup**: All Three.js resources are disposed in the cleanup function

## Common Issues and Solutions

### Issue 1: Labels Don't Move with Brain

**Cause**: Anchors not added to `brainGroup`

**Solution**: Ensure anchors are added to the group, not the scene:
```typescript
brainGroup.add(anchor); // ✅ Correct
scene.add(anchor);      // ❌ Wrong - won't rotate with brain
```

### Issue 2: Labels Appear in Wrong Position

**Cause**: Not calling `updateMatrixWorld()` before projection

**Solution**: Always update the world matrix before projecting:
```typescript
brainGroup.updateMatrixWorld(); // Must be called before getWorldPosition
anchor.getWorldPosition(tempV);
```

### Issue 3: Laggy Label Movement

**Cause**: Using `top/left` CSS properties instead of `transform`

**Solution**: Use GPU-accelerated transforms:
```typescript
el.style.transform = `translate3d(${x}px, ${y}px, 0)`; // ✅ Fast
el.style.top = `${y}px`; // ❌ Slow - causes reflow
```

### Issue 4: Labels Overlap Brain

**Cause**: No depth-based occlusion

**Solution**: Use Z-depth to fade labels behind the brain:
```typescript
const depth = tempV.z;
el.style.opacity = depth > 0.5 ? '0.3' : '1';
```

## Testing the Implementation

1. **Navigate to Model Selection**:
   - Click "New Chat" button from dashboard
   - Should navigate to `/app/model-select`

2. **Verify 3D Brain Renders**:
   - Wireframe brain should be visible
   - Brain should auto-rotate slowly
   - Glowing particle core should be visible

3. **Test Label Synchronization**:
   - Labels should move smoothly with brain rotation
   - Labels should stay attached to their anchor points
   - No jittering or lag

4. **Test Interactions**:
   - Hover over spheres - should highlight and play sound
   - Click labels - should navigate to chat with selected model
   - Drag brain - should rotate based on mouse movement

5. **Test Multiple Models**:
   - Configure all 3 API keys in Integrations
   - All 3 models should appear on brain
   - Each should have correct position and label

## Customization Guide

### Adding New Models

1. Add position in `integrationStore.ts`:
```typescript
{
  id: 'model-new',
  displayName: 'New Model',
  brainRegion: 'Frontal Lobe',
  position: { x: 0, y: 2, z: 0 }, // Top of brain
}
```

2. The component will automatically create anchor and label

### Adjusting Brain Appearance

```typescript
// Brain size
const brainGeometry = new THREE.IcosahedronGeometry(2, 1);
//                                                   ↑  ↑
//                                                size subdivision

// Brain color and opacity
const brainMaterial = new THREE.MeshBasicMaterial({
  color: 0x00FFAA,  // Neon green
  opacity: 0.25,    // Transparency
});

// Rotation speed
brainGroup.rotation.y += 0.002; // Adjust this value
```

### Adjusting Label Positioning

```typescript
// Modify offset logic in modelLabels mapping
if (model.position.x < -0.5) {
  offsetClass = '-translate-x-full -translate-y-1/2'; // Adjust these
}
```

## Summary

The 3D brain visualization successfully combines:
- **Three.js** for performant 3D rendering
- **HTML/CSS** for accessible, styled labels
- **Anchor synchronization** to keep everything in sync
- **Raycasting** for hover detection
- **Sound effects** for enhanced UX

This hybrid approach provides the best user experience while maintaining good performance and accessibility.
