import {protocol, satisfies} from "../types/protocol";
export const INamed = protocol({
  name: null
});
export const isNamed = satisfies(INamed);