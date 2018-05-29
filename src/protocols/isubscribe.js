import {protocol, satisfies} from "../types/protocol";
export const ISubscribe = protocol({
  sub: null
});
export const isSubscribe = satisfies(ISubscribe);