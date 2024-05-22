import dom from "./atomic_/dom.js";
import sh from "./atomic_/shell.js";
import vd from "./atomic_/validates.js";
import mut from "./atomic_/transients.js";
import { reg } from "./cmd.js";

reg({dom, sh, vd, mut});
