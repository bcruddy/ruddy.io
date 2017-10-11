'use strict';

/**
 * wrapper around document.querySelector
 * @param selector
 * @returns {Element}
 */
function $(selector) {
    return document.querySelector(selector);
}

/**
 * return array of all elements returned by document.querySelectorAll
 * @param selector
 * @returns {Array}
 */
function $$(selector) {
    var elements = {
        nodeList: document.querySelectorAll(selector),
        arr: []
    };

    for (var i = 0; i < elements.nodeList.length; i++) {
        elements.arr.push(elements.nodeList[i]);
    }

    return elements.arr;
}

function noop() {}

HTMLElement.prototype.on = HTMLElement.prototype.addEventListener;

let bcr = window.bcr || {};
bcr = {
    debug: true,
    log () {
        if (this.debug && window.console && window.log) {
            console.log(arguments);
        }
    },

    init () {
        bcr.events.global();
        bcr.views.detect();
    },
};

// utils need to go before everything else so we can use 'once'
// for view listeners since it fires on page load
bcr.utils = {
    call (endpoint, options) {
        options.method = 'POST';
        const req = this.promise(endpoint, options);
        req.then(options.success, options.error);
    },

    callGet (endpoint, options) {
        options.method = 'GET';
        const req = this.promise(endpoint, options);
        req.then(options.success, options.error);
    },

    promise (endpoint, options = {}) {
        const data = this.toKeyValue(options.data) || '';
        const method = options.method || 'GET';

        return new Promise((resolve, reject) => {
            const req = new XMLHttpRequest();
            req.open(method, endpoint);

            req.onload = () => {
                if (req.status == 200) {
                    resolve(req.response);
                }
                else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = () => {
                reject(Error("Something went wrong ... "));
            };

            req.send(data);
        });
    },

    toKeyValue (obj) {
        if (typeof obj !== 'object' || Object.keys(obj).length === 0) {
            return '';
        }

        let qs = '';
        for (var key in obj) {
            const val = obj[key];

            if (!qs.length) {
                qs += encodeURIComponent(key) + '=' +  encodeURIComponent(val);
            }
            else {
                qs += '&' + encodeURIComponent(key) + '=' +  encodeURIComponent(val);
            }
        }

        return qs;
    },

    isFn (fnLike) {
        return Object.prototype.toString.call(fnLike) === '[object Function]';
    },

    toArray (arrayLike) {
        const arr = [];

        for (let i = 0; i < arrayLike.length; i++) {
            arr.push(arrayLike[i]);
        }

        return arr;
    },

    once (fn, context) {
        let result;

        return () => {
            if (fn) {
                result = fn.apply(context || this, arguments);
                fn = null;
            }

            return result;
        };
    }
};

// global is fired on page load regardless of what view is actually loaded
bcr.events = {
    global () {
        $$('.view-update').forEach(element => {
            element.on('click', () => {
                bcr.views.render(this.dataset.view);
            });
        });
    },

    index: bcr.utils.once(() => {
        bcr.log('events.index');
    }, bcr.events),

    about: bcr.utils.once(() => {
        bcr.log('events.about')
    }),
};

bcr.views = {
    detect () {
        if (window.location.hash) {
            this.render(window.location.hash.slice(1));
        }
        else {
            bcr.events.index();
        }
    },

    render (view = '') {
        const options = {
            data: { isPartial: true },
            success (res) {
                $('#view-wrapper').innerHTML = res;

                if (view === '') {
                    view = 'index';
                }

                if (bcr.events[view] && bcr.utils.isFn(bcr.events[view])) {
                    bcr.events[view]();
                }
            },
            error (err) {
                bcr.log(err);
            }
        };

        bcr.utils.callGet('/' + view + '?isPartial=true', options);
    }
};

bcr.init();
