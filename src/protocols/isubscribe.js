import {protocol, satisfies} from "../types/protocol";
export const ISubscribe = protocol({
  sub: null
});
export const isSubscribeable = satisfies(ISubscribe);