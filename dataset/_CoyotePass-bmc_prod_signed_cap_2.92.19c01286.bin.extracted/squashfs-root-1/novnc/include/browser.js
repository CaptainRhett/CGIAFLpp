"use strict";
/*

    Browser detection

*/
const isChrome = () => (/Google Inc/i).test(navigator.vendor);

const isSafari = () => (/Safari/i).test(navigator.userAgent) && !(/Chrome/i).test(navigator.userAgent);

const isEdge = () => (/Edge/i).test(navigator.userAgent);

const isEdgeChromeBase = () =>  (/Edg/i).test(navigator.userAgent);

const isFirefox = () => (/Firefox/i).test(navigator.userAgent);
