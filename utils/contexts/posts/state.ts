import { PostHeading } from "../../../types/Post";
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const postsState = atom<PostHeading[] | undefined>({
  key: "posts",
  default: undefined,
  effects: [persistAtom],
});
