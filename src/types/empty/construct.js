import {constantly} from "../../core";

export default function Empty(){}
export const EMPTY = Empty.EMPTY = new Empty();
export const empty = constantly(EMPTY);