import {effect} from "../../core";
import {implement} from '../protocol';
import {IReduce, IElementEmbeddable} from '../../protocols';
import {reduced} from '../../types/reduced';

function embedIn(self, parent){
  IReduce.reduce(self, function(memo, name){
    memo.add(name);
    return memo;
  }, parent.classList);
}

function unembedIn(self, parent){
  IReduce.reduce(self, function(memo, name){
    memo.remove(name);
    return memo;
  }, parent.classList);
}

function embeddedIn(self, parent){
  return IReduce.reduce(self, function(memo, name){
    return memo ? memo.contains(name) : reduced(memo);
  }, true);
}

function toggleEmbedIn(self, parent){
  IReduce.reduce(self, function(memo, name){
    memo.contains(name) ? memo.remove(name) : memo.add(name);
    return memo;
  }, parent.classList);
}

export default effect(
  implement(IElementEmbeddable, {embedIn, unembedIn, embeddedIn, toggleEmbedIn}));