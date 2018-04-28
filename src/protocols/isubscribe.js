import {protocol, satisfies} from "../protocol";

export const ISubscribe = protocol({
  sub: null
});

export const sub = ISubscribe.sub;
export const isSubscribe = satisfies(ISubscribe);
export default ISubscribe;