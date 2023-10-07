import { Vector3 } from 'three';
import modelLoader from './gltfLoader';
import { AddLightData, AddModelData } from '../utils/pubSubEvnets';
import { initialSceneMetaData } from '../metadata';

export type initialSceneMetaData = typeof initialSceneMetaData;

type InitlaDataKeys = keyof initialSceneMetaData;

// type ModelDataType = (typeof initialSceneMetaData)[InitlaDataKeys][number];

type InitalProps = {
  scene: THREE.Scene;
};

export async function loadInitialScene({ scene }: InitalProps) {
  let blindsPos: Vector3;
  for (const data in initialSceneMetaData) {
    const metadata = initialSceneMetaData[data as InitlaDataKeys];
    // console.log({ metadata });
    await loadModelFromJson({
      jsonData: metadata,
      scene,
      // @ts-ignore
      cb: ({ modelData, gltfData }) => {
        // console.log({ modelData, gltfData }, modelData.Name);
        PubSub.publish(AddModelData, {
          modelName: modelData.Name,
          gltfData,
        });

        gltfData.scene.traverse((item) => {
          if (!item.isLight) return;
          // console.log(item);
          PubSub.publish(AddLightData, {
            name: item.name,
            lightType: item.type,
            item,
          });
        });
        if (modelData.Name === 'Room') {
          blindsPos = gltfData.scene.getObjectByName('BlindsPosition').position;
        }
        if (data === 'Blinds') {
          gltfData.scene.position.copy(blindsPos);
        }
      },
    });
  }
}

export type JsonData = {
  Name: string;
  modelUrl: string;
}[];

interface ModelFromJsonProps {
  jsonData: JsonData;
  scene?: THREE.Scene;
  cb?: <T>(args: T) => void;
}

const loadModelFromJson = async ({
  jsonData,
  scene,
  cb,
}: ModelFromJsonProps) => {
  // console.log({ jsonData });
  const metadata = jsonData;
  await Promise.all(
    metadata.map(async (modelData, i) => {
      const data = await modelLoader(modelData);
      cb && cb({ modelData, gltfData: data?.gltfData });
      scene?.add(data?.gltfData.scene);
    })
  );
};

export { loadModelFromJson };
