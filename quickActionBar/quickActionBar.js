// ==UserScript==
// @name         quickActionBar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://apps.ce.collabserv.com/homepage/*
// @grant        none
// ==/UserScript==

if (typeof(dojo) != "undefined") {
    require(["dojo/domReady!"], function () {
        try {
            // utility function to wait for a specific element to load...
            var waitFor = function (callback, eXpath, eXpathRt, maxIV, waitTime) {
                if (!eXpathRt) eXpathRt = dojo.body();
                if (!maxIV) maxIV = 10000; // intervals before expiring
                if (!waitTime) waitTime = 1; // 1000=1 second
                if (!eXpath) return;
                var waitInter = 0; // current interval
                var intId = setInterval(function () {
                    var maxInter = 0;
                    if (++waitInter < maxIV && !dojo.query(eXpath, eXpathRt).length)
                        return;

                    clearInterval(intId);
                    if (waitInter >= maxIV) {
                        console.log("**** WAITFOR [" + eXpath + "] WATCH EXPIRED!!! interval " + waitInter + " (max:" + maxIV + ")");
                    } else {
                        console.log("**** WAITFOR [" + eXpath + "] WATCH TRIPPED AT interval " + waitInter + " (max:" + maxInter + ")");
                        callback();
                    }
                }, waitTime); // end setInterval()
            }; // end waitFor()

            // here we use waitFor to wait for the
            // .lotusStreamTopLoading div.loaderMain.lotusHidden element
            // before we proceed to customize the page...
            waitFor(function () {
                // wait until the "loading..." node has been hidden
                // indicating that we have loaded content.

                quickActionBar();

            }, ".lotusStreamTopLoading div.loaderMain.lotusHidden");

        } catch (e) {
            alert("Exception occurred in GetStarted: " + e);
        }
    });
}

let quickActionBar = function () {
    var lotusHeader = dojo.query("#activityStreamHeader")[0];
    var quickActionBar = `<table id="quick-action-bar" border="0" dir="ltr" style="border-color: rgb(105, 105, 105); width: 100%; border-collapse: collapse;">
                            <tbody>
                                <tr>
                                    <td><a href="https://apps.ce.collabserv.com/wikis/home?lang=nl-nl#!/wiki/W7799c7350ebd_4fe5_b4fd_7602428b61a0/page/Snel%20beginnen"><img alt="" src="https://apps.ce.collabserv.com/files/form/api/library/aceacc72-de7d-4e43-9f10-81810890f70a/document/cc307915-0348-4a2a-9112-efccfbb540a1/media/KNOP%20Snel%20beginnen.png" style="width: 100%;"></a></td>
                                    <td><a href="https://apps.ce.collabserv.com/wikis/home?lang=nl-nl#!/wiki/W7799c7350ebd_4fe5_b4fd_7602428b61a0"><img alt="" src="https://apps.ce.collabserv.com/files/form/api/library/aceacc72-de7d-4e43-9f10-81810890f70a/document/737dbf2e-ab3d-4fab-bcc7-c17fbb5d22fb/media/KNOP%20Handleidingen.png" style="width: 100%;"></a></td>
                                    <td><a href="https://apps.ce.collabserv.com/blogs/1db648b8-6150-419a-b368-3bba07b0542d?lang=nl_nl"><img alt="" src="https://apps.ce.collabserv.com/files/form/api/library/aceacc72-de7d-4e43-9f10-81810890f70a/document/d9f2bdba-73e0-4807-95f0-9e27aa693bc6/media/KNOP%20Ervaringen.png" style="width: 100%;"></a></td>
                                    <td><a href="https://apps.ce.collabserv.com/forums/html/forum?id=71d5591c-6ea2-491f-a5a2-b3f692f94da9" target="_self"><img alt="" src="https://apps.ce.collabserv.com/files/form/api/library/aceacc72-de7d-4e43-9f10-81810890f70a/document/ab6aea2f-1395-44af-816e-ec103c4e7f6a/media/KNOP%20Help%20elkaar.png" style="width: 100%;"></a></td>
                                    <td><a href="https://apps.ce.collabserv.com/forums/html/forum?id=8854c874-6468-4c68-8d54-9b800de29b63&amp;filter=topics"><img alt="" src="https://apps.ce.collabserv.com/files/form/api/library/aceacc72-de7d-4e43-9f10-81810890f70a/document/dfd03770-d6e2-4a77-b118-7bd1c86b9493/media/KNOP%20Technische%20problemen.png" style="width: 100%;"></a></td>
                                </tr>
                            </tbody>
                        </table>`;

    dojo.place(quickActionBar, lotusHeader, "before");
};