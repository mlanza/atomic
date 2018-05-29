import {protocol, satisfies} from "../types/protocol";
export const IEvented = protocol({
  on: null,
  off: null
});
export const isEvented = satisfies(IEvented);