import {protocol, satisfies} from "../protocol";

export const IShow = protocol({
  show: null
});

export const show = IShow.show;
export const isShow = satisfies(IShow);
export default IShow;