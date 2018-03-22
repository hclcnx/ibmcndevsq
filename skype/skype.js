    function Skype() {

        let loggedIn = false;
        let user = new User();

        this.getPresence = function () {
            if (loggedIn) {
                return console.log("Skype::" + user.name + " is " + user.status);
            }
            console.log("Skype::need to login.");
        };

        this.authenticate = function () {
            loggedIn = true;
            console.log("Skype::authenticating user...");
            user.name = "Foo";
            user.status = "Available";
        };

        this.logout = function () {
            loggedIn = false;
            console.log("Skype::session terminated");
        };

    }

    function User() {

        this.name = '';
        this.status = "unknown";
    }


    if (typeof (dojo) != "undefined") {
        require(["dojo/domReady!"], function (d) {
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


    require(["dojo/request/xhr", "dojo/request/iframe", "dojo/request"], function (xhr, iframe, request) {
        const baseUrl = "sanquin.nl";

        let promise = xhr.get(`https://webdir1e.online.lync.com/Autodiscover/AutodiscoverService.svc/root?originalDomain=${baseUrl}`, {
            handleAs: "xml",
            preventCache: true
        });

        let _authLink = "";
        let _grantType = "";
        let _userLink = "";
        let _userToken = "";

        function getUserLink() {
            return promise.then(function (data) {
                    let usrHref = JSON.parse(data);
                    _userLink = usrHref._links.user.href;

                },
                function (err) {
                },
                function (evt) {
                });
        }

        getUserLink().then(function () {

            console.log(`Configuration:: ${_userLink}`);


            let authLink = xhr.get(_userLink, {
                handleAs: "xml"
            });

            function getAuthenticationLink() {
                return authLink.then(function (data) {
                        console.log("Data::" + data);
                    }, function (err) {

                        let authHref = err.response.getHeader("WWW-authenticate");
                        let headerValues = authHref.split(",");

                        for (let i = 0; i < headerValues.length; i++) {
                            let key = headerValues[i].split("=");

                            if (key[0].trim().replace(/ /g, "_").toLowerCase() === "msrtcoauth_href") {
                                _authLink = key[1].replace(/\"/g, "");
                            }

                            if (key[0].trim().replace(/ /g, "_").toLowerCase() === "grant_type") {
                                _grantType = key[1].replace(/\"/g, "");
                            }
                        }

                    },
                    function (evt) {
                    });
            }

            getAuthenticationLink().then(function () {
                console.log(`Configuration - Auth. link:: ${_authLink}`);
                console.log(`Configuration - Grant Type:: ${_grantType}`);

                console.log(_authLink);
                let authorization = iframe(_authLink, {
                    handleAs: "html",
                    method: "POST",
                    preventCache: false,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        'grant_type': _grantType
                    }
                });


                function getCredentials() {

                    return authorization.then(function(d) {
                        console.log(d);
                    }, function(err){
                        console.log("error:" + err);
                    }, function(evt){

                    });
                }

                getCredentials().then(function() {
                    console.log("testing ...");
                });

            });

        });



    });
