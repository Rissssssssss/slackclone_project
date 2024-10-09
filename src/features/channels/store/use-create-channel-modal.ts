import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreatChannelModal = () => {
    return useAtom(modalState);
};
