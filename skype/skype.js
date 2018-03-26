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

                return authorization.then(function (d) {
                    console.log(d);
                }, function (err) {
                    console.log("error:" + err);
                }, function (evt) {

                });
            }

            getCredentials().then(function () {
                console.log("testing ...");
            });

        });

    });


});


require(["dojo/on", "dojo/mouse"], function (on, mouse) {
    // Find the notification menu item
    let notificationMenuItem = dojo.query("#notificationsMenu_container");

    let skypeStatusAsset = [];

    if (notificationMenuItem[0]) {

        let skypeMenuOpts;

        // Determine UI language
        if (lconn.core.locale.getLanguage() === "nl") {
            skypeMenuOpts = ["Bereikbaar", "Afwezig", "Bezet", "Vergadering"];
        } else {
            skypeMenuOpts = ["Available", "Away", "Busy", "Meeting"];
        }

        // Create a new Skype menu
        let skypeMenuItem = dojo.create("div", {
            class: "chat rd navmenu nav-tooltip",
            innerHTML: '<svg class="help-image nomirror" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g transform="matrix(1 0 0 -1 0 200)"><path fill="#75263b" d="M193 83c4 -8 7 -17 7 -27c0 -31 -25 -56 -56 -56c-10 0 -19 3 -27 7c-5 -1 -11 -2 -17 -2c-53 0 -95 43 -95 95c0 6 1 11 2 17c-4 8 -7 17 -7 27c0 31 25 56 56 56c10 0 19 -3 27 -7c5 1 11 2 17 2c53 0 95 -43 95 -95c0 -6 -1 -11 -2 -17zM100 40c32 0 48 16 46 35c0 13 -6 28 -30 33l-22 5c-8 2 -18 4 -18 12s7 14 19 14c25 0 23 -17 35 -17c6 0 12 3 12 10c0 16 -24 27 -45 27c-22 0 -46 -10 -46 -35c0 -12 4 -25 28 -31l30 -7c9 -2 11 -7 11 -12c0 -8 -7 -15 -21 -15c-26 0 -23 21 -37 21c-6 0 -11 -5 -11 -11c0 -12 15 -29 49 -29z"></path></g></svg><svg class="menu-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4.959 2.844"><polygon class="cls-1" points="2.046 2.421 2.046 2.421 2.479 2.844 2.479 2.844 2.479 2.844 2.913 2.421 2.913 2.421 4.959 0.424 4.494 0 2.479 1.997 0.434 0 0 0.424 2.046 2.421"></polygon></svg><ul role="menu" aria-labelledby="bsscom-chatMenu" title="" class="navsimplelist">' +
            '<li class="skype ss_available" style="padding:6px;margin-left:10px;margin-right:30px;min-width:70px"><div style="color: #7FBA00;background-color:#7FBA00;content:f109;border-radius:50%;width:14px;height:14px;"><a class="ss_available" role="menuitem" style="margin-left:10px; margin-right:10px;"  tabindex="0">' + skypeMenuOpts[0] + '</a></div></li>' +
            '<li class="skype ss_away" style="padding:6px;margin-left:10px;margin-right:30px;min-width:70px"><div style="color: #FCD116;background-color:#FCD116;content:f109;border-radius:50%;width:14px;height:14px;"><a class="ss_away" role="menuitem" style="margin-left:10px; margin-right:10px;"  tabindex="0">' + skypeMenuOpts[1] + '</a></div></li>' +
            '<li class="skype ss_busy" style="padding:6px;margin-left:10px;margin-right:30px;min-width:70px"><div style="color: #E81123;background-color:#E81123;content:f109;border-radius:50%;width:14px;height:14px;"><a class="ss_busy" role="menuitem" style="margin-left:10px; margin-right:10px;"  tabindex="0">' + skypeMenuOpts[2] + '</a></div></li>' +
            '<li class="skype ss_meeting" style="padding:6px;margin-left:10px;margin-right:30px;min-width:70px"><div style="color: #FCD116;background-color:#FCD116;content:f109;border-radius:50%;width:14px;height:14px;"><a class="ss_meeting" role="menuitem" style="margin-left:10px; margin-right:10px;"  tabindex="0">' + skypeMenuOpts[3] + '</a></div></li>'
        });
        console.log(skypeMenuItem);

        // Add click event to skype menu item
        on(skypeMenuItem, "click", function (evt) {
            dojo.attr(skypeMenuItem, {class: "chat rd navmenu nav-tooltip show"});
        });

        dojo.place(skypeMenuItem, notificationMenuItem[0], 'after');
        console.log("Skype component created…");

        let skypeStatus = dojo.query(".skype");

        if (skypeStatus[0]) {

            for (let i = 0; i < skypeStatus.length; i++) {
                on(skypeStatus[i], "click", function (evt) {
                    console.log(`Skype::change status to ${skypeStatus[i].getElementsByTagName("a")[0].innerHTML}`);
                });
            }

        }
        
    }

});
