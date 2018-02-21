if(typeof(dojo) != "undefined") {
    
    dojo.addOnLoad(function(){
       dojo.place(
        "<link rel=\"stylesheet\" type=\"text/css\" href=\"/files/customizer/global/globalCustomization.css?repoName=ibmcndevsq\"></link>",
        dojo.doc.getElementsByTagName("head")[0].lastChild,
        "after"
    );
        
     console.log("finished loading globalCustomization.css--");
  
});
  
   
}
