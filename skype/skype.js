function Skype() {

    let loggedIn = false;
    let user = new User();

    this.getPresence = function() {
        if (loggedIn) {
            return console.log("Skype::" + user.name + " is " + user.status);
        }
        console.log("Skype::need to login.");
    };

    this.authenticate = function() {
        loggedIn = true;
        console.log("Skype::authenticating user...");
        user.name = "Foo";
        user.status = "Available";
    };

    this.logout = function() {
        loggedIn = false;
        console.log("Skype::session terminated");
    };

}

function User() {

    this.name = '';
    this.status = "unknown";
}


if (typeof (dojo) !=  "undefined") {
    require(["dojo/domReady!"], function () {
        try {
            // utility function to let us wait for a specific element of the page to load...
            var waitFor = function (callback, elXpath, elXpathRoot, maxInter, waitTime) {
                if (!elXpathRoot) var elXpathRoot = dojo.body();
                if (!maxInter) var maxInter = 10000;  // number of intervals before expiring
                if (!waitTime) var waitTime = 1;  // 1000=1 second
                if (!elXpath) return;
                var waitInter = 0;  // current interval
                var intId = setInterval(function () {
                    if (++waitInter < maxInter && !dojo.query(elXpath, elXpathRoot).length) return;

                    clearInterval(intId);
                    if (waitInter >= maxInter) {
                        console.log("**** WAITFOR [" + elXpath + "] WATCH EXPIRED!!! interval " + waitInter + " (max:" + maxInter + ")");
                    } else {
                        console.log("**** WAITFOR [" + elXpath + "] WATCH TRIPPED AT interval " + waitInter + " (max:" + maxInter + ")");
                        callback();
                    }
                }, waitTime);
            };

            // here we use waitFor to wait on the .lotusStreamTopLoading div.loaderMain.lotusHidden element
            // before we proceed to customize the page...
            waitFor(function () {
                    // wait until the "loading..." node has been hidden
                    // indicating that we have loaded content.

                    let skype = new Skype();

                    skype.getPresence();
                    skype.authenticate();
                    skype.getPresence();
                    skype.logout();
                    skype.getPresence();

                },
                ".lotusStreamTopLoading div.loaderMain.lotusHidden");
        } catch (e) {
            console.log("Exception occurred in Skype: " + e);
        }
    });
}
