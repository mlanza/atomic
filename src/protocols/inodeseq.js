import {protocol, satisfies} from "../types/protocol";
export const INodeSeq = protocol({});
export const isNodeSeq = satisfies(INodeSeq);