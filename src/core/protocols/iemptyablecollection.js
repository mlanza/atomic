import {protocol, satisfies} from "../types/protocol";
export const IEmptyableCollection = protocol({
  empty: null
});
export const isEmptyableCollection = satisfies(IEmptyableCollection);