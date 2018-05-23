import {protocol, satisfies} from "../types/protocol";
export const IShow = protocol({
  show: null
});
export const show = IShow.show;
export const isShow = satisfies(IShow);
export default IShow;