import {protocol, satisfies} from "../types/protocol";
export const IEvented = protocol({
  on: null,
  off: null,
  trigger: null
});
export const isEvented = satisfies(IEvented);