import {protocol, satisfies} from "../types/protocol";
export const IDisposable = protocol({
  dispose: null
});
export const isDisposable = satisfies(IDisposable);