'use strict';

/**
 * wrapper around document.querySelector
 * @param selector
 * @returns {Element}
 */

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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

var bcr = window.bcr || {};
bcr = {
    debug: true,
    log: function log() {
        if (this.debug && window.console && window.log) {
            console.log(arguments);
        }
    },
    init: function init() {
        bcr.events.global();
        bcr.views.detect();
    }
};

// utils need to go before everything else so we can use 'once'
// for view listeners since it fires on page load
bcr.utils = {
    call: function call(endpoint, options) {
        options.method = 'POST';
        var req = this.promise(endpoint, options);
        req.then(options.success, options.error);
    },
    callGet: function callGet(endpoint, options) {
        options.method = 'GET';
        var req = this.promise(endpoint, options);
        req.then(options.success, options.error);
    },
    promise: function promise(endpoint) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var data = this.toKeyValue(options.data) || '';
        var method = options.method || 'GET';

        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open(method, endpoint);

            req.onload = function () {
                if (req.status == 200) {
                    resolve(req.response);
                } else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function () {
                reject(Error("Something went wrong ... "));
            };

            req.send(data);
        });
    },
    toKeyValue: function toKeyValue(obj) {
        if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) !== 'object' || Object.keys(obj).length === 0) {
            return '';
        }

        var qs = '';
        for (var key in obj) {
            var val = obj[key];

            if (!qs.length) {
                qs += encodeURIComponent(key) + '=' + encodeURIComponent(val);
            } else {
                qs += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(val);
            }
        }

        return qs;
    },
    isFn: function isFn(fnLike) {
        return Object.prototype.toString.call(fnLike) === '[object Function]';
    },
    toArray: function toArray(arrayLike) {
        var arr = [];

        for (var i = 0; i < arrayLike.length; i++) {
            arr.push(arrayLike[i]);
        }

        return arr;
    },
    once: function once(fn, context) {
        var _this = this,
            _arguments = arguments;

        var result = void 0;

        return function () {
            if (fn) {
                result = fn.apply(context || _this, _arguments);
                fn = null;
            }

            return result;
        };
    }
};

// global is fired on page load regardless of what view is actually loaded
bcr.events = {
    global: function global() {
        var _this2 = this;

        $$('.view-update').forEach(function (element) {
            element.on('click', function () {
                bcr.views.render(_this2.dataset.view);
            });
        });
    },


    index: bcr.utils.once(function () {
        bcr.log('events.index');
    }, bcr.events),

    about: bcr.utils.once(function () {
        bcr.log('events.about');
    })
};

bcr.views = {
    detect: function detect() {
        if (window.location.hash) {
            this.render(window.location.hash.slice(1));
        } else {
            bcr.events.index();
        }
    },
    render: function render() {
        var view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        var options = {
            data: { isPartial: true },
            success: function success(res) {
                $('#view-wrapper').innerHTML = res;

                if (view === '') {
                    view = 'index';
                }

                if (bcr.events[view] && bcr.utils.isFn(bcr.events[view])) {
                    bcr.events[view]();
                }
            },
            error: function error(err) {
                bcr.log(err);
            }
        };

        bcr.utils.callGet('/' + view + '?isPartial=true', options);
    }
};

bcr.init();

//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QVg7QUFDSDtBQUNKLGFBWlc7QUFhWixpQkFiWSxpQkFhTCxHQWJLLEVBYUE7QUFDUixvQkFBSSxHQUFKLENBQVEsR0FBUjtBQUNIO0FBZlcsU0FBaEI7O0FBa0JBLFlBQUksS0FBSixDQUFVLE9BQVYsQ0FBa0IsTUFBTSxJQUFOLEdBQWEsaUJBQS9CLEVBQWtELE9BQWxEO0FBQ0g7QUE5Qk8sQ0FBWjs7QUFpQ0EsSUFBSSxJQUFKIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiB3cmFwcGVyIGFyb3VuZCBkb2N1bWVudC5xdWVyeVNlbGVjdG9yXG4gKiBAcGFyYW0gc2VsZWN0b3JcbiAqIEByZXR1cm5zIHtFbGVtZW50fVxuICovXG5mdW5jdGlvbiAkKHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xufVxuXG4vKipcbiAqIHJldHVybiBhcnJheSBvZiBhbGwgZWxlbWVudHMgcmV0dXJuZWQgYnkgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbFxuICogQHBhcmFtIHNlbGVjdG9yXG4gKiBAcmV0dXJucyB7QXJyYXl9XG4gKi9cbmZ1bmN0aW9uICQkKHNlbGVjdG9yKSB7XG4gICAgdmFyIGVsZW1lbnRzID0ge1xuICAgICAgICBub2RlTGlzdDogZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvciksXG4gICAgICAgIGFycjogW11cbiAgICB9O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5ub2RlTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICBlbGVtZW50cy5hcnIucHVzaChlbGVtZW50cy5ub2RlTGlzdFtpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsZW1lbnRzLmFycjtcbn1cblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbkhUTUxFbGVtZW50LnByb3RvdHlwZS5vbiA9IEhUTUxFbGVtZW50LnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyO1xuXG5sZXQgYmNyID0gd2luZG93LmJjciB8fCB7fTtcbmJjciA9IHtcbiAgICBkZWJ1ZzogdHJ1ZSxcbiAgICBsb2cgKCkge1xuICAgICAgICBpZiAodGhpcy5kZWJ1ZyAmJiB3aW5kb3cuY29uc29sZSAmJiB3aW5kb3cubG9nKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIGluaXQgKCkge1xuICAgICAgICBiY3IuZXZlbnRzLmdsb2JhbCgpO1xuICAgICAgICBiY3Iudmlld3MuZGV0ZWN0KCk7XG4gICAgfSxcbn07XG5cbi8vIHV0aWxzIG5lZWQgdG8gZ28gYmVmb3JlIGV2ZXJ5dGhpbmcgZWxzZSBzbyB3ZSBjYW4gdXNlICdvbmNlJ1xuLy8gZm9yIHZpZXcgbGlzdGVuZXJzIHNpbmNlIGl0IGZpcmVzIG9uIHBhZ2UgbG9hZFxuYmNyLnV0aWxzID0ge1xuICAgIGNhbGwgKGVuZHBvaW50LCBvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMubWV0aG9kID0gJ1BPU1QnO1xuICAgICAgICBjb25zdCByZXEgPSB0aGlzLnByb21pc2UoZW5kcG9pbnQsIG9wdGlvbnMpO1xuICAgICAgICByZXEudGhlbihvcHRpb25zLnN1Y2Nlc3MsIG9wdGlvbnMuZXJyb3IpO1xuICAgIH0sXG5cbiAgICBjYWxsR2V0IChlbmRwb2ludCwgb3B0aW9ucykge1xuICAgICAgICBvcHRpb25zLm1ldGhvZCA9ICdHRVQnO1xuICAgICAgICBjb25zdCByZXEgPSB0aGlzLnByb21pc2UoZW5kcG9pbnQsIG9wdGlvbnMpO1xuICAgICAgICByZXEudGhlbihvcHRpb25zLnN1Y2Nlc3MsIG9wdGlvbnMuZXJyb3IpO1xuICAgIH0sXG5cbiAgICBwcm9taXNlIChlbmRwb2ludCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLnRvS2V5VmFsdWUob3B0aW9ucy5kYXRhKSB8fCAnJztcbiAgICAgICAgY29uc3QgbWV0aG9kID0gb3B0aW9ucy5tZXRob2QgfHwgJ0dFVCc7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgcmVxLm9wZW4obWV0aG9kLCBlbmRwb2ludCk7XG5cbiAgICAgICAgICAgIHJlcS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUocmVxLnJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChFcnJvcihyZXEuc3RhdHVzVGV4dCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXEub25lcnJvciA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QoRXJyb3IoXCJTb21ldGhpbmcgd2VudCB3cm9uZyAuLi4gXCIpKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJlcS5zZW5kKGRhdGEpO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgdG9LZXlWYWx1ZSAob2JqKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb2JqICE9PSAnb2JqZWN0JyB8fCBPYmplY3Qua2V5cyhvYmopLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHFzID0gJyc7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBvYmopIHtcbiAgICAgICAgICAgIGNvbnN0IHZhbCA9IG9ialtrZXldO1xuXG4gICAgICAgICAgICBpZiAoIXFzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHFzICs9IGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nICsgIGVuY29kZVVSSUNvbXBvbmVudCh2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcXMgKz0gJyYnICsgZW5jb2RlVVJJQ29tcG9uZW50KGtleSkgKyAnPScgKyAgZW5jb2RlVVJJQ29tcG9uZW50KHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcXM7XG4gICAgfSxcblxuICAgIGlzRm4gKGZuTGlrZSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZuTGlrZSkgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gICAgfSxcblxuICAgIHRvQXJyYXkgKGFycmF5TGlrZSkge1xuICAgICAgICBjb25zdCBhcnIgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5TGlrZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJyLnB1c2goYXJyYXlMaWtlW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBhcnI7XG4gICAgfSxcblxuICAgIG9uY2UgKGZuLCBjb250ZXh0KSB7XG4gICAgICAgIGxldCByZXN1bHQ7XG5cbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGlmIChmbikge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZuLmFwcGx5KGNvbnRleHQgfHwgdGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICBmbiA9IG51bGw7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG4gICAgfVxufTtcblxuLy8gZ2xvYmFsIGlzIGZpcmVkIG9uIHBhZ2UgbG9hZCByZWdhcmRsZXNzIG9mIHdoYXQgdmlldyBpcyBhY3R1YWxseSBsb2FkZWRcbmJjci5ldmVudHMgPSB7XG4gICAgZ2xvYmFsICgpIHtcbiAgICAgICAgJCQoJy52aWV3LXVwZGF0ZScpLmZvckVhY2goZWxlbWVudCA9PiB7XG4gICAgICAgICAgICBlbGVtZW50Lm9uKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICBiY3Iudmlld3MucmVuZGVyKHRoaXMuZGF0YXNldC52aWV3KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgaW5kZXg6IGJjci51dGlscy5vbmNlKCgpID0+IHtcbiAgICAgICAgYmNyLmxvZygnZXZlbnRzLmluZGV4Jyk7XG4gICAgfSwgYmNyLmV2ZW50cyksXG5cbiAgICBhYm91dDogYmNyLnV0aWxzLm9uY2UoKCkgPT4ge1xuICAgICAgICBiY3IubG9nKCdldmVudHMuYWJvdXQnKVxuICAgIH0pLFxufTtcblxuYmNyLnZpZXdzID0ge1xuICAgIGRldGVjdCAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cubG9jYXRpb24uaGFzaCkge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXIod2luZG93LmxvY2F0aW9uLmhhc2guc2xpY2UoMSkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYmNyLmV2ZW50cy5pbmRleCgpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHJlbmRlciAodmlldyA9ICcnKSB7XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBkYXRhOiB7IGlzUGFydGlhbDogdHJ1ZSB9LFxuICAgICAgICAgICAgc3VjY2VzcyAocmVzKSB7XG4gICAgICAgICAgICAgICAgJCgnI3ZpZXctd3JhcHBlcicpLmlubmVySFRNTCA9IHJlcztcblxuICAgICAgICAgICAgICAgIGlmICh2aWV3ID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICB2aWV3ID0gJ2luZGV4JztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoYmNyLmV2ZW50c1t2aWV3XSAmJiBiY3IudXRpbHMuaXNGbihiY3IuZXZlbnRzW3ZpZXddKSkge1xuICAgICAgICAgICAgICAgICAgICBiY3IuZXZlbnRzW3ZpZXddKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yIChlcnIpIHtcbiAgICAgICAgICAgICAgICBiY3IubG9nKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgYmNyLnV0aWxzLmNhbGxHZXQoJy8nICsgdmlldyArICc/aXNQYXJ0aWFsPXRydWUnLCBvcHRpb25zKTtcbiAgICB9XG59O1xuXG5iY3IuaW5pdCgpO1xuIl19