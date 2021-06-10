export * from "./multimap/construct.js";
import {Multimap} from "./multimap/construct.js";
import {behaveAsMultimap} from "./multimap/behave.js";
behaveAsMultimap(Multimap);