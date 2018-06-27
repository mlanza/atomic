import {protocol, satisfies} from "../types/protocol";
export const IMiddleware = protocol({
  handle: null
});
export const isMiddleware = satisfies(IMiddleware);