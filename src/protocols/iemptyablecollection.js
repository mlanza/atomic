import {protocol, satisfies} from "../types/protocol";
export const IEmptyableCollection = protocol({
  empty: null
});
export const empty = IEmptyableCollection.empty;
export const isEmptyableCollection = satisfies(IEmptyableCollection);
export default IEmptyableCollection;