import * as RAPIER from '@dimforge/rapier3d-compat';

let rapierPromise: Promise<typeof RAPIER> | null = null;

export const initPhysics = async () => {
  if (rapierPromise) return rapierPromise;
  
  rapierPromise = RAPIER.init().then(() => RAPIER);
  
  return rapierPromise;
};
