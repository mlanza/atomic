import {protocol, satisfies} from "../protocol";
export const IAppendable = protocol({
  append: null
});
export const append = IAppendable.append;
export const isAppendable = satisfies(IAppendable);
export default IAppendable;