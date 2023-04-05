import { writable } from "svelte/store";

export const chatHistory = writable([]);
//activeChat stucture: {friendname: "", friendPublicKey: ""}
export const activeChat = writable({});
