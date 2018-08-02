'use strict';

// Create the default instance to be exported
var axiosResend = function (method, options) {
  console.log("Initialization");
}

module.exports = axiosResend;

// Allow use of default import syntax in TypeScript
module.exports.default = axiosResend;
