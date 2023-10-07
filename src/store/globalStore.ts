export function instance(): Map<any, any> {
  const globalStore = new Map();

  return globalStore;
}

const globalStoreInstance = instance();
export default globalStoreInstance;
