if (typeof (dojo) != "undefined") {
    dojo.ready(function () {
        dojo.query("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"/files/customizer/global/globalCustomization.min.css?repoName=ibmcndevsq\"></link>");

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

            waitFor(function () { document.querySelector('.orglogo').src = '/files/customizer/global/2031825077012.png?repoName=ibmcndevsq'; }, '.orglogo');
        } catch (e) {
            console.log("Exception occurred in globalJs: " + e);
        }
    });
}

console.log("dojo test123");
