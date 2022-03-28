/*!
  * RouterJS v1.2.0 (https://wwwinterart.com/)
  * Copyright 2018-2019 Silvio Delgado (https://github.com/silviodelgado)
  * Licensed under MIT (https://opensource.org/licenses/MIT)
  * https://github.com/silviodelgado/routerjs
  */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.Router = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
    'use strict';

    return {
        routes: [],
        history: [],
        getFragment: function () {
            return window.location.hash.replace(/\/$/, '');
        },
        add: function (route, handler) {
            if (typeof route == 'function') {
                handler = route;
                route = '';
            }
            this.routes.push({
                handler: handler,
                route: route
            });
            return this;
        },
        apply: function (frg) {
            var fragment = frg || this.getFragment();
            for (var i = 0; i < this.routes.length; i++) {
                var matches = fragment.match(this.routes[i].route);
                if (matches) {
                    matches.shift();
                    if (!self.history[fragment])
                        this.history.push(fragment);
                    this.routes[i].handler.apply({}, matches);
                    return this;
                }
            }
            return this;
        },
        start: function () {
            var self = this;
            var current = self.getFragment();
            window.onhashchange = function () {
                if (current !== self.getFragment()) {
                    current = self.getFragment();
                    self.apply(current);
                }
            }
            return this;
        },
        navigate: function (path, title) {
            document.title = title || document.title;
            path = path.replace(/##/g, '#') || '';
            window.location.hash = path ? '#' + path : '';
            return this;
        },
        clearHash: function () {
            window.location.hash = '#';
            history.pushState(null, document.title, window.location.pathname + window.location.search);
        },
        back: function () {
            this.history.pop();
            var path = this.history.pop();
            path = path || '';
            window.location.hash = path;
            return this;
        },
        checkFragment: function (current) {
            return this.getFragment().indexOf(current) >= 0;
        }
    }
});