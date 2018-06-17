import {overload, multiple} from "./core";

function value1(self){
  return self.value != null ? self.value : null;
}

function value2(self, value){
  if (self.value != null) {
    self.value = value;
  }
}

export const value = multiple(overload(null, value1, value2));

function text1(self){
  return self.nodeType === Node.TEXT_NODE ? self.data : null;
}

function text2(self, text){
  if (self.nodeType === Node.TEXT_NODE) {
    self.data = text;
  }
}

export const text = multiple(overload(null, text1, text2));

function html1(self){
  return self.innerHTML;
}

function html2(self, html){
  self.innerHTML = html;
}

export const html = multiple(overload(null, html1, html2));