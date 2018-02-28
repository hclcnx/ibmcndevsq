dojo.require("dojo.NodeList-manipulate");

if(typeof(dojo) != "undefined") {

  dojo.ready(function(){
    dojo.query("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"/files/customizer/global/globalCustomization.css?repoName=ibmcndevsq\"></link>");
  
  if (document.getElementsByClassName("orglogo").length == 0) {

var insertAt = document.getElementsByClassName("org _myorg")[0];
var elem = document.createElement("img");

elem.src = "/files/customizer/global/2031825077012.png?repoName=ibmcndevsq";
elem.setAttribute("height", "38");
elem.setAttribute("width", "90");
elem.setAttribute("alt", "Sanquin");
insertAt.parentNode.insertBefore(elem, insertAt);
}
    
    console.log("dojo test 1");
  });
}

console.log("dojo test");
