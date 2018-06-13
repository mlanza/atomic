import {protocol, satisfies} from "../types/protocol";
export const IYank = protocol({
  yank: null
});
export const isYankable = satisfies(IYank);