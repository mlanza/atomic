import {protocol, satisfies} from "../types/protocol";
export const IEvented = protocol({
  on: null,
  off: null
});
export const on = IEvented.on;
export const off = IEvented.off;
export const isEvented = satisfies(IEvented);
export default IEvented;