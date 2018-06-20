import {protocol, satisfies} from "../types/protocol";
export const IHtml = protocol({
  html: null
});
export const isHtml = satisfies(IHtml);