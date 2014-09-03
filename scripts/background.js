var RELIABLE_CHECKPOINT = "http://www.google.com/",
    DEFAULT_CHECK_INTERVAL = 108E5,
    RESCHEDULE_DELAY = 9E5,
    MINIMUM_CHECK_SPACING = 1E3,
    BROWSER_ICON = "img/browser_icon.png",
    EPSILON = 500,
    WATCHDOG_INTERVAL = 9E5,
    WATCHDOG_TOLERANCE = 12E4;
(function() {
    var b = 0,
        a = null,
        e = !1,
        d = [];
    triggerSoundAlert = function() {
        var b = getSetting(SETTINGS.sound_alert);
        if (b) {
            var a = new Audio(b);
            a.addEventListener("canplaythrough", function() {
                a && (a.loop && (a.loop = !1), a.play(), a = null)
            })
        }
    };
    triggerDesktopNotification = function() {
        if (getSetting(SETTINGS.notifications_enabled) && !(0 < chrome.extension.getViews({
            type: "popup"
        }).length)) {
            var b = getSetting(SETTINGS.notifications_timeout) || 3E4;
            if (window.webkitNotifications && webkitNotifications.createHTMLNotification) a = window.webkitNotifications.createHTMLNotification("notification.htm"),
                a.show();
            else if (chrome.notifications && chrome.notifications.create) getAllUpdatedPages(function(b) {
                if (0 != b.length) {
                    title = 1 == b.length ? chrome.i18n.getMessage("page_updated_single") : chrome.i18n.getMessage("page_updated_multi", b.length.toString());
                    var c = $.map(b, function(b) {
                            return {
                                title: b.name
                            }
                        }),
                        c = {
                            type: "basic",
                            iconUrl: chrome.extension.getURL("img/extension_icon.png"),
                            title: title,
                            message: "",
                            buttons: c
                        };
                    d = b;
                    null != a && hideDesktopNotification();
                    chrome.notifications.create("", c, function(b) {
                        a = b
                    })
                }
            }), e || (chrome.notifications.onButtonClicked.addListener(function(b,
                a) {
                var c = d[a];
                window.open("diff.htm#" + btoa(c.url));
                BG.setPageSettings(c.url, {
                    updated: !1
                }, function() {
                    updateBadge();
                    takeSnapshot(c.url, scheduleCheck);
                    triggerDesktopNotification()
                })
            }), e = !0);
            else return;
            6E4 >= b && setTimeout(hideDesktopNotification, b)
        }
    };
    hideDesktopNotification = function() {
        null != a && ("string" == typeof a ? chrome.notifications.clear(a, $.noop) : a.cancel(), a = null)
    };
    updateBadge = function() {
        getAllUpdatedPages(function(a) {
            a = a.length;
            chrome.browserAction.setBadgeBackgroundColor({
                color: getSetting(SETTINGS.badge_color) || [0, 180, 0, 255]
            });
            chrome.browserAction.setBadgeText({
                text: a ? String(a) : ""
            });
            chrome.browserAction.setIcon({
                path: BROWSER_ICON
            });
            if (a > b) try {
                triggerSoundAlert(), triggerDesktopNotification()
            } catch (d) {
                console.log(d)
            }
            b = a
        })
    }
})();
(function() {
    var b = 0,
        a = 0;
    actualCheck = function(b, a, c) {
        getAllPages(function(f) {
            function l(b) {
                (c || $.noop)(b);
                h++;
                console.assert(h <= g.length);
                h == g.length && (updateBadge(), scheduleCheck(), (a || $.noop)())
            }
            var k = Date.now(),
                g = b ? f : $.grep(f, function(b) {
                    var a = b.check_interval || getSetting(SETTINGS.check_interval);
                    return b.last_check + a - EPSILON <= k
                }),
                h = 0;
            g.length ? $.each(g, function(b, a) {
                checkPage(a.url, l)
            }) : (updateBadge(), scheduleCheck(), (a || $.noop)())
        })
    };
    applySchedule = function(e) {
        a = Date.now() + e;
        clearTimeout(b);
        b = setTimeout(check,
            e)
    };
    scheduleCheck = function() {
        var b = Date.now();
        getAllPages(function(a) {
            0 != a.length && (a = $.map(a, function(a) {
                if (a.updated || !a.last_check) return b;
                var d = a.check_interval || getSetting(SETTINGS.check_interval);
                return a.last_check + d - b
            }), a = Math.min.apply(Math, a), a < MINIMUM_CHECK_SPACING ? a = MINIMUM_CHECK_SPACING : a == b && (a = DEFAULT_CHECK_INTERVAL), applySchedule(a))
        })
    };
    check = function(a, b, c) {
        $.ajax({
            type: "HEAD",
            url: RELIABLE_CHECKPOINT,
            complete: function(f) {
                f && 200 <= f.status && 300 > f.status ? actualCheck(a, b, c) : (actualCheck(a,
                    b, c), console.log("Network appears down (" + (f && f.status) + "). Checking anyway."))
            }
        })
    };
    watchdog = function() {
        Date.now() - a > WATCHDOG_TOLERANCE && (console.log("WARNING: Watchdog recovered a lost timeout."), scheduleCheck())
    }
})();
(function() {
    var b = null;
    getExtensionVersion = function() {
        if (!b) {
            var a = $.ajax({
                url: "manifest.json",
                async: !1
            }).responseText;
            if (a = JSON.parse(a || "null")) b = a.version
        }
        return b
    }
})();

function insertPages(b, a) {
    for (var e = b.length, d = 0; d < b.length; d++) addPage(b[d], function() {
        0 == --e && (a || $.noop)()
    })
}

function importVersionOnePages(b) {
    var a = [];
    $.each(getSetting("pages_to_check") || {}, function(b, d) {
        a.push({
            url: b,
            name: d.name,
            mode: d.regex ? "regex" : "text",
            regex: d.regex || null
        })
    });
    insertPages(a, b)
}

function importVersionTwoPages(b) {
    var a = getSetting("pages"),
        e = [],
        d;
    for (d in a) {
        var c = a[d];
        e.push({
            url: c,
            name: getSetting(c + " name"),
            mode: getSetting(c + " mode"),
            regex: getSetting(c + " regex"),
            selector: getSetting(c + " selector"),
            check_interval: getSetting(c + " timeout"),
            html: getSetting(c + " html"),
            crc: getSetting(c + " crc"),
            updated: getSetting(c + " updated"),
            last_check: getSetting(c + " last_check"),
            last_changed: getSetting(c + " last_changed")
        })
    }
    insertPages(e, b)
}

function removeUnusedSettings(b) {
    for (var a in b) void 0 === SETTINGS[a] && delete b[a]
}

function fixSoundAlerts() {
    var b = getSetting(SETTINGS.custom_sounds) || [];
    b.unshift({
        name: chrome.i18n.getMessage("sound_cuckoo"),
        url: chrome.extension.getURL("audio/cuckoo.ogg")
    });
    b.unshift({
        name: chrome.i18n.getMessage("sound_chime"),
        url: chrome.extension.getURL("audio/bell.ogg")
    });
    setSetting(SETTINGS.custom_sounds, b);
    var b = /^http:\/\/work\.max99x\.com\/(bell.ogg|cuckoo.ogg)$/,
        a = getSetting(SETTINGS.sound_alert);
    b.test(a) && (b = "audio/" + a.match(b)[1], setSetting(SETTINGS.sound_alert, chrome.extension.getURL(b)))
}

function bringUpToDate(b, a) {
    initializeStorage(function() {
        function e() {
            setSetting(SETTINGS.version, getExtensionVersion());
            removeUnusedSettings(localStorage);
            (a || $.noop)()
        }
        3.1 > b && fixSoundAlerts();
        1 > b ? (setSetting(SETTINGS.badge_color, [0, 180, 0, 255]), setSetting(SETTINGS.check_interval, DEFAULT_CHECK_INTERVAL), setSetting(SETTINGS.sound_alert, null), setSetting(SETTINGS.notifications_enabled, !1), setSetting(SETTINGS.notifications_timeout, 3E4), setSetting(SETTINGS.animations_disabled, !1), setSetting(SETTINGS.sort_by,
            "date added"), setSetting(SETTINGS.view_all_action, "original"), e()) : 2 > b ? (setSetting(SETTINGS.view_all_action, "original"), delSetting("last_check"), importVersionOnePages(e)) : 3 > b ? (setSetting(SETTINGS.check_interval, getSetting("timeout") || DEFAULT_CHECK_INTERVAL), setSetting(SETTINGS.view_all_action, "original"), delSetting("timeout"), importVersionTwoPages(e)) : e()
    })
};


// function syncStorageHandler() {
//     DB.transaction(function(tx) {
//         tx.executeSql("DROP TABLE pages", [], function(tx, result) {
//             initializeStorage();
//             chrome.storage.sync.get("data", function(data) {
//                 for (var i = 0; i < data.length; i++) {
//                     var row = data[i];
//                     addPage($.extend({
//                         url: row.url,
//                         name: row.name,
//                         mode: row.mode
//                     }));
//                 }
//             })
//         });
//     });
// }

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (namespace == "sync") {
        if (changes["updateTime"] == null)
            return;

        if (changes.updateTime.newValue > parseInt(localStorage.getItem("updateTime"))) {
            if (!changes["data"]) {
                for(key in changes) {
                    var storageChange = changes[key];
                    console.log('Storage key "%s" i namespace "%s" changed. '
                                    + 'Old value was "%s", new value is "%s".',
                                key,
                                namespace,
                                storageChange.oldValue,
                                storageChange.newValue);
                    localStorage.setItem(key, storageChange.newValue);
                }
            } else {
                console.log("Local web SQL database should be updated.");
                console.log("Synchronizing...");
                syncStorageHandler();
                localStorage.setItem("updateTime", changes.updateTime.newValue);
            }
        } else
            return;
    } else {
        alert("Hello, you found it.");
    }
});