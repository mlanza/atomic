import {protocol, satisfies} from "../types/protocol";
export const IAppendable = protocol({
  append: null
});
export const isAppendable = satisfies(IAppendable);