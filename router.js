/*!
  * RouterJS v1.6.0 (https://www.interart.com/)
  * Copyright 2018-2023 Silvio Delgado (https://github.com/silviodelgado)
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

    let internal = {
        current: null,
        routes: [],
        history: [],
        run_before: null,
        run_after: null
    };

    const run_before = (route) => {
        if (typeof internal.run_before == 'function' && internal.run_before) {
            internal.run_before.call(this);
        }
        if (route && route.run_before) {
            if (typeof route.run_before == 'function' && route.run_before) {
                route.run_before.call(this);
            }
        }
    };

    const run_after = (route) => {
        if (route && route.run_after) {
            if (typeof route.run_after == 'function' && route.run_after) {
                route.run_after.call(this);
            }
        }
        if (typeof internal.run_after == 'function' && internal.run_after) {
            internal.run_after.call(this);
        }
    };

    const router = {
        getFragment: () => {
            return window.location.hash.replace(/\/$/, '');
        },
        add: (route, handler, run_before, run_after) => {
            if (typeof route == 'function') {
                handler = route;
                route = '';
            }
            internal.routes.push({
                handler: handler,
                route: route,
                run_before,
                run_after
            });
            return router;
        },
        beforeAll: (handler) => {
            internal.run_before = handler;
            return router;
        },
        afterAll: (handler) => {
            internal.run_after = handler;
            return router;
        },
        apply: (frg) => {
            let fragment = frg || router.getFragment();
            if (internal.current) return router;
            for (let i = 0; i < internal.routes.length; i++) {
                let matches = fragment.match(internal.routes[i].route);
                if (matches) {
                    matches.shift();
                    internal.current = fragment;
                    if (!internal.history[fragment])
                        internal.history.push(fragment);
                    run_before(internal.routes[i]);
                    internal.routes[i].handler.apply({}, matches);
                    run_after(internal.routes[i]);
                    return router;
                }
            }
            return router;
        },
        start: () => {
            let current = router.getFragment();
            window.onhashchange = function () {
                let frg = router.getFragment();
                if (!frg) {
                    internal.current = null;
                    current = null;
                }
                if (internal.current != frg) {
                    internal.current = null;
                    router.apply(frg);
                }
            }
            if (current && !internal.current) {
                router.apply();
            }
            return router;
        },
        navigate: (path, title) => {
            document.title = title || document.title;
            path = path.replace(/##/g, '#') || '';
            window.location.hash = path ? '#' + path : '';
            return router;
        },
        clearHash: () => {
            let pos = window.scrollY;
            window.location.hash = '#';
            history.pushState(null, document.title, window.location.pathname + window.location.search);
            window.scrollTo({ top: pos, left: 0, behavior: 'smooth'})
        },
        back: () => {
            internal.history.pop();
            let path = internal.history.pop();
            path = path || '';
            window.location.hash = path;
            return router;
        },
        checkFragment: (current) => {
            return router.getFragment().indexOf(current) >= 0;
        },
        routes: () => {
            return internal.routes;
        }
    };

    return router;
});