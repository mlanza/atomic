import {protocol, satisfies} from "../types/protocol";
export const IHideable = protocol({
  hide: null,
  show: null,
  toggle: null
});
export const isHideable = satisfies(IHideable);