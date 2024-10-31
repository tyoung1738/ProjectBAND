import React, { useEffect, useState, useRef } from 'react';
import { generateRandomXYZPositionLessThan1000 } from './utils/utils';
import './App.css';
import SceneInit from './SceneInit';
import * as THREE from 'three';
import { GUI } from 'dat.gui';
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger'

function App() {
  const sceneInit = useRef(null);

  useEffect(() => {
    const sceneInitRef = new SceneInit('myThreeJsCanvas');
    sceneInitRef.initialize();
    sceneInitRef.animate();
    sceneInit.current = sceneInitRef;

    const physicsWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -20, 0),
    });
    const groundBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });

    groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    physicsWorld.addBody(groundBody);

    const boxDimensions = [22, 1, 16];
    const halfBoxDimensions = boxDimensions.map((dimension) => dimension / 2);

    const boxMeshes = [];

    for (let i = 0; i < 500; i++) {
      const boxBody = new CANNON.Body({
        mass: 100,
        shape: new CANNON.Box(new CANNON.Vec3(...halfBoxDimensions)),
      });

      const boxGeometry = new THREE.BoxGeometry(...boxDimensions);
      const boxMaterial = new THREE.MeshNormalMaterial();
      const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

      boxBody.position.set(...generateRandomXYZPositionLessThan1000());
      boxMesh.position.set(...Object.values(boxBody.position))
      physicsWorld.addBody(boxBody);
      sceneInitRef.scene.add(boxMesh);
      boxMeshes.push(boxMesh); // Store the mesh reference
    }

    const cannonDebugger = new CannonDebugger(sceneInitRef.scene, physicsWorld, {
      color: 0xff0000,
    });

    const animate = () => {
      physicsWorld.fixedStep();
      cannonDebugger.update();

      //Update each box mesh position and rotation based on its body
      boxMeshes.forEach((boxMesh, index) => {
        const boxBody = physicsWorld.bodies[index]
        boxMesh.position.copy(boxBody.position)
        boxMesh.quaternion.copy(boxBody.quaternion);
        //boxMesh.position.set(sceneInit.current.physicsWorld.bodies[index].position);
        //boxMesh.quaternion.set(Object.values(sceneInitRef.current.physicsWorld.bodies[index].quaternion));
      });

      window.requestAnimationFrame(animate);
    };

    animate();

  }, []);

  const resetCamera = () => {
    console.log('Camera reset');
    sceneInit.current.camera.position.set(0, 100, 10);
  };

  return (
    <div className='container'>
      <canvas id="myThreeJsCanvas" />
      <button id='reset-camera' onClick={resetCamera}>Reset Camera</button>
    </div>
  );
}

export default App;

/*

const handlePosition = (x=0, y=0, z=0) => {
    console.log('handleposition')
    const newX = boxMeshRef.current.position.x + x
    const newY = boxMeshRef.current.position.y + y
    const newZ = boxMeshRef.current.position.z + z
    boxMeshRef.current.position.set(newX, newY, newZ)

  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyMap = {
        'ArrowRight': [1, 0, 0],
        'ArrowLeft': [-1, 0, 0],
        'ArrowUp': [0, 1, 0],
        'ArrowDown': [0, -1, 0]
      }

      const positionChange = keyMap[event.key]

      if(positionChange){
        handlePosition(...positionChange)
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };

    
  }, []);
  */