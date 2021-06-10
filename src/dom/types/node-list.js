export * from "./node-list/construct.js";
import {NodeList} from "dom";
import {behaveAsNodeList} from "./node-list/behave.js";
behaveAsNodeList(NodeList);