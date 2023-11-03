import * as SecureStore from 'expo-secure-store';

export let serverAddr;
export let serverPort;

export async function initCfg() {
    serverAddr = await SecureStore.getItemAsync("srvAddr") || "192.168.0.1"
    serverPort = await SecureStore.getItemAsync("srvPort") || "8080"
}

export async function setServerAddr(str) {
    serverAddr = str;
    await SecureStore.setItemAsync("srvAddr", str);
}

export async function setServerPort(str) {
    serverPort = str;
    await SecureStore.setItemAsync("srvPort", str);
}
