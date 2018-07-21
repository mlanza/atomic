import {overload} from "../../core";
import IPush from "./instance";
import {each} from "../../types/lazy-seq/concrete";

export function push(self, ...items){
  each(function(item){
    IPush.push(self, item);
  }, items);
}