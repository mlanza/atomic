import {protocol, satisfies} from "../types/protocol";
export const IContent = protocol({
  contents: null
});
export const contents = IContent.contents;
export const isContent = satisfies(IContent);
export default IContent;