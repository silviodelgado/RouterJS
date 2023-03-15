(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.app = factory(root);
    }
})(typeof global !== "undefined" ? global : this.window || this.global, function (root) {
    'use strict';

    const show_about = function () {
        alert('This is the application "About".\n\nCopyright ©2018-2019 Interart');
    }

    const show_number = function (num) {
        alert('Number: ' + num);
    }

    Router
        .add(/about/, show_about)
        .add(/number:([0-9]+)/, show_number)
        .beforeAll(() => {
            console.log('Run before all routes!')
        })
        .afterAll(() => {
            console.log('Run after all routes!')
        })
        .apply()
        .start();
});