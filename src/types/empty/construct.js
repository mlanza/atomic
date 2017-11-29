import {constantly} from "../../core";

export function Empty(){}
export const EMPTY = Empty.EMPTY = new Empty();
export const empty = constantly(EMPTY);
export default Empty;