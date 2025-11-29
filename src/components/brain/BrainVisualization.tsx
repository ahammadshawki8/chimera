import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import type { CognitiveModel } from '../../types';

interface BrainVisualizationProps {
  models: CognitiveModel[];
  onModelSelect: (modelId: string) => void;
}

const BrainVisualization = ({ models, onModelSelect }: BrainVisualizationProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);
  const hoveredModelRef = useRef<string | null>(null);
  
  // Track mouse state for drag rotation
  const mouseState = useRef({
    isDragging: false,
    previousX: 0,
    previousY: 0,
    velocityX: 0,
    velocityY: 0
  });

  // Update ref when state changes
  useEffect(() => {
    hoveredModelRef.current = hoveredModel;
  }, [hoveredModel]);

  useEffect(() => {
    if (!containerRef.current || models.length === 0) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Brain group (everything rotates together)
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // Create sleek, modern brain mesh - single clean wireframe
    const brainGeometry = new THREE.IcosahedronGeometry(2.2, 2);
    const brainMaterial = new THREE.MeshBasicMaterial({
      color: 0x10b981, // Modern green
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const brainMesh = new THREE.Mesh(brainGeometry, brainMaterial);
    brainGroup.add(brainMesh);

    // Add subtle inner glow with particles
    const particleCount = 150;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x34d399, // Lighter green
      size: 0.04,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    brainGroup.add(particles);

    // Create anchor points for each model - clean and minimal
    const anchors: { [key: string]: THREE.Object3D } = {};
    const spheres: { [key: string]: THREE.Mesh } = {};
    const modelColors = [0x10b981, 0x14b8a6, 0x06b6d4]; // Green, Teal, Cyan
    
    models.forEach((model, index) => {
      // Create invisible anchor
      const anchor = new THREE.Object3D();
      anchor.position.set(model.position.x, model.position.y, model.position.z);
      brainGroup.add(anchor);
      anchors[model.id] = anchor;

      // Create clean, minimal sphere (smaller)
      const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: modelColors[index % modelColors.length],
        transparent: true,
        opacity: 0.9
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(anchor.position);
      brainGroup.add(sphere);
      spheres[model.id] = sphere;
    });

    // Mouse interaction for canvas only
    const onCanvasMouseDown = (event: MouseEvent) => {
      mouseState.current.isDragging = true;
      mouseState.current.previousX = event.clientX;
      mouseState.current.previousY = event.clientY;
      renderer.domElement.style.cursor = 'grabbing';
    };

    const onCanvasMouseMove = (event: MouseEvent) => {
      if (!mouseState.current.isDragging) return;
      
      const deltaX = event.clientX - mouseState.current.previousX;
      const deltaY = event.clientY - mouseState.current.previousY;
      
      mouseState.current.velocityX = deltaX * 0.01;
      mouseState.current.velocityY = deltaY * 0.01;
      
      mouseState.current.previousX = event.clientX;
      mouseState.current.previousY = event.clientY;
    };

    const onCanvasMouseUp = () => {
      mouseState.current.isDragging = false;
      renderer.domElement.style.cursor = 'grab';
    };

    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.addEventListener('mousedown', onCanvasMouseDown);
    window.addEventListener('mousemove', onCanvasMouseMove);
    window.addEventListener('mouseup', onCanvasMouseUp);

    // Animation loop
    const tempV = new THREE.Vector3();
    let autoRotation = 0;
    
    const animate = () => {
      requestAnimationFrame(animate);

      // Always auto-rotate
      autoRotation += 0.003;
      
      // Apply auto-rotation
      brainGroup.rotation.y = autoRotation;
      
      // Add user drag rotation on top
      if (mouseState.current.isDragging) {
        brainGroup.rotation.y += mouseState.current.velocityX;
        brainGroup.rotation.x += mouseState.current.velocityY;
        // Update auto rotation to current position
        autoRotation = brainGroup.rotation.y;
      } else {
        // Dampen any X rotation back to 0
        brainGroup.rotation.x *= 0.95;
      }

      // Subtle breathing effect
      const breathScale = 1 + Math.sin(Date.now() * 0.001) * 0.02;
      brainMesh.scale.set(breathScale, breathScale, breathScale);

      // Update sphere scales for hover effect using ref
      models.forEach(model => {
        const sphere = spheres[model.id];
        if (sphere) {
          const targetScale = hoveredModelRef.current === model.id ? 1.4 : 1.0;
          sphere.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        }
      });

      // Update world matrix for accurate positioning
      brainGroup.updateMatrixWorld();

      // Synchronize HTML labels with 3D anchors
      models.forEach(model => {
        const anchor = anchors[model.id];
        if (!anchor) return;

        anchor.getWorldPosition(tempV);
        tempV.project(camera);

        const x = (tempV.x * 0.5 + 0.5) * width;
        const y = (tempV.y * -0.5 + 0.5) * height;

        const labelEl = labelRefs.current[model.id];
        if (labelEl) {
          labelEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
          
          const depth = tempV.z;
          labelEl.style.zIndex = depth < 0.2 ? '20' : '10';
          labelEl.style.opacity = depth > 0.5 ? '0.4' : '1';
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onCanvasMouseMove);
      window.removeEventListener('mouseup', onCanvasMouseUp);
      renderer.domElement.removeEventListener('mousedown', onCanvasMouseDown);
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      brainGeometry.dispose();
      brainMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      
      Object.values(spheres).forEach(sphere => {
        sphere.geometry.dispose();
        (sphere.material as THREE.Material).dispose();
      });
    };
  }, [models]); // Removed hoveredModel dependency to prevent reset

  // Prepare label data
  const labelColors = ['#10b981', '#14b8a6', '#06b6d4']; // Green, Teal, Cyan
  
  const modelLabels = models.map((model, index) => {
    let offsetClass = '';
    if (model.position.x < -0.5) {
      offsetClass = '-translate-x-full -translate-y-1/2';
    } else if (model.position.x > 0.5) {
      offsetClass = 'translate-x-0 -translate-y-1/2';
    } else {
      offsetClass = '-translate-x-1/2 -translate-y-full';
    }

    return {
      id: model.id,
      displayName: model.displayName,
      brainRegion: model.brainRegion,
      color: labelColors[index % labelColors.length],
      offsetClass
    };
  });

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
            className="absolute top-0 left-0 pointer-events-auto cursor-pointer transition-all duration-200"
            onClick={() => onModelSelect(label.id)}
            onMouseEnter={() => setHoveredModel(label.id)}
            onMouseLeave={() => setHoveredModel(null)}
          >
            <div className={`${label.offsetClass} flex items-center gap-2`}>
              {/* Connection dot - smaller */}
              <div 
                className="w-1.5 h-1.5 rounded-full transition-all duration-200"
                style={{ 
                  backgroundColor: label.color,
                  boxShadow: hoveredModel === label.id 
                    ? `0 0 10px ${label.color}, 0 0 20px ${label.color}` 
                    : `0 0 6px ${label.color}`
                }}
              />
              
              {/* Label card - clean and modern */}
              <div 
                className={`
                  backdrop-blur-md rounded-lg px-4 py-2.5 border transition-all duration-200
                  ${hoveredModel === label.id ? 'scale-105' : ''}
                `}
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.85)',
                  borderColor: hoveredModel === label.id ? label.color : 'rgba(255, 255, 255, 0.1)',
                  boxShadow: hoveredModel === label.id 
                    ? `0 0 20px ${label.color}40, 0 4px 12px rgba(0, 0, 0, 0.5)` 
                    : '0 2px 8px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div 
                  className="font-bold text-sm whitespace-nowrap transition-colors duration-200"
                  style={{ 
                    color: hoveredModel === label.id ? label.color : '#ffffff',
                    opacity: 1
                  }}
                >
                  {label.displayName}
                </div>
                <div className="text-gray-400 text-xs whitespace-nowrap mt-0.5">
                  {label.brainRegion}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Hover tooltip - clean and minimal */}
      {hoveredModel && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 pointer-events-none animate-fade-in">
          <div 
            className="backdrop-blur-md rounded-lg px-6 py-3 border"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              borderColor: modelLabels.find(l => l.id === hoveredModel)?.color || '#10b981',
              boxShadow: `0 0 20px ${modelLabels.find(l => l.id === hoveredModel)?.color}40`
            }}
          >
            <div 
              className="text-sm font-bold"
              style={{ color: modelLabels.find(l => l.id === hoveredModel)?.color || '#10b981' }}
            >
              Click to select model
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrainVisualization;
