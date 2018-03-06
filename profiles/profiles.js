
    require(["dojo/dom-construct", "dojo/query", "dojo/dom-style", "dojo/domReady!"], function (domConstruct, query, domStyle) {
        console.log("profiles js loaded");
        try {
            var waitFor = function (callback, elXpath, maxInter, waitTime) {
                if (!maxInter) var maxInter = 100; // number of intervals before expiring
                if (!waitTime) var waitTime = 10; // 1000=1 second
                if (!elXpath) return;

                var waitInter = 0; // current interval
                var intId = setInterval(function () {
                    if (++waitInter < maxInter && !dojo.query(elXpath).length) return;
                    clearInterval(intId);
                    callback();
                }, waitTime);
            };

            waitFor(function () {
                var el = query(".scHeader.scEditContact").forEach(function (node) {
                    //node will be each node in the list.
                    query('input', node).attr("disabled", true);
                    console.log(node);

                });
                //remove edit button
                query(".scEditButton").forEach(domConstruct.destroy);

                //disable edit from details view
                var detailWindow = query(".lotusDialog").forEach(function (node) {
                    query('.lotusDialogContent .lotusForm2.lotusLeftLabels.scNameDetail .lotusFormBody .lotusFormField input', node).attr("disabled", true);
                    var saveBtn = query('.lotusDialogFooter .lotusFormButton.submit', node);
                    saveBtn.attr("disabled", true);
                    saveBtn.style("background-color", "blue");
                });
            }, ".lotusText");
        } catch (e) {
            console.log("Exception occurred in profilesJS: " + e);
        }

    });

