(function () {
    var NS = "navSquisher"
      , NS_LC = "navsquisher"
      , CLS_NOJS = NS_LC +"-nojs"
      , CLS_IS_READY = "is-ready"
      , CLS_IS_CALC = "is-calc"
      , incr = 0
      , instances = {}
      , D_TEXT_WITH_BR = "data-text-with-break"
      , D_TEXT_WITHOUT_BR = "data-text-without-break"
      , D_HTML_ORIG = "data-html-original";

    function init(el, _opts) {

        if (isInited(el)) return;

        var opts = {
            liSel: "."+ NS_LC +"-item"
            , ulSel: "."+ NS_LC +"-list"
            , btnSel: "."+ NS_LC +"-btn"
            , btnInnerSel: "."+ NS_LC +"-btninner"
            , condition: true // this can have logic in it, such as viewport width for responsive layouts
        };

        opts = mergeOptions( opts, _opts );

        
        // console.log("opts", opts.condition)


        el.classList.remove(CLS_NOJS);
        el.classList.add(NS_LC);

        var instanceID = NS_LC + "-" + incr
          , instance = {
              id: instanceID
            , opts: opts
          };

        instances[instanceID] = instance;
        el.setAttribute("data-id", instanceID);

        incr++;

        if (!opts.condition) {
            el.classList.add(CLS_IS_READY);
            clearClasses(el);
            return instance;
        }

        setEvenWidths(el, opts);
        el.classList.add(CLS_IS_READY);

        return instance;
    }

    /**
     * @description Clears classes and styles that get applied after the main logic is done.
     * @param el (element) - A single instance of this widget as a jQuery element.
     * @param items (element list) - <li>'s in the list.
     */
    function clearCalc(el, items) {
        eachDom(items, function (item) {
            item.removeAttribute("style");
        });
        el.classList.remove(CLS_IS_CALC);
    }

    /**
     * @description Distributes items in a list by percentages.
     * @param el (element) - A single instance of this widget as a element.
     * @param opts (object) - library options
     */
    function setEvenWidths(el, opts) {

        var items = el.querySelectorAll(opts.liSel);

        var totalW = el.querySelector(opts.ulSel).offsetWidth;

        el.classList.add(CLS_IS_CALC); // needs to come after 'totalW' is calculated or else IE9 miscalculates the width
        
        setEvenPadData(items, totalW);

        var perc, totPerc = 0, w;
        eachDom(items, function (item) {
            w = parseFloat(item.getAttribute("data-pixel-width"));
            if (w.toString() !== "NaN") {
                perc = (w / totalW) * 100;
                item.style.width = perc + "%";

                totPerc += perc;
            } else {
                console.warn(NS, "setEvenWidths", "Attribute 'data-pixel-width' was not a valid number.", item);
            }
        });
    }



    /**
     * @description Sets even padding to a data object, so it can be used later.
     * @param items (element list) - <li>'s in the list.
     * @param totalW (number) - The total width of all items.
     */
    function setEvenPadData(items, totalW) {

        var itemsW = getListWidth(items)
          , extraW = totalW - itemsW
          , pad = (extraW / items.length) / 2;

        eachDom(items, function(item) {
            item.setAttribute("data-pixel-width", pad * 2 + item.offsetWidth);
        });
    }

    /**
     * @description Gets the total width of all items.
     * @param items (element list) - <li>'s in the list.
     */
    function getListWidth(items) {

        var totalW = 0;
        eachDom(items, function(item) {
            totalW += item.offsetWidth;
        });
        return totalW;
    }



    function resize(el, doResetWidths) {

        var instance = getInstance(el);
        if (!instance) return;

        if (typeof doResetWidths === "undefined") doResetWidths = true;

        var items = el.querySelectorAll(instance.opts.liSel);
        clearCalc(el, items);
        

        if (doResetWidths) {
            el.classList.remove(CLS_IS_READY);
            setEvenWidths(el, instance.opts);
            el.classList.add(CLS_IS_READY);
        }
    }


    function getInstance(el) {
        var id = el.getAttribute("data-id");

        if (!id) {
            console.warn(NS, "No attribute 'data-id' found. You probably haven't initialized the '" + NS + "' library yet on this element.", el);
            return;
        }

        var instance = instances[id];

        if (!instance) {
            console.warn(NS, "Something's not right. Couldn't find instance '" + id + "'.", el);
            return;
        }

        return instance;
    }

    function isInited(el) {
        var id = el.getAttribute("data-id")
              , instance = instances[id];

        return !!instance;
    }

    function tightFit(textElList, doAddBreaks) {

        eachDom(textElList, function (txtEl) {

            newTxt = "";
            brAdded = false;
            txt = txtEl.textContent.trim();
            txtSplit = txt.split(" ");

            // includes the full markup, in case there are span elements nested or something and something outside of this library needs them
            txtEl.setAttribute(D_HTML_ORIG, txtEl.innerHTML.trim());
            txtEl.setAttribute(D_TEXT_WITHOUT_BR, txt);

            txtSplit.forEach(function (char, i) {
                newTxt += char;

                if (i < txtSplit.length) {
                    if (brAdded // if break already added
                        || i === 0 && char.length < 4 // or first word and word is less than 4 characters
                        || txt.length < 10 // or the total word character count is less than 10
                        ) {
                        newTxt += " ";
                    } else {
                        brAdded = true;
                        newTxt += "<br>";
                    }
                }
            });
            txtEl.setAttribute(D_TEXT_WITH_BR, newTxt);
        });

        setWordBreaks(textElList, doAddBreaks);
    }

    function setWordBreaks(textElList, doAddBreaks) {

        eachDom(textElList, function (txtEl) {
            var markup = txtEl.getAttribute(doAddBreaks ? D_TEXT_WITH_BR : D_TEXT_WITHOUT_BR);
            txtEl.innerHTML = markup;
        })
    }

    function eachDom(list, cb) {
        var len = list.length;
        for (var i = 0; i < len; i++) {
            cb(list[i]);
        }
    }

    // adds CSS classes with JS so that the layout isn't affected by them until all JS is ready
    function addClasses(el) {
        eachDom(el.querySelectorAll("[data-add-class]"), function (el) {
            var cls = el.getAttribute("data-add-class");
            if (cls) el.classList.add(cls);
        });
    }

    // clears nav squisher classes and stores them in variables in case you need them back
    function clearClasses(el, addThemBack) {
        var instance = getInstance(el);
        
        if (addThemBack) {
            el.classList.add(CLS_IS_CALC);

            var items = el.querySelectorAll("[data-li-sel]");

            var addCls = function (attr, thisEl, item) {
                if (!thisEl) thisEl = (item || el).querySelector("[" + attr + "]");
                if (!thisEl) return
                
                thisEl.classList.add(thisEl.getAttribute(attr))
                thisEl.removeAttribute(attr);
            }

            eachDom(items, function (item) {
                item.style.width = item.getAttribute("data-width");
                item.removeAttribute("data-width");
                addCls("data-li-sel", item);
                addCls("data-btn-sel", null, item);
                addCls("data-btn-inner-sel", null, item);
            });

            addCls("data-ul-sel");

        } else {
            el.classList.remove(CLS_IS_CALC);

            var items = el.querySelectorAll(instance.opts.liSel);

            var addAttr = function (attr, sel, thisEl, item) {
                if (!thisEl) thisEl = (item || el).querySelector(sel);
                if (!thisEl) return

                thisEl.classList.remove(sel.slice(1));
                thisEl.setAttribute(attr, sel.slice(1));
            }

            eachDom(items, function (item) {
                item.setAttribute("data-width", window.getComputedStyle(item, null).width);
                item.style.width = "";
                addAttr("data-li-sel", instance.opts.liSel, item);
                addAttr("data-btn-sel", instance.opts.btnSel, null, item);
                addAttr("data-btn-inner-sel", instance.opts.btnInnerSel, null, item);
            });

            addAttr("data-ul-sel", instance.opts.ulSel);
        }
    }

    /**
     * Overwrites obj1's values with obj2's and adds obj2's if non existent in obj1
     * @param obj1
     * @param obj2
     * @returns obj3 a new object based on obj1 and obj2
     */
    function mergeOptions(obj1,obj2){
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    }

    window[NS] = {
        init: init
        , isInited: isInited
        , resize: resize
        , tightFit: tightFit
        , setWordBreaks: setWordBreaks
        , addClasses: addClasses
        , clearClasses: clearClasses
    }

})();