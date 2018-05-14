import {protocol, satisfies} from "../protocol";
export const IPublish = protocol({
  pub: null
});
export const pub = IPublish.pub;
export const isPublish = satisfies(IPublish);
export default IPublish;