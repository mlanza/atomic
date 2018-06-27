import {protocol, satisfies} from "../types/protocol";
export const IDispatch = protocol({
  dispatch: null
});
export const canDispatch = satisfies(IDispatch);
