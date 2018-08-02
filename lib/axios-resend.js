'use strict';

const axiosHelpers = require('./helpers/axiosHelpers');
const constants = require('./helpers/constants');

// Create the default instance to be exported
var axiosResend = function (userRequestOptions, userResendOptions, debugFlag) {
  return new Promise(function (resolve, reject) {
    if (!options.method || !['GET', 'PUT', 'POST'].includes(options.method.toUpperCase())) {
      reject('Not supported method!');
    }
    const resendOptions = Object.assign({
      retryMaxCount: constants.DEFAULT_RETRY_MAX_COUNT,
      retrydelayDuration: constants.DEFAULT_RETRY_DELAY_DURATION,
      delayDurationIncrease: constants.DEFAULT_DELAY_DURATION_INCREASE,
    }, userResendOptions)
    // console.log("Initialization");
    const mainOperation = async (userRequestOptions, resendOptions, debugFlag) => {
      const responseResult = await axiosHelpers.resendRequest(1, userRequestOptions, resendOptions, debugFlag);
      resolve(responseResult);
    }
    mainOperation(userRequestOptions, resendOptions, debugFlag);
  });
}

module.exports = axiosResend;

// Allow use of default import syntax in TypeScript
module.exports.default = axiosResend;
