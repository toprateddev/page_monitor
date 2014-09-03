var SETTINGS = {
        check_interval: "check_interval",
        badge_color: "badge_color",
        version: "version",
        sound_alert: "sound_alert",
        notifications_enabled: "notifications_enabled",
        notifications_timeout: "notifications_timeout",
        animations_disabled: "animations_disabled",
        sort_by: "sort_by",
        custom_sounds: "custom_sounds",
        view_all_action: "view_all_action",
        hide_deletions: "hide_deletions",
        show_full_page_diff: "show_full_page_diff"
    },
    BG = chrome.extension.getBackgroundPage(),
    DB = openDatabase("pages", "1.0", "Monitored Pages", 51380224),
    REGEX_TIMEOUT = 7E3,
    REGEX_WORKER_PATH = "scripts/regex.js",
    REQUEST_TIMEOUT = 1E4,
    MIN_BODY_TAIL_LENGTH = 100,
    DATABASE_STRUCTURE = "CREATE TABLE IF NOT EXISTS pages (   `url` TEXT NOT NULL UNIQUE,   `name` TEXT NOT NULL,   `mode` TEXT NOT NULL DEFAULT 'text',   `regex` TEXT,   `selector` TEXT,   `check_interval` INTEGER,   `html` TEXT NOT NULL DEFAULT '',   `crc` INTEGER NOT NULL DEFAULT 0,   `updated` INTEGER,   `last_check` INTEGER,   `last_changed` INTEGER );";
(function() {
    var a = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101,
        3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271,
        366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376,
        3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954,
        1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836,
        1088359270, 936918E3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117
    ];
    crc = function(b) {
        if ("string" != typeof b) return null;
        b = encodeUTF8(b);
        for (var d = b.length, c = 4294967295, e = 0; e < d; e++) c = c >>> 8 ^ a[c & 255 ^ b.charCodeAt(e)];
        return c ^ -1
    }
})();

function encodeUTF8(a) {
    for (var b = [], d = 0; d < a.length; d++) {
        var c = a.charCodeAt(d);
        128 > c ? b.push(String.fromCharCode(c)) : (127 < c && 2048 > c ? b.push(String.fromCharCode(c >> 6 | 192)) : (b.push(String.fromCharCode(c >> 12 | 224)), b.push(String.fromCharCode(c >> 6 & 63 | 128))), b.push(String.fromCharCode(c & 63 | 128)))
    }
    return b.join("")
}

function describeTime(a) {
    a = Math.floor(a / 1E3);
    var b = Math.floor(a / 60) % 60,
        d = Math.floor(a / 3600) % 24,
        c = Math.floor(a / 86400),
        e = "";
    if (c) var f = chrome.i18n.getMessage("day"),
        g = chrome.i18n.getMessage("days", c.toString()),
        e = e + (1 == c ? f : g);
    d && (f = chrome.i18n.getMessage("hour"), g = chrome.i18n.getMessage("hours", d.toString()), e += " " + (1 == d ? f : g));
    !c && b && (f = chrome.i18n.getMessage("minute"), g = chrome.i18n.getMessage("minutes", b.toString()), e += " " + (1 == b ? f : g));
    e || (f = chrome.i18n.getMessage("second"), g = chrome.i18n.getMessage("seconds",
        a.toString()), e += " " + (1 == a ? f : g));
    return e.replace(/^\s+|\s+$/g, "")
}

function describeTimeSince(a) {
    return chrome.i18n.getMessage("ago", describeTime(Date.now() - a))
}

function getStrippedBody(a) {
    var b = a.match(/<body[^>]*>(?:([^]*)<\/body>([^]*)|([^]*))/i),
        b = b && 1 < b.length ? b[2] && b[2].length > MIN_BODY_TAIL_LENGTH ? b[1] + " " + b[2] : void 0 === b[1] ? b[3] : b[1] : a;
    return b.replace(/<script\b[^>]*(?:>[^]*?<\/script>|\/>)/ig, "<blink/>")
}

function getFavicon(a) {
    return "chrome://favicon/" + a
}

function applyLocalization() {
    $(".i18n[title]").each(function() {
        $(this).removeClass("i18n").text(chrome.i18n.getMessage($(this).attr("title"))).attr("title", "")
    })
}

function getSetting(a, b) {
    if (b == undefined || b == null) {
        if ( a == "sort_by" || a == "view_all_action" || a == "sound_alert" )
            return localStorage.getItem(a);
        else
            return JSON.parse(localStorage.getItem(a) || "null");
    }
    else {
        if (b)
            return JSON.parse(chrome.storage.sync.get(a) || "null");
        else
            return JSON.parse(chrome.storage.local.get(a) || "null");
    }
}

function setupdateTime() {
    var curTime = (new Date).getTime();
    localStorage.setItem("updateTime", curTime);
    chrome.storage.sync.set({updateTime: curTime});
}

function setSetting(a, b, c) {
    var temp = {},
        curTime = (new Date).getTime();

    if (c == undefined || c == null)
        localStorage.setItem(a, JSON.stringify(b));
    else {
        if (c)
            chrome.storage.sync.set(a, JSON.stringify(b));
        else
            chrome.storage.local.set(a, JSON.stringify(b));
    }

    console.log(a + " updated so that the value should be updated in syncStorage.");
    localStorage.setItem("updateTime", curTime);
    temp[a] = b;
    temp.updateTime = curTime;
    chrome.storage.sync.set(temp);
}

function delSetting(a, b) {
    if (b == undefined || b == null)
        localStorage.removeItem(a);
    else {
        if (b)
            chrome.storage.sync.remove(a);
        else
            chrome.storage.local.remove(a);
    }
}

function initializeStorage(a) {
    executeSql(DATABASE_STRUCTURE, $.noop, a, null)
}

function updateSyncStorage() {
    DB.transaction(function(tx) {
        tx.executeSql("SELECT * FROM pages", [], function(tx, result) {
            var data = [];
            for(var i = 0; i < result.rows.length; i++) {
                var row = result.rows.item(i),
                    item = {};

                item.url = row.url;
                item.name = row.name;
                item.mode = row.mode;
                data.push(item);
            }
            var curTime = (new Date).getTime();
            localStorage.setItem("updateTime", curTime);
            chrome.storage.sync.set({updateTime: curTime, data: data});
        })
    })
}

function syncStorageHandler() {
    DB.transaction(function(tx) {
        tx.executeSql("DROP TABLE pages", [], function(tx, result) {
            initializeStorage();
            chrome.storage.sync.get("data", function(data) {
                if (!data.data)
                    return;
                for (var i = 0; i < data.data.length; i++) {
                    var row = data.data[i];
                    addPage($.extend({
                        url: row.url,
                        name: row.name,
                        mode: row.mode
                    }));
                }
            })
        });
    });
}

function executeSql(a, b, d, c, writeFlag) {
    DB.transaction(function(c) {
        c.executeSql(a, b, function(a, b) {
            (d || $.noop)(b)
        });
        if (writeFlag) {
            updateSyncStorage();
        }
    }, $.noop, c || $.noop);
}

function sqlResultToArray(a) {
    for (var b = [], d = 0; d < a.rows.length; d++) b.push(a.rows.item(d));
    return b
}

function getPage(a, b) {
    b && executeSql("SELECT * FROM pages WHERE url = ?", [a], function(a) {
        console.assert(1 >= a.rows.length);
        a.rows.length ? (a = a.rows.item(0), a.check_interval || (a.check_interval = getSetting(SETTINGS.check_interval)), b(a)) : b(null)
    })
}

function getAllPageURLs(a) {
    a && executeSql("SELECT url FROM pages", [], function(b) {
        for (var d = [], c = 0; c < b.rows.length; c++) d.push(b.rows.item(c).url);
        a(d)
    })
}

function getAllPages(a) {
    a && executeSql("SELECT * FROM pages", [], function(b) {
        a(sqlResultToArray(b))
    })
}

function getAllUpdatedPages(a) {
    a && executeSql("SELECT * FROM pages WHERE updated = 1", [], function(b) {
        a(sqlResultToArray(b))
    })
}

function setPageSettings(a, b, d) {
    var c = [],
        e = [],
        f;
    for (f in b) c.push(f + " = ?"), "boolean" == typeof b[f] && (b[f] = new Number(b[f])), e.push(b[f]);
    e.push(a);
    c ? (a = "UPDATE pages SET " + c.join(", ") + " WHERE url = ?", executeSql(a, e, null, d)) : (d || $.noop)()
}

function addPage(a, b) {
    if (window != BG) return BG.addPage(a, b);
    executeSql("REPLACE INTO pages(url, name, mode, regex, selector, check_interval, html, crc, updated, last_check, last_changed) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [a.url, a.name || chrome.i18n.getMessage("untitled", a.url), a.mode || "text", a.regex || null, a.selector || null, a.check_interval || null, a.html || "", a.crc || 0, a.updated ? 1 : 0, Date.now(), a.last_changed || null],
        null, function() {
            BG.takeSnapshot();
            BG.scheduleCheck();
            (b || $.noop)()
        }, true)
}

function removePage(a, b) {
    executeSql("DELETE FROM pages WHERE url = ?", [a], null, function() {
        BG.scheduleCheck();
        (b || $.noop)()
    }, true)
}

function isPageMonitored(a, b) {
    executeSql("SELECT COUNT(*) FROM pages WHERE url = ?", [a], function(a) {
        a = a.rows.item(0)["COUNT(*)"];
        console.assert(1 >= a);
        (b || $.noop)(1 == a)
    })
}

function canonizePage(a, b) {
    return a ? b.match(/\b(x|xht|ht)ml\b/) ? a.replace(/\s+/g, " ") : a : a
}

function findAndFormatRegexMatches(a, b, d) {
    function c(a) {
        e || (e = !0, f.terminate(), (d || $.noop)(a ? a.data : null))
    }
    if (d) {
        if (!b) return d("");
        var e = !1,
            f = new Worker(REGEX_WORKER_PATH);
        f.onmessage = c;
        f.postMessage(JSON.stringify({
            command: "run",
            text: a,
            regex: b
        }));
        setTimeout(c, REGEX_TIMEOUT)
    }
}

function findAndFormatSelectorMatches(a, b, d) {
    try {
        var c = $("<body>").html(getStrippedBody(a)),
            e = $(b, c).map(function() {
                return '"' + $("<div>").append(this).html() + '"'
            }).get().join("\n");
        (d || $.noop)(e)
    } catch (f) {
        (d || $.noop)(null)
    }
}

function cleanHtmlPage(a, b) {
    a = a.toLowerCase();
    a = getStrippedBody(a);
    a = a.replace(/<(script|style|object|embed|applet)[^>]*>[^]*?<\/\1>/g, "");
    a = a.replace(/<img[^>]*src\s*=\s*['"]?([^<>"' ]+)['"]?[^>]*>/g, "{startimg:$1:endimg}");
    a = a.replace(/<[^>]*>/g, "");
    a = a.replace(/\s+/g, " ");
    a = $("<div/>").html(a).text();
    a = a.replace(/\d+ ?(st|nd|rd|th|am|pm|seconds?|minutes?|hours?|days?|weeks?|months?)\b/g, "");
    a = a.replace(/[\x00-\x40\x5B-\x60\x7B-\xBF]/g, "");
    if (b) b(a);
    else return a
}

function cleanAndHashPage(a, b, d, c, e) {
    function f(a) {
        e(crc(a || ""))
    }
    e && ("regex" == b && d ? findAndFormatRegexMatches(a, d, f) : "selector" == b && c ? findAndFormatSelectorMatches(a, c, f) : cleanHtmlPage(a, f))
}

function checkPage(a, b, d) {
    getPage(a, function(c) {
        !c || c.updated ? (b || $.noop)(a) : $.ajax({
            url: a,
            dataType: "text",
            success: function(e, f, g) {
                var h = g.getResponseHeader("Content-type");
                cleanAndHashPage(e, c.mode, c.regex, c.selector, function(f) {
                    var g = {},
                        g = f != c.crc ? {
                            updated: !0,
                            crc: f,
                            html: d ? canonizePage(e, h) : c.html,
                            last_changed: Date.now()
                        } : {
                            html: canonizePage(e, h)
                        };
                    g.last_check = Date.now();
                    setPageSettings(a, g, function() {
                        (b || $.noop)(a)
                    })
                })
            },
            error: function() {
                setPageSettings(a, {
                    last_check: Date.now()
                }, function() {
                    (b || $.noop)(a)
                })
            }
        })
    })
}

function takeSnapshot(a, b) {
    checkPage(a, function() {
        setPageSettings(a, {
            updated: !1
        }, b)
    }, !0)
}
$.ajaxSetup({
    timeout: REQUEST_TIMEOUT,
    headers: {
        "Cache-Control": "no-cache",
        Etag: "bad-etag"
    }
});


function mail (to, subject, message, additional_headers, additional_parameters) {
  // http://kevin.vanzonneveld.net
  // +   original by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: Currently only works if the SSJS SendMail method is available
  // %          note 1: and also depends on the ini having been set for 'sendmail_from';
  // %          note 1: There currently is no CommonJS email API: http://wiki.commonjs.org/wiki/Email
  // %          note 2: 'additional_parameters' argument is not supported
  // *     example 1: mail('you@example.com', 'Hi!', "What's been going on lately?");
  // *     returns 1: true
  // *     example 2: mail("jack@example.com, barry@example.net", 'ok subj', 'my message',
  // *     example 2:           'From: jack@example.com\r\n'+'Organization : Example Corp\r\n'+
  // *     example 2:           'Content-type: text/html;charset=utf8');
  // *     returns 2: true
  var _append = function (sm, prop, value) {
    if (!sm[prop]) { // Ok?
      sm[prop] = '';
      sm[prop] += value;
    } else {
      sm[prop] += ',' + value;
    }
  };

  if (this.window.SendMail) { // See http://web.archive.org/web/20070219200401/http://research.nihonsoft.org/javascript/ServerReferenceJS12/sendmail.htm
    var sm = new this.window.SendMail();
    var from = this.php_js && this.php_js.ini && this.php_js.ini.sendmail_from && this.php_js.ini.sendmail_from.local_value;
    sm.To = to;
    sm.Subject = subject;
    sm.Body = message;
    sm.From = from;
    if (additional_headers) {
      var headers = additional_headers.trim().split(/\r?\n/);
      for (var i = 0; i < headers.length; i++) {
        var header = headers[i];
        var colonPos = header.indexOf(':');
        if (colonPos === -1) {
          throw new Error('Malformed headers');
        }
        var prop = header.slice(0, colonPos).trim();
        var value = header.slice(colonPos + 1).trim();
        switch (prop) {
          // Todo: Add any others to this top fall-through which can allow multiple headers
          //                via commas; will otherwise be overwritten (Errorsto, Replyto?)
        case 'Bcc':
          // Fall-through
        case 'Cc':
          // Fall-through
        case 'To':
          // Apparently appendable with additional headers per PHP examples
          _append(sm, prop, value);
          break;
        case 'Subject':
          // Overridable in additional headers?
          break;
        case 'Body':
          // Overridable in additional headers?
          break;
        case 'From':
          // Default, though can be overridden
          /* Fall-through */
        default:
          //  Errorsto, Organization, Replyto, Smtpserver
          sm[prop] = value;
          break;
        }
      }
    }
    if (!sm.From) {
      throw new Error('Warning: mail(): "sendmail_from" not set in php.ini');
    }
    return sm.send();
  }
  return false;
}