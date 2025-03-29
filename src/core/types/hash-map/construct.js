import {IAssociative} from "../../protocols/iassociative/instance.js";
import {equiv} from "../../protocols/iequiv/concrete.js";
import {reduce} from "../../protocols/ireducible/concrete.js";

export function HashMap(mapped = {}, length = 0, equals = equiv){
  this.mapped = mapped;
  this.length = length;
  this.equals = equals;
}

export function hashMap(entries = [], equals = equiv){
  return reduce(function(memo, [key, value]){
    return IAssociative.assoc(memo, key, value);
  }, new HashMap({}, 0, equals), entries); //entries could be an object
}
