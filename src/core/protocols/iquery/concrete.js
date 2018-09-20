import {satisfies} from "../../types/protocol/concrete";
import {isString} from "../../types/string/construct";
import {matches} from "../../protocols/imatch/concrete";
import {filter} from "../../types/lazy-seq/concrete";
import ISeq from "../../protocols/iseq/instance";
import IQuery from "./instance";

export function query(self, criteria, options){
  if (satisfies(IQuery, self)) {
    return IQuery.query(self, criteria, options);
  } else if (satisfies(ISeq, self)) {
    const pred = isString(criteria) ? matches(v, criteria) : criteria;
    return filter(pred, self);
  } else {
    throw new TypeError("Cannot query");
  }
}