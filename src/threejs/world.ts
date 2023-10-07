import PubSub from 'pubsub-js';
import { accessoriesMetaData, furnitureMetaData } from '../metadata';
import globalStoreInstance from '../store/globalStore';
import lightStatemanager from '../store/lightStateManager';
import {
  AddLightData,
  AddModelData,
  LandingButtons,
} from '../utils/pubSubEvnets';
import {
  JsonData,
  loadInitialScene,
  loadModelFromJson,
} from './loadInitialScene';
import setupScene from './setup';

export async function createNewWorld() {
  const { camera, controls, renderer, scene } = setupScene();
  const modelDataHashMap = new Map();
  const lightsDataHashMap = new Map();
  const lighgtStateHashMap = new Map();
  const globalStore = globalStoreInstance;

  globalStore.set('modeldataHashMap', modelDataHashMap);
  globalStore.set('lightsdataHashMap', lightsDataHashMap);
  globalStore.set('lighgtStateHashMap', lighgtStateHashMap);
  console.log(globalStore);
  lightStatemanager();

  // console.log(AddModelData);
  PubSub.subscribe(AddModelData, (_, { modelName, gltfData }) => {
    if (modelDataHashMap.has(modelName)) return;
    modelDataHashMap.set(modelName, {
      modelName,
      gltfData,
    });
    // console.log(modelDataHashMap);
    // console.log(globalStore);
  });
  PubSub.subscribe(AddLightData, (_, data) => {
    // console.log(data);
    if (lightsDataHashMap.has(data.name)) return;

    lightsDataHashMap.set(data.name, data);
    // console.log(globalStore);
  });

  const sampleRoomFunctions = {
    Accessories: loadAccesories,
    Furniture: loadFurnitures,
    Lightings: null,
  };

  PubSub.subscribe(
    LandingButtons,
    (_, buttonType: keyof typeof sampleRoomFunctions) => {
      // console.log(buttonType);
      const func = sampleRoomFunctions[buttonType];
      func && func(scene, modelDataHashMap);
      // loadAccesories();
    }
  );

  loadInitialScene({ scene });

  const globalTick = () => {
    setTimeout(function () {
      requestAnimationFrame(globalTick);
    }, 1000 / 30);
    controls.update();
    renderer.render(scene, camera);
  };
  globalTick();
}

async function loadAccesories(
  scene: THREE.Scene,
  modelDataHashMap: Map<any, any>
) {
  const accessoriesDataloader = accessoriesMetaData as Record<string, JsonData>;
  for (const item in accessoriesDataloader) {
    // console.log(item);
    loadModelFromJson({
      jsonData: accessoriesDataloader[item],
      cb: ({ modelData, gltfData }) => {
        PubSub.publish(AddModelData, {
          modelName: modelData.Name,
          gltfData,
        });
        if (modelDataHashMap.has(modelData.Name)) return;
        scene.add(gltfData.scene);
      },
    });
  }
}

async function loadFurnitures(
  scene: THREE.Scene,
  modelDataHashMap: Map<any, any>
) {
  const furnitureData = furnitureMetaData as Record<string, JsonData>;
  // console.log(furnitureData);
  for (const furniture in furnitureData) {
    // console.log(furniture);
    loadModelFromJson({
      jsonData: [furnitureData[furniture][0]],
      cb: ({ modelData, gltfData }) => {
        // console.log({ modelData, gltfData });
        PubSub.publish(AddModelData, {
          modelName: modelData.Name,
          gltfData,
        });
        // console.log(gltfData);
        gltfData?.scene.traverse((item: any) => {
          if (!item.isLight) return;
          // console.log(item);
          PubSub.publish(AddLightData, {
            name: item.name,
            lightType: item.type,
            item,
          });
        });
        if (modelDataHashMap.has(modelData.Name)) return;
        scene.add(gltfData.scene);
      },
    });
  }
}
