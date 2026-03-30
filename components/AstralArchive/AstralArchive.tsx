"use client";

import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';
import * as GUI from '@babylonjs/gui';
import * as RAPIER from '@dimforge/rapier3d-compat';
import { SKILLS_DATA } from '@/lib/skills';

// Category accent colors matching skills data
const RACK_COLORS = [
  { hex: '#007FFF', babylon: new BABYLON.Color3(0,    0.498, 1.0  ) }, // Azure Blue  – Database
  { hex: '#50C878', babylon: new BABYLON.Color3(0.314,0.784, 0.471) }, // Emerald     – Backend
  { hex: '#D4AF37', babylon: new BABYLON.Color3(0.831,0.686, 0.216) }, // Royal Gold  – Frontend
  { hex: '#9D4EDD', babylon: new BABYLON.Color3(0.616,0.306, 0.867) }, // Amethyst    – DevOps
];

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

      engine = new BABYLON.Engine(canvasRef.current, true, { antialias: true });
      scene = new BABYLON.Scene(engine);
      scene.clearColor = new BABYLON.Color4(0.012, 0.012, 0.018, 1);

      // --- Subtle fog for depth (light, not black) ---
      scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
      scene.fogStart = 35;
      scene.fogEnd = 80;
      scene.fogColor = new BABYLON.Color3(0.03, 0.03, 0.06);

      // ── CAMERA ──────────────────────────────────────────────────────────
      const camera = new BABYLON.ArcRotateCamera(
        "camera", -Math.PI / 2, 1.1, 28,
        new BABYLON.Vector3(0, 0, 0), scene
      );
      camera.attachControl(canvasRef.current, true);
      camera.lowerRadiusLimit = 10;
      camera.upperRadiusLimit = 50;
      camera.lowerBetaLimit  = 0.3;
      camera.upperBetaLimit  = Math.PI / 2.1;
      camera.wheelPrecision  = 50;
      camera.panningSensibility = 0;

      // Cinematic auto-rotation
      camera.useAutoRotationBehavior = true;
      if (camera.autoRotationBehavior) {
        camera.autoRotationBehavior.idleRotationSpeed    = 0.18;
        camera.autoRotationBehavior.idleRotationWaitTime = 1200;
      }

      // ── LIGHTING ────────────────────────────────────────────────────────

      // Bright ambient fill — no more darkness
      const ambient = new BABYLON.HemisphericLight("ambient", new BABYLON.Vector3(0, 1, 0), scene);
      ambient.intensity   = 1.8;
      ambient.diffuse     = new BABYLON.Color3(0.8, 0.85, 1.0);
      ambient.groundColor = new BABYLON.Color3(0.15, 0.12, 0.2);

      // Bright key light from above-front
      const keyLight = new BABYLON.DirectionalLight("key", new BABYLON.Vector3(-0.3, -1, -0.5), scene);
      keyLight.intensity = 3.0;
      keyLight.diffuse   = new BABYLON.Color3(0.95, 0.95, 1.0);

      // Fill light from opposite side
      const fillLight = new BABYLON.DirectionalLight("fill", new BABYLON.Vector3(0.5, -0.5, 0.8), scene);
      fillLight.intensity = 1.2;
      fillLight.diffuse   = new BABYLON.Color3(0.6, 0.7, 1.0);

      // ── RENDERING PIPELINE ──────────────────────────────────────────────
      const pipeline = new BABYLON.DefaultRenderingPipeline("pipeline", true, scene, [camera]);
      // Bloom
      pipeline.bloomEnabled   = true;
      pipeline.bloomThreshold = 0.5;
      pipeline.bloomWeight    = 1.0;
      pipeline.bloomKernel    = 128;
      // Image processing
      pipeline.imageProcessingEnabled = true;
      pipeline.imageProcessing.contrast  = 1.2;
      pipeline.imageProcessing.exposure  = 1.4;
      pipeline.imageProcessing.toneMappingEnabled = true;
      pipeline.imageProcessing.toneMappingType    = BABYLON.ImageProcessingConfiguration.TONEMAPPING_ACES;
      // Vignette
      pipeline.imageProcessing.vignetteEnabled  = true;
      pipeline.imageProcessing.vignetteWeight   = 2.5;
      pipeline.imageProcessing.vignetteCameraFov = 0.5;
      pipeline.imageProcessing.vignetteColor    = new BABYLON.Color4(0, 0, 0, 0);
      pipeline.imageProcessing.vignetteBlendMode = BABYLON.ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY;
      // Depth of field
      pipeline.depthOfFieldEnabled = true;
      pipeline.depthOfField.focalLength = 150;
      pipeline.depthOfField.fStop       = 1.4;
      pipeline.depthOfField.focusDistance = 2200;
      // SSAO
      const ssao = new BABYLON.SSAO2RenderingPipeline("ssao", scene, { ssaoRatio: 0.5, blurRatio: 1 }, [camera]);
      ssao.radius     = 3.5;
      ssao.totalStrength = 1.2;
      ssao.base       = 0.05;
      ssao.maxZ       = 80;

      // ── SHARED MATERIALS ─────────────────────────────────────────────────

      // Polished dark floor with visible reflections
      const floorMat = new BABYLON.PBRMaterial("floorMat", scene);
      floorMat.metallic  = 0.9;
      floorMat.roughness = 0.08;
      floorMat.albedoColor    = new BABYLON.Color3(0.018, 0.016, 0.025);
      floorMat.reflectionColor = new BABYLON.Color3(0.5, 0.5, 0.6);

      // Rich dark-walnut shelf material with some warmth
      const shelfMat = new BABYLON.PBRMaterial("shelfMat", scene);
      shelfMat.metallic  = 0.0;
      shelfMat.roughness = 0.6;
      shelfMat.albedoColor = new BABYLON.Color3(0.14, 0.09, 0.07);

      // ── FLOOR ────────────────────────────────────────────────────────────
      const floor = BABYLON.MeshBuilder.CreateGround("floor", { width: 80, height: 60 }, scene);
      floor.position.y = -5.3;
      floor.material   = floorMat;

      const floorBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(0, -5.3, 0);
      const floorBody = world.createRigidBody(floorBodyDesc);
      world.createCollider(RAPIER.ColliderDesc.cuboid(40, 0.1, 30), floorBody);

      // ── LAYOUT CONSTANTS (used by walls, ceiling, and racks) ──────────────────
      const RACK_W     = 8.5;
      const RACK_COUNT = SKILLS_DATA.length;
      const totalWidth = (RACK_COUNT - 1) * RACK_W;

      // ── ROOM WALLS & CEILING ──────────────────────────────────────────────
      const wallMat = new BABYLON.PBRMaterial("wallMat", scene);
      wallMat.metallic  = 0.0;
      wallMat.roughness = 0.9;
      wallMat.albedoColor = new BABYLON.Color3(0.035, 0.03, 0.045);

      // Back wall
      const backWall = BABYLON.MeshBuilder.CreatePlane("backWall", { width: 60, height: 20 }, scene);
      backWall.position.set(0, 4.5, 5);
      backWall.material = wallMat;

      // Ceiling
      const ceiling = BABYLON.MeshBuilder.CreateGround("ceiling", { width: 60, height: 20 }, scene);
      ceiling.position.y  = 10;
      ceiling.rotation.x  = Math.PI;
      ceiling.material    = wallMat;

      // Recessed ceiling lights (emissive strips)
      const ceilLightMat = new BABYLON.StandardMaterial("ceilLightMat", scene);
      ceilLightMat.emissiveColor = new BABYLON.Color3(0.7, 0.75, 1.0);
      ceilLightMat.disableLighting = true;
      for (let i = 0; i < 4; i++) {
        const strip = BABYLON.MeshBuilder.CreateBox(`ceilStrip_${i}`, { width: 7, height: 0.06, depth: 0.4 }, scene);
        strip.position.set(i * RACK_W - totalWidth / 2, 9.5, -0.5);
        strip.material = ceilLightMat;
        // Downward spotlight from each ceiling strip
        const ceilSpot = new BABYLON.SpotLight(
          `ceilSpot_${i}`,
          new BABYLON.Vector3(i * RACK_W - totalWidth / 2, 9.2, -0.5),
          new BABYLON.Vector3(0, -1, 0),
          Math.PI / 5,
          2.5,
          scene
        );
        ceilSpot.diffuse    = new BABYLON.Color3(0.9, 0.92, 1.0);
        ceilSpot.intensity  = 60;
        ceilSpot.range      = 18;
      }

      // ── GUI ──────────────────────────────────────────────────────────────
      const advTex = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

      // ── PARTICLE SYSTEM (dust motes) ──────────────────────────────────────
      const dustPS = new BABYLON.ParticleSystem("dust", 300, scene);
      dustPS.particleTexture = new BABYLON.Texture(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQI12NkYGD4z8BQDwAEgAF/QualIQAAAABJRU5ErkJggg==",
        scene
      );
      dustPS.emitter = new BABYLON.Vector3(0, 2, 0);
      dustPS.minEmitBox = new BABYLON.Vector3(-20, -3, -4);
      dustPS.maxEmitBox = new BABYLON.Vector3( 20,  6,  4);
      dustPS.color1 = new BABYLON.Color4(1, 1, 1, 0.15);
      dustPS.color2 = new BABYLON.Color4(0.8, 0.9, 1, 0.05);
      dustPS.colorDead = new BABYLON.Color4(0, 0, 0, 0);
      dustPS.minSize = 0.02; dustPS.maxSize = 0.06;
      dustPS.minLifeTime = 8; dustPS.maxLifeTime = 20;
      dustPS.emitRate = 12;
      dustPS.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
      dustPS.gravity = new BABYLON.Vector3(0, 0.005, 0);
      dustPS.direction1 = new BABYLON.Vector3(-0.05, 0.02,  0.01);
      dustPS.direction2 = new BABYLON.Vector3( 0.05, 0.08, -0.01);
      dustPS.minAngularSpeed = -0.1; dustPS.maxAngularSpeed = 0.1;
      dustPS.start();

      // ── RACKS ────────────────────────────────────────────────────────────
      const booksWithBodies: { mesh: BABYLON.Mesh; body: RAPIER.RigidBody; label: GUI.Rectangle }[] = [];

      SKILLS_DATA.forEach((rack, rIdx) => {
        const accentColor  = RACK_COLORS[rIdx % RACK_COLORS.length];
        const rackX        = rIdx * RACK_W - totalWidth / 2;

        // ── SHELF BOARD ──────────────────────────────────────────────────
        const shelf = BABYLON.MeshBuilder.CreateBox(`shelf_${rIdx}`, {
          width: RACK_W - 0.4, height: 0.22, depth: 3.8,
        }, scene);
        shelf.position.set(rackX, -1.0, 0);
        shelf.material = shelfMat;

        // Shelf back panel
        const backPanel = BABYLON.MeshBuilder.CreateBox(`back_${rIdx}`, {
          width: RACK_W - 0.4, height: 5.5, depth: 0.12,
        }, scene);
        backPanel.position.set(rackX, 1.5, 1.98);
        backPanel.material = shelfMat;

        // Side panels (bookends)
        [-1, 1].forEach(side => {
          const panel = BABYLON.MeshBuilder.CreateBox(`side_${rIdx}_${side}`, {
            width: 0.12, height: 5.5, depth: 3.8,
          }, scene);
          panel.position.set(rackX + side * ((RACK_W - 0.4) / 2 + 0.06), 1.5, 0);
          panel.material = shelfMat;
        });

        // Physics for shelf
        const sBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(rackX, -1.0, 0);
        const sBody = world.createRigidBody(sBodyDesc);
        world.createCollider(RAPIER.ColliderDesc.cuboid((RACK_W - 0.4) / 2, 0.11, 1.9), sBody);

        // ── LED STRIP (neon line under shelf) ─────────────────────────────
        const ledMat = new BABYLON.StandardMaterial(`led_${rIdx}`, scene);
        ledMat.emissiveColor = accentColor.babylon.scale(2.0); // extra bright
        ledMat.disableLighting = true;

        // LED strip bar
        const led = BABYLON.MeshBuilder.CreateBox(`led_${rIdx}`, {
          width: RACK_W - 0.6, height: 0.06, depth: 0.06,
        }, scene);
        led.position.set(rackX, -1.14, -1.85);
        led.material = ledMat;

        // Wide glow halo below shelf
        const glowPlane = BABYLON.MeshBuilder.CreatePlane(`ledGlow_${rIdx}`, {
          width: RACK_W - 0.2, height: 2.0,
        }, scene);
        glowPlane.position.set(rackX, -1.9, -1.5);
        glowPlane.rotation.x = Math.PI / 2;
        const glowMat = new BABYLON.StandardMaterial(`ledGlowMat_${rIdx}`, scene);
        glowMat.emissiveColor = accentColor.babylon.scale(0.9);
        glowMat.alpha = 0.35;
        glowMat.disableLighting = true;
        glowPlane.material = glowMat;

        // Second softer halo for extra spread
        const glowPlane2 = BABYLON.MeshBuilder.CreatePlane(`ledGlow2_${rIdx}`, {
          width: RACK_W + 1.0, height: 3.5,
        }, scene);
        glowPlane2.position.set(rackX, -2.5, -1.0);
        glowPlane2.rotation.x = Math.PI / 2;
        const glowMat2 = new BABYLON.StandardMaterial(`ledGlowMat2_${rIdx}`, scene);
        glowMat2.emissiveColor = accentColor.babylon.scale(0.4);
        glowMat2.alpha = 0.12;
        glowMat2.disableLighting = true;
        glowPlane2.material = glowMat2;

        // Accent neon strip on left edge of rack
        const accentStrip = BABYLON.MeshBuilder.CreateBox(`strip_${rIdx}`, {
          width: 0.06, height: 5.5, depth: 0.06,
        }, scene);
        accentStrip.position.set(rackX - (RACK_W - 0.4) / 2 - 0.18, 1.5, 0);
        accentStrip.material = ledMat;

        // Category point light — bright, tight range to illuminate just the rack
        const catLight = new BABYLON.PointLight(`catLight_${rIdx}`, new BABYLON.Vector3(rackX, 3.5, -0.5), scene);
        catLight.diffuse   = accentColor.babylon;
        catLight.specular  = accentColor.babylon;
        catLight.intensity = 80;
        catLight.range     = 13;

        // Second fill point from front
        const frontLight = new BABYLON.PointLight(`frontLight_${rIdx}`, new BABYLON.Vector3(rackX, 1, -4), scene);
        frontLight.diffuse    = new BABYLON.Color3(0.9, 0.92, 1.0);
        frontLight.intensity  = 30;
        frontLight.range      = 10;

        // Category text label on back panel (GUI)
        const catLabel = new GUI.TextBlock(`cat_${rIdx}`, rack.category.toUpperCase());
        catLabel.color      = accentColor.hex;
        catLabel.fontSize   = 11;
        catLabel.fontFamily = "Space Grotesk, monospace";
        catLabel.fontWeight = "bold";
        catLabel.alpha      = 0.75;
        advTex.addControl(catLabel);
        catLabel.linkWithMesh(backPanel);
        catLabel.linkOffsetY = -140;

        // ── BOOKS ────────────────────────────────────────────────────────
        rack.skills.forEach((skill, bIdx) => {
          const bW  = 0.52;
          const bH  = 1.6 + (Math.sin(bIdx * 37 + rIdx * 13) * 0.5 + 0.5) * 0.6; // 1.6–2.2
          const bD  = 2.8;
          const bGap = 0.08;

          const bookMesh = BABYLON.MeshBuilder.CreateBox(
            `book_${rIdx}_${bIdx}`,
            { width: bW, height: bH, depth: bD },
            scene
          );

          // Spawn books slightly above and randomly drift
          const spawnX = rackX - 2.5 + bIdx * (bW + bGap);
          const bookBodyDesc = RAPIER.RigidBodyDesc.dynamic()
            .setTranslation(spawnX, 6 + bIdx * 0.6, (Math.random() - 0.5) * 0.3)
            .setRotation({ x: 0, y: 0, z: (Math.random() - 0.5) * 0.05, w: 1 })
            .setLinearDamping(0.9)
            .setAngularDamping(0.95);
          const bookBody = world.createRigidBody(bookBodyDesc);
          world.createCollider(RAPIER.ColliderDesc.cuboid(bW / 2, bH / 2, bD / 2), bookBody);

          // ── DYNAMIC SPINE TEXTURE — paint skill name on book face ────────
          const dynTex = new BABYLON.DynamicTexture(
            `spineTeX_${rIdx}_${bIdx}`,
            { width: 256, height: 1024 },
            scene,
            false
          );
          const ctx = dynTex.getContext() as CanvasRenderingContext2D;

          // Background — base colour of the rack
          const r = Math.round(accentColor.babylon.r * 255);
          const g = Math.round(accentColor.babylon.g * 255);
          const b2 = Math.round(accentColor.babylon.b * 255);
          const shade = [1.0, 0.65, 0.5, 0.75, 0.85, 0.45][bIdx % 6];
          ctx.fillStyle = `rgb(${Math.round(r*shade)},${Math.round(g*shade)},${Math.round(b2*shade)})`;
          ctx.fillRect(0, 0, 256, 1024);

          // Darkened side bands for depth illusion
          const leftGrad = ctx.createLinearGradient(0, 0, 40, 0);
          leftGrad.addColorStop(0, 'rgba(0,0,0,0.6)');
          leftGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = leftGrad;
          ctx.fillRect(0, 0, 40, 1024);
          const rightGrad = ctx.createLinearGradient(216, 0, 256, 0);
          rightGrad.addColorStop(0, 'rgba(0,0,0,0)');
          rightGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
          ctx.fillStyle = rightGrad;
          ctx.fillRect(216, 0, 40, 1024);

          // Top golden band
          ctx.fillStyle = 'rgba(212,175,55,0.75)';
          ctx.fillRect(20, 20, 216, 8);
          ctx.fillRect(20, 36, 216, 2);

          // Bottom golden band
          ctx.fillStyle = 'rgba(212,175,55,0.75)';
          ctx.fillRect(20, 975, 216, 8);
          ctx.fillRect(20, 962, 216, 2);

          // Skill name — rotated vertically (bottom-to-top)
          ctx.save();
          ctx.translate(128, 512);
          ctx.rotate(-Math.PI / 2);
          ctx.textAlign    = 'center';
          ctx.textBaseline = 'middle';
          ctx.font         = 'bold 72px monospace';
          ctx.fillStyle    = 'rgba(255,255,255,0.92)';
          ctx.shadowColor  = `rgba(${r},${g},${b2},0.9)`;
          ctx.shadowBlur   = 18;
          ctx.fillText(skill.name.toUpperCase(), 0, 0);
          ctx.restore();

          // Small level bar at bottom
          ctx.fillStyle = 'rgba(255,255,255,0.15)';
          ctx.fillRect(40, 940, 176, 6);
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.fillRect(40, 940, Math.round(176 * skill.level / 100), 6);

          dynTex.update();

          // PBR material using dynamic texture as albedo
          const bMat = new BABYLON.PBRMaterial(`bMat_${rIdx}_${bIdx}`, scene);
          bMat.albedoTexture = dynTex;
          bMat.metallic  = bIdx % 4 === 0 ? 0.3 : 0.0;
          bMat.roughness = 0.4 + (bIdx % 3) * 0.18;
          bMat.emissiveTexture = dynTex;
          bMat.emissiveColor   = new BABYLON.Color3(0.25, 0.25, 0.25);
          bookMesh.material    = bMat;

          // ── HOVER TOOLTIP (skill level + description) ─────────────────
          const label = new GUI.Rectangle(`lbl_${rIdx}_${bIdx}`);
          label.width        = "170px";
          label.height       = "52px";
          label.cornerRadius = 6;
          label.color        = accentColor.hex;
          label.thickness    = 1;
          label.background   = "#08080fdd";
          label.alpha        = 0;
          advTex.addControl(label);
          label.linkWithMesh(bookMesh);
          label.linkOffsetY = -90;

          const labelStack = new GUI.StackPanel();
          labelStack.isVertical = true;
          label.addControl(labelStack);

          const labelName = new GUI.TextBlock();
          labelName.text       = skill.name;
          labelName.color      = '#ffffff';
          labelName.fontSize   = 12;
          labelName.fontFamily = 'monospace';
          labelName.fontWeight = 'bold';
          labelName.height     = '22px';
          labelStack.addControl(labelName);

          const labelLevel = new GUI.TextBlock();
          labelLevel.text       = `Aptitude: ${skill.level}%`;
          labelLevel.color      = accentColor.hex;
          labelLevel.fontSize   = 10;
          labelLevel.fontFamily = 'monospace';
          labelLevel.height     = '18px';
          labelStack.addControl(labelLevel);

          booksWithBodies.push({ mesh: bookMesh, body: bookBody, label });
        });

        // ── GOLD BOOK-RAIL CLIP (decorative endstop) ─────────────────
        const clipMat = new BABYLON.StandardMaterial(`clipMat_${rIdx}`, scene);
        clipMat.emissiveColor = new BABYLON.Color3(0.72, 0.55, 0.08);

        const clip = BABYLON.MeshBuilder.CreateBox(`clip_${rIdx}`, {
          width: 0.08, height: 0.45, depth: 3.6,
        }, scene);
        clip.position.set(rackX - (RACK_W - 0.4) / 2 + 0.3, -0.67, 0);
        clip.material = clipMat;
      });

      // ── INTERACTION ────────────────────────────────────────────────────
      let hoveredBook: { mesh: BABYLON.Mesh; body: RAPIER.RigidBody; label: GUI.Rectangle } | null = null;

      scene.onPointerObservable.add((pointerInfo) => {
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERMOVE) {
          const pick = scene.pick(scene.pointerX, scene.pointerY);

          booksWithBodies.forEach(b => {
            const isHit = pick?.hit && pick.pickedMesh === b.mesh;

            if (isHit && hoveredBook !== b) {
              hoveredBook = b;
            }

            const targetAlpha = (pick?.hit && pick.pickedMesh === b.mesh) ? 1 : 0;
            b.label.alpha = targetAlpha;

            // Scale hover
            const targetScale = isHit ? 1.03 : 1.0;
            b.mesh.scaling.x = BABYLON.Scalar.Lerp(b.mesh.scaling.x, targetScale, 0.15);
            b.mesh.scaling.z = BABYLON.Scalar.Lerp(b.mesh.scaling.z, targetScale, 0.15);
          });
        }

        // Click: apply upward impulse to book
        if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERDOWN) {
          const pick = scene.pick(scene.pointerX, scene.pointerY);
          if (pick?.hit) {
            const hit = booksWithBodies.find(b => b.mesh === pick.pickedMesh);
            if (hit) {
              const pos = hit.body.translation();
              hit.body.applyImpulseAtPoint(
                new RAPIER.Vector3(
                  (Math.random() - 0.5) * 2,
                  5,
                  (Math.random() - 0.5) * 1
                ),
                new RAPIER.Vector3(pos.x, pos.y, pos.z),
                true
              );
            }
          }
        }
      });

      // ── RENDER LOOP ──────────────────────────────────────────────────
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

      window.addEventListener("resize", () => engine.resize());
    };

    init().catch(err => console.error("Astral Archive Init Failed:", err));

    return () => { if (engine) engine.dispose(); };
  }, []);

  return (
    <section className="w-full h-screen bg-[#020202] relative rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl my-32">
      {/* Header */}
      <div className="absolute top-10 left-12 z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[10px] text-white/20 font-mono tracking-[0.3em] uppercase">SYS // SYSTEM</span>
        </div>
        <h2 className="text-6xl font-black text-white tracking-tighter leading-none">
          ASTRAL <span className="text-[#007FFF]">ARCHIVE</span>
        </h2>
        <p className="text-white/30 font-bold uppercase tracking-[0.4em] mt-3 text-[10px] font-mono">
          Physicalized Engine-Ready Skills
        </p>
      </div>

      {/* System status bottom left */}
      <div className="absolute bottom-8 left-12 z-10 pointer-events-none">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[9px] text-white/20 font-mono tracking-wider">ARCHIVE_SYNCED_OK</span>
        </div>
        <p className="text-[9px] text-white/10 font-mono mt-1 tracking-wider">
          ◈ SELECT A RELIC TO INITIALIZE DOWNLOAD
        </p>
      </div>

      {/* Legend – bottom right */}
      <div className="absolute bottom-8 right-12 z-10 pointer-events-none flex flex-col gap-1.5 items-end">
        {['Database','Backend Architecture','Frontend Experience','Tools & DevOps'].map((cat, i) => {
          const colors = ['#007FFF','#50C878','#D4AF37','#9D4EDD'];
          return (
            <div key={cat} className="flex items-center gap-2">
              <span className="text-[9px] text-white/20 font-mono tracking-wider uppercase">{cat}</span>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i], boxShadow: `0 0 6px ${colors[i]}` }} />
            </div>
          );
        })}
      </div>

      <canvas ref={canvasRef} className="w-full h-full outline-none" />
    </section>
  );
}
