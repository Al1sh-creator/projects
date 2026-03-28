"use client";

import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import * as GUI from '@babylonjs/gui';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { getProject, types } from '@theatre/core';
import { SKILLS_DATA } from '@/lib/skills';

export default function AstralArchive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!canvasRef.current || initialized.current) return;
    initialized.current = true;

    let engine: BABYLON.Engine;
    let scene: BABYLON.Scene;

    const init = async () => {
      await RAPIER.init();
      const world = new RAPIER.World(new RAPIER.Vector3(0, -9.81, 0));

      engine = new BABYLON.Engine(canvasRef.current, true);
      scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0.01, 0.01, 0.02, 1);

      // --- THEATRE.JS SETUP ---
      const project = getProject('AstralArchive');
      const sheet = project.sheet('MainScene');

      // --- ENVIRONMENT ---
      const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 3, 25, BABYLON.Vector3.Zero(), scene);
      camera.attachControl(canvasRef.current, true);
      camera.lowerRadiusLimit = 10;
      camera.upperRadiusLimit = 40;

      // Theatre control for camera
      const camObj = sheet.object('Camera', {
        alpha: types.number(camera.alpha, { range: [-Math.PI * 2, Math.PI * 2] }),
        beta: types.number(camera.beta, { range: [0, Math.PI] }),
        radius: types.number(camera.radius, { range: [5, 50] })
      });
      camObj.onValuesChange((v) => {
        camera.alpha = v.alpha;
        camera.beta = v.beta;
        camera.radius = v.radius;
      });

      const light = new BABYLON.PointLight("light", new BABYLON.Vector3(0, 10, 5), scene);
      light.intensity = 1500;
      light.diffuse = new BABYLON.Color3(0.8, 0.9, 1);

      // --- GUI FOR LABELS ---
      const advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

      // --- MATERIALS ---
      const glassMat = new BABYLON.PBRMaterial("glassMat", scene);
      glassMat.metallic = 0.5;
      glassMat.roughness = 0.1;
      glassMat.alpha = 0.3;
      glassMat.transparencyMode = 2;

      const floorMat = new BABYLON.PBRMaterial("floorMat", scene);
      floorMat.metallic = 1.0;
      floorMat.roughness = 0.05;
      floorMat.albedoColor = new BABYLON.Color3(0.01, 0.01, 0.01);

      // --- OBJECTS ---
      const floorMesh = BABYLON.MeshBuilder.CreateGround("floor", { width: 40, height: 40 }, scene);
      floorMesh.position.y = -5;
      floorMesh.material = floorMat;

      const floorBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -5, 0);
      const floorBody = world.createRigidBody(floorBodyDesc);
      const floorCollider = RAPIER.ColliderDesc.cuboid(20, 0.1, 20);
      world.createCollider(floorCollider, floorBody);

      const booksWithBodies: { mesh: BABYLON.Mesh, body: RAPIER.RigidBody, label: GUI.Rectangle }[] = [];

      SKILLS_DATA.forEach((rack, rIdx) => {
        const rackX = (rIdx - 1.5) * 8;
        
        const shelfMesh = BABYLON.MeshBuilder.CreateBox(`shelf_${rIdx}`, { width: 7, height: 0.3, depth: 4 }, scene);
        shelfMesh.position.set(rackX, -1, 0);
        shelfMesh.material = glassMat;

        const shelfBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(rackX, -1, 0);
        const shelfBody = world.createRigidBody(shelfBodyDesc);
        const shelfCollider = RAPIER.ColliderDesc.cuboid(3.5, 0.15, 2);
        world.createCollider(shelfCollider, shelfBody);

        rack.skills.forEach((skill, bIdx) => {
          const bW = 0.45;
          const bH = 1.8 + Math.random() * 0.4;
          const bD = 2.8;
          
          const bookMesh = BABYLON.MeshBuilder.CreateBox(`book_${skill.name}`, { width: bW, height: bH, depth: bD }, scene);
          
          const bookBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(rackX - 2.5 + bIdx * 0.8, 5 + bIdx * 2, (Math.random() - 0.5) * 0.5)
            .setRotation({ x: 0, y: 0, z: (Math.random() - 0.5) * 0.1, w: 1 });
          
          const bookBody = world.createRigidBody(bookBodyDesc);
          const bookCollider = RAPIER.ColliderDesc.cuboid(bW/2, bH/2, bD/2);
          world.createCollider(bookCollider, bookBody);

          // Create Label for Book
          const label = new GUI.Rectangle();
          label.width = "100px";
          label.height = "30px";
          label.cornerRadius = 20;
          label.color = "white";
          label.thickness = 1;
          label.background = "#131313cc";
          label.alpha = 0; // Hide initially
          advancedTexture.addControl(label);
          label.linkWithMesh(bookMesh);
          label.linkOffsetY = -100;

          const labelText = new GUI.TextBlock();
          labelText.text = skill.name;
          labelText.color = "white";
          labelText.fontSize = 12;
          labelText.fontWeight = "bold";
          label.addControl(labelText);
          
          booksWithBodies.push({ mesh: bookMesh, body: bookBody, label });

          const bMat = new BABYLON.PBRMaterial(`bMat_${skill.name}`, scene);
          bMat.albedoColor = BABYLON.Color3.FromHexString(rack.color).scale(0.8);
          bMat.metallic = 1.0;
          bMat.roughness = 0.2;
          bMat.emissiveColor = BABYLON.Color3.FromHexString(rack.color).scale(0.1);
          bookMesh.material = bMat;
        });
      });

      // --- INTERACTION ---
      scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
          const pickResult = scene.pick(scene.pointerX, scene.pointerY);
          booksWithBodies.forEach(b => {
             if (pickResult?.hit && pickResult.pickedMesh === b.mesh) {
               b.label.alpha = 1;
               b.mesh.scaling.setAll(1.05);
             } else {
               b.label.alpha = 0;
               b.mesh.scaling.setAll(1.0);
             }
          });
        }
      });

      // --- PIPELINE ---
      const pipeline = new BABYLON.DefaultRenderingPipeline("pipeline", true, scene, [camera]);
      pipeline.bloomEnabled = true;
      pipeline.bloomThreshold = 0.8;
      pipeline.bloomWeight = 0.6;

      // --- RENDER LOOP ---
      engine.runRenderLoop(() => {
        world.step();
        
        booksWithBodies.forEach(({ mesh, body }) => {
          const pos = body.translation();
          const rot = body.rotation();
          mesh.position.set(pos.x, pos.y, pos.z);
          mesh.rotationQuaternion = new BABYLON.Quaternion(rot.x, rot.y, rot.z, rot.w);
        });

        scene.render();
      });

      project.ready.then(() => {
        sheet.sequence.play({ iterationCount: 1, range: [0, 4] });
      });

      window.addEventListener("resize", () => engine.resize());
    };

    init().catch(err => console.error("Astral Archive Init Failed:", err));

    return () => { if (engine) engine.dispose(); };
  }, []);

  return (
    <section className="w-full h-screen bg-[#020202] relative rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl my-32">
      <div className="absolute top-12 left-12 z-10 pointer-events-none">
        <h2 className="text-6xl font-black text-white mix-blend-difference tracking-tighter">ASTRAL <span className="text-[#007FFF]">ARCHIVE</span></h2>
        <p className="text-white/30 font-bold uppercase tracking-[0.4em] mt-4 text-xs">Phyiscalized Engine-Ready Skills</p>
      </div>
      <canvas ref={canvasRef} className="w-full h-full outline-none" />
    </section>
  );
}
