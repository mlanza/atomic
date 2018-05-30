import {protocol, satisfies} from "../types/protocol";
export const IPublish = protocol({
  pub: null
});
export const isPublishable = satisfies(IPublish);