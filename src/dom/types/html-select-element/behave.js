import {overload, does, implement, locate, query} from 'cloe/core';
import {IText} from "../../protocols";
import * as _ from 'cloe/core';

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
  option && _.value(self, _.value(option));
}

const text = overload(null, text1, text2);

export default does(
  implement(IText, {text}));