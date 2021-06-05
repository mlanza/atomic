import {does} from '../../core';
import {implement} from '../protocol';
import {IEquiv, IAssociative} from '../../protocols';
import Symbol from 'symbol';

function equiv(self, other){
  return other && other.constructor === self.constructor && self.id === other.id;
}

export const behaveAsGuid = does(
  implement(IEquiv, {equiv}));