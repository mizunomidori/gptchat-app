import { atom } from "recoil";
import { MessageType } from "../types/custom";

export const chatLogState = atom<MessageType[]>({
  key: 'chatLogState',
  default: [
    { content: 'helllo', role: 'system' },
  ],
});
