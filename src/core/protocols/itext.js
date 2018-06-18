import {protocol, satisfies} from "../types/protocol";
export const IText = protocol({
  text: null
});
export const isText = satisfies(IText);