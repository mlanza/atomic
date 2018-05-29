import {protocol, satisfies} from "../types/protocol";
export const IShow = protocol({
  show: null
});
export const isShow = satisfies(IShow);