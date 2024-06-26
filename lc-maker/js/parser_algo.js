var rootSelector = 'div[class="e2v1tt3 css-1ayia3m-MarkdownContent"]';

var titleSelector = 'span[class="css-jkstne-StyledTitle e2v1tt7"]';


var ProblemListParser = /** @class */ (function () {
    function ProblemListParser() {
        this.list = {};
        this.g = {};
    }
    ProblemListParser.prototype.parser = function (selector) {
        this.title = document.querySelector(titleSelector).textContent;
        var _a;
        this.root = document.querySelector(selector);
        if (!this.root) {
            return;
        }
        var lastH1;
        var lastH2;
        var el = this.root.firstElementChild;
        var total = 0;
        while (el) {
            var nodeName = el.nodeName;
            var id = el.getAttribute("id");
            var title = void 0;
            var summary = void 0;
            if (id) {
                title = el.textContent;
            }
            lastH1 = this.title;
            this.g[lastH1] = this.title;
            if (nodeName == "H3") {
                lastH2 = el.textContent || "";
                this.g[lastH2] = lastH1;
            }
            if (nodeName == "P") {
                summary = el.innerHTML;
            }
            if (nodeName == "UL") {
                if (((_a = el.previousElementSibling) === null || _a === void 0 ? void 0 : _a.nodeName) == "H2") {
                    lastH2 = lastH1;
                }
                var childs = this.parseList(el);
                for (var _i = 0, childs_1 = childs; _i < childs_1.length; _i++) {
                    var ch = childs_1[_i];
                    var rep1 = fixTitle(this.title);
                    var rep2 = repr(lastH2);
                    var seq = getSeq(lastH2);
                    var title_1 = "".concat(seq).concat(rep1, " ").concat(rep2);
                    this.list[title_1] = this.list[title_1] ? this.list[title_1].concat(ch) : [ch];
                }
                total += childs.length;
            }
            el = el.nextElementSibling;
        }
        console.log(JSON.stringify(this.list, null, 2).slice(1, -1));
        // console.log("total: ".concat(total));
    };
    ProblemListParser.prototype.parseList = function (col) {
        var _a, _b;
        var childs = [];
        for (var i = 0; i < col.children.length; i++) {
            var el = col.children[i];
            if (!el) {
                break;
            }
            var title = ((_a = el.firstElementChild) === null || _a === void 0 ? void 0 : _a.textContent) || "";
            var src = ((_b = el.firstElementChild) === null || _b === void 0 ? void 0 : _b.getAttribute("href")) || "";
            childs = childs.concat({ title: title, src: src });
        }
        return childs;
    };
    return ProblemListParser;
}());
function repr(s) {
    return s.replace(/\s+§\d+.\d+\s+/g, "");
}

function fixTitle(s){
    // console.log("fixTitle: " + s)
    try {
        var regex = /】(.*?)（/;;
        var match = s.match(regex);
        if (match && match[1]) {
            return match[1];
        } else {
            throw new Error("No match found");
        }
    } catch (error) {
        console.error("Error in fixTitle:", error.message);
        return null; // or any other fallback value you prefer
    }
}

function getSeq(s) {
    var a = s.match(/§\d+.\d+/g);
    return a ? a[0] : "";
}
(function () {
    setTimeout(function () { return new ProblemListParser().parser(rootSelector); }, 500);
})();
