/*!
 * RequireJS xml plugin v0.01
 * https://github.com/CindyLinz/RequireJS-xml
 *
 * Copyright 2012, Cindy Wang (CindyLinz)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Date: 2012.4.22
 */
define({
    load: function(name, requ, load, config){
        if( !window.XMLHttpRequest )
            window.XMLHttpRequest = function (){
                try{ return new ActiveXObject("Msxml2.XMLHTTP.6.0") }
                catch(e){}
                try{ return new ActiveXObject("Msxml2.XMLHTTP.3.0") }
                catch(e){}
                try{ return new ActiveXObject("Microsoft.XMLHTTP") }
                catch(e){}
                throw new Error("No AJAX support.");
            };

        var req = new window.XMLHttpRequest();
        req.onreadystatechange = function(){
            if (req.readyState==4) {
                if (req.status == 404){
                    load(null);
                } else if (req.status!=200) {
                    throw new Error("Load "+requ.toUrl(name)+" but get status "+req.status);
                } else {
                    var parser = new DOMParser();
                    load(parser.parseFromString(req.response, "text/xml"));
                }
            }
        };

        req.open('GET', requ.toUrl(name));
        req.send(null);
    }
})
