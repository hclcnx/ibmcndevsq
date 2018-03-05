if (typeof (dojo) != "undefined") {
    require(["dojo/dom-construct", "dojo/query", "dojo/domReady!"], function (domConstruct, query) {

        var el = query(".scHeader.scEditContact").forEach(function (node) {
            //node will be each node in the list.
            query('input', node).attr("disabled", true);
            console.log(node);

        });
        //remove edit button
        query(".scEditButton").forEach(domConstruct.destroy); 
    });
}
