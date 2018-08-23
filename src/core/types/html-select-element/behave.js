import {implement} from '../protocol';
import {IText} from '../../protocols';
import {detect} from "../lazy-seq/concrete";
import * as ihierarchy from "../../protocols/ihierarchy/concrete";
import * as ivalue from "../../protocols/ivalue/concrete";
import {overload, does} from '../../core';

function text1(self){
  const option = ihierarchy.sel1(function(el){
    return el.selected;
  }, ihierarchy.sel("option", self));
  return option && IText.text(option);
}

function text2(self, value){
  const option = detect(function(el){
    return IText.text(el) == value;
  }, ihierarchy.sel("option", self));
  option && ivalue.value(self, ivalue.value(option));
}

const text = overload(null, text1, text2);

export default does(
  implement(IText, {text}));