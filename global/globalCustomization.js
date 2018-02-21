if(typeof(dojo) != "undefined") {
    require(["dojo/domReady!"], function() {
        dojo.require("dojo.NodeList-manipulate");
        dojo.query("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"/files/customizer/global/globalCustomization.css?repoName=ibmcndevsq\"></link>");
        console.log("finished loading globalCustomization.css");
});
   
}
