dojo.require("dojo.NodeList-manipulate");

if(typeof(dojo) != "undefined") {

  dojo.ready(function(){
    dojo.query("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"/files/customizer/communities/communities.min.css?repoName=ibmcndevsq\"></link>");
  });
}

console.log("dojo communities test");
