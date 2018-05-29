import {protocol, satisfies} from "../types/protocol";
export const IContent = protocol({
  contents: null
});
export const isContent = satisfies(IContent);
