import {implement} from '../protocol';
import {IText} from '../../protocols';
import {locate} from "../../protocols/ilocate/concrete";
import {query} from "../../protocols/iquery/concrete";
import * as ivalue from "../../protocols/ivalue/concrete";
import {overload, does} from '../../core';

function text1(self){
  const option = locate(query(self, "option"), function(el){
    return el.selected;
  });
  return option && IText.text(option);
}

function text2(self, value){
  const option = locate(query(self, "option"), function(el){
    return IText.text(el) == value;
  });
  option && ivalue.value(self, ivalue.value(option));
}

const text = overload(null, text1, text2);

export default does(
  implement(IText, {text}));