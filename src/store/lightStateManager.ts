import globalStoreInstance from './globalStore';

export default function lightStatemanager() {
  const arr = [...Array.from(globalStoreInstance.keys())].map((i) => i);
  console.log(arr);
  type t = (typeof arr)[number];

  const globalStore = globalStoreInstance;
  console.log(globalStoreInstance.keys());
  console.log(Array.from(globalStoreInstance.keys()));

  console.log(globalStore);
  globalStore.get();
}
