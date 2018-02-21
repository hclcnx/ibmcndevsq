if(typeof(dojo) != "undefined") {
    require(["dojo/domReady!"], function() {
        dojo.require("dojo.NodeList-manipulate");
        dojo.query("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"/files/customizer/global/globalCustomization.css?repoName=ibmcndevsq\"></link>");
        
        
var cssLocation = "/files/customizer/global/globalCustomization.css?repoName=ibmcndevsq";
var sc = document.createElement("link");
sc.setAttribute("rel", "stylesheet");
sc.setAttribute("type", "text/css");
sc.setAttribute("href", cssLocation);
document.head.appendChild(sc);

console.log(cssLocation);
        
        console.log("finished loading globalCustomization.css");
});
   
}
