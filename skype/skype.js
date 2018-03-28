function Skype() {

    let loggedIn = false;
    let user = new User();

    this.getPresence = function () {
        if (loggedIn) {
            return console.log("Skype::" + user.name + " is " + user.status);
        }
        console.log("Skype::need to login.");
    };

    this.setStatus = function(status) {
        user.status = status;
    };

    this.getStatus = function() {
        return user.status;
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


let skype = new Skype();

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


require(["dojo/on", "dojo/mouse", "dojo/NodeList-manipulate"], function (on, mouse) {
    dojo.query("head")[0].innerHTML += '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">';
    // Find the notification menu item
    let notificationMenuItem = dojo.query("#notificationsMenu_container");
    let skypeStatusAsset = [];

    if (notificationMenuItem[0]) {

        // get UI language
        let userLanguage = lconn.core.locale.getLanguage();

        let skypeProperties = {
            status: {
                "available": {
                    "nl": "Ik ben beschikbaar",
                    "en": "I am available",
                    icon: {
                            indicator :'<i class="skype current status fas fa-check-circle" data-skype-status="available" style="background-color: white;color: #7FBA00;border-radius: 50%;position: absolute;z-index: 3;margin-top: 6px;margin-left: -5px;"></i>',
                            menu: '<i class="fas fa-check-circle fa-lg" data-skype-status="available" style="background-color: white;color: #7FBA00;border-radius: 50%;margin-right:6px;"></i>'
                        }
                     },
                "away": {
                    "nl": "Ik ben afwezig",
                    "en": "I am away",
                    icon: {
                        indicator :'<i class="skype current status fas fa-clock" data-skype-status="away" style="background-color: white;color: #FCD116;border-radius: 50%;position: absolute;z-index: 3;margin-top: 6px;margin-left: -5px;"></i>',
                        menu: '<i class="fas fa-clock fa-lg" data-skype-status="away" style="background-color: white;color: #FCD116;border-radius: 50%;margin-right:6px;"></i>'
                    }
                    },
                "busy": {
                    "nl": "Ik ben bezet",
                    "en": "I am busy",
                    icon: {
                        indicator :'<i class="skype current status fas fa-minus-circle" data-skype-status="busy" style="background-color: white;color: #E81123;border-radius: 50%;position: absolute;z-index: 3;margin-top: 6px;margin-left: -5px;"></i>',
                        menu: '<i class="fas fa-minus-circle fa-lg" data-skype-status="busy" style="background-color: white;color: #E81123;border-radius: 50%;margin-right:6px;"></i>'
                    }
                    },
                "meeting": {
                    "nl": "Ik zit in een meeting",
                    "en": "In a meeting",
                    icon: {
                        indicator :'<i class="skype current status fas fa-clock" data-skype-status="meeting" style="background-color: white;color: #FCD116;border-radius: 50%;position: absolute;z-index: 3;margin-top: 6px;margin-left: -5px;"></i>',
                        menu: '<i class="fas fa-clock fa-lg" data-skype-status="meeting" style="background-color: white;color: #FCD116;border-radius: 50%;margin-right:6px;"></i>'
                    }
                }
            },

            changeStatus : function(status) {
                skype.setStatus(status);
            }
        };

        // Skype last known status
        skypeStatusAsset[0] = skypeProperties.status["available"].icon.indicator;

        // Create a new Skype menu
        let skypeMenuItem = dojo.create("div", {
            class: "chat rd navmenu nav-tooltip",
            innerHTML: '<i class="skype current status"></i><svg class="help-image nomirror" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><g transform="matrix(1 0 0 -1 0 200)"><path fill="#75263b" d="M193 83c4 -8 7 -17 7 -27c0 -31 -25 -56 -56 -56c-10 0 -19 3 -27 7c-5 -1 -11 -2 -17 -2c-53 0 -95 43 -95 95c0 6 1 11 2 17c-4 8 -7 17 -7 27c0 31 25 56 56 56c10 0 19 -3 27 -7c5 1 11 2 17 2c53 0 95 -43 95 -95c0 -6 -1 -11 -2 -17zM100 40c32 0 48 16 46 35c0 13 -6 28 -30 33l-22 5c-8 2 -18 4 -18 12s7 14 19 14c25 0 23 -17 35 -17c6 0 12 3 12 10c0 16 -24 27 -45 27c-22 0 -46 -10 -46 -35c0 -12 4 -25 28 -31l30 -7c9 -2 11 -7 11 -12c0 -8 -7 -15 -21 -15c-26 0 -23 21 -37 21c-6 0 -11 -5 -11 -11c0 -12 15 -29 49 -29z"></path></g></svg><svg class="menu-image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4.959 2.844"><polygon class="cls-1" points="2.046 2.421 2.046 2.421 2.479 2.844 2.479 2.844 2.479 2.844 2.913 2.421 2.913 2.421 4.959 0.424 4.494 0 2.479 1.997 0.434 0 0 0.424 2.046 2.421"></polygon></svg><ul role="menu" aria-labelledby="bsscom-chatMenu" title="" class="navsimplelist">' +
            '<li class="skype status available">' +
            '<a class="ss_available" role="menuitem" tabindex="0">' +
            skypeProperties.status["available"].icon.menu + skypeProperties.status["available"][userLanguage] +
            '</a></li>' +
            '<li class="skype status away">' +
            '<a class="ss_away" role="menuitem" tabindex="0">' +
            skypeProperties.status["away"].icon.menu  + skypeProperties.status["away"][userLanguage]
            + '</a></li>' +
            '<li class="skype status busy">' +
            '<a class="ss_busy" role="menuitem" tabindex="0">' +
            skypeProperties.status["busy"].icon.menu + skypeProperties.status["busy"][userLanguage] +
            '</a></li>' +
            '<li class="skype status meeting">' +
            '<a class="ss_meeting" role="menuitem" tabindex="0">' +
            skypeProperties.status["meeting"].icon.menu + skypeProperties.status["meeting"][userLanguage] +
            '</a></li>'
        });

        // Select container of network contacts
        let networkContactCard = dojo.query(".sccontact .ccMember .lotusRight.memberRightWrap .lotusLeft.lotusFloatContent .lotusInlinelist.scFontItalic span");
        let skypeChatIcon = '<i class="fas fa-comment fa-lg" style="margin-left: 3px;color: #00aff0;margin-top: 7px;"></i>';

        if (networkContactCard[0]) {

            networkContactCard.forEach(function(tag) {
                //TODO: check if user has Skype
                dojo.place(skypeChatIcon, tag, "before");
            });

        }

        // Add click event to skype menu item
        on(skypeMenuItem, "click", function (evt) {
            dojo.attr(skypeMenuItem, {class: "chat rd navmenu nav-tooltip show"});
        });

        on(skypeMenuItem, mouse.enter, function (evt) {
            dojo.attr(skypeMenuItem, {class: "chat rd navmenu nav-tooltip show"});
        });

        on(skypeMenuItem, mouse.leave, function (evt) {
            dojo.attr(skypeMenuItem, {class: "chat rd navmenu nav-tooltip"});
        });

        dojo.place(skypeMenuItem, notificationMenuItem[0], 'after');
        console.log("Skype::component created…");
        console.log("Skype::get current status");

        // Query skype current state
        let initialState = dojo.query(".skype.current.status");

        if (initialState[0]) {
            dojo.place(skypeStatusAsset[0], initialState[0], "replace");
            console.log("Skype::set initial state");
        }

        let skypeState = dojo.query(".skype");

        if (skypeState[0]) {
            for (let i = 0; i < skypeState.length; i++) {
                on(skypeState[i], "click", function (evt) {
                    let selectedState = skypeState[i].getElementsByTagName("i")[0].getAttribute("data-skype-status");
                    let newStatus = skypeProperties.status[selectedState].icon.indicator;
                    let currentIndicatorStatus = dojo.query(".chat.rd.navmenu.nav-tooltip i");

                    dojo.place(newStatus, currentIndicatorStatus[0], "replace");

                    skypeProperties.changeStatus(skypeProperties.status[selectedState][userLanguage]);
                    console.log(`Skype::change status to ${skype.getStatus()}`);
                });
            }
        }

    }

});


