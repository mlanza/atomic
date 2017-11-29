import {objectSelection} from '../../types/objectselection';
import {extendType} from '../../protocol';
import ISeqable from '../../protocols/iseqable';
import IShow from '../../protocols/ishow';
import ICounted from '../../protocols/icounted';
import {count} from '../../protocols/icounted';
import {first, rest, toArray} from "../../protocols/iseq";
import {seq} from "../../protocols/iseqable";
import {show} from "../../protocols/ishow";

extendType(Object, ISeqable, {
  seq: function(self){
    return objectSelection(self, Object.keys(self));
  }
}, ICounted, {
  count: function(self){
    return count(Object.keys(self));
  }
}, IShow, {
  show: function(self){
    var xs = toArray(seq(self));
    return "{" + xs.map(function(pair){
      return show(pair[0]) + ": " + show(pair[1]);
    }).join(", ") + "}";
  }
});