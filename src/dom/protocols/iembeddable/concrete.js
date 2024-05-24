import * as _ from "atomic/core";
import * as $ from "atomic/shell";

import {IEmbeddable} from "./instance.js";

export const embeddables = IEmbeddable.embeddables;

function embed3(add, parent, children){
  children
    |> _.flatten
    |> _.mapcat(embeddables(?, parent.ownerDocument), ?)
    |> $.each(function(child){
          _.isFunction(child) ? child(parent, add) : add(parent, child);
        }, ?);
}

function embed2(parent, children){
  embed3(function(parent, child){
    parent.appendChild(child);
  }, parent, children);
}

export const embed = _.overload(null, null, embed2, embed3);
