export * from "./html-collection/construct";
import {HTMLCollection} from "./html-collection/construct";
import {behaveAsNodeList} from "./node-list/behave";
behaveAsNodeList(HTMLCollection);