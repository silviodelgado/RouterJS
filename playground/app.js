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

    const show_multiple = (num1, num2) => {
        alert('Number 1: ' + num1 + "\nNumber 2: " + num2);
    }

    Router
        .add(/about/, show_about)
        .add(/number:([0-9]+)/, show_number)
        .add(/multiple:([0-9]+)\|([0-9]+)/, show_multiple)
        .beforeAll(() => {
            console.log('Run before all routes!')
        })
        .afterAll(() => {
            console.log('Run after all routes!')
        })
        .apply()
        .start();
});