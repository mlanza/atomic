export * from "./node-list/construct";
import {NodeList} from "dom";
import {behaveAsNodeList} from "./node-list/behave";
behaveAsNodeList(NodeList);