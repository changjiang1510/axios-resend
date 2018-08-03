'use strict';

const axiosHelpers = require('./helpers/axiosHelpers');
const constants = require('./helpers/constants');
const utils = require('./utils');

// Create the default instance to be exported
var axiosResend = function (userRequestOptions, userResendOptions, debugFlag) {
  return new Promise(function (resolve, reject) {
    if (!userRequestOptions.method || !['GET', 'PUT', 'POST'].includes(userRequestOptions.method.toUpperCase())) {
      reject('Not supported method!');
      return;
    }
    if (!userRequestOptions.baseURL || userRequestOptions.baseURL === '') {
      reject('Missing Base URL!');
      return;
    }
    if (!userRequestOptions.functionUrl) {
      reject('Missing Function URL!');
      return;
    }
    if (userRequestOptions.config
      && userRequestOptions.config.validateStatus
      && !utils.isFunction(userRequestOptions.config.validateStatus)) {
      reject('Invalid validateStatus function!');
      return;
    }
    const resendOptions = Object.assign({
      retryMaxCount: constants.DEFAULT_RETRY_MAX_COUNT,
      retrydelayDuration: constants.DEFAULT_RETRY_DELAY_DURATION,
      delayDurationIncrease: constants.DEFAULT_DELAY_DURATION_INCREASE,
    }, userResendOptions);
    const mainOperation = async (userRequestOptions, resendOptions, debugFlag) => {
      try {
        const responseResult = await axiosHelpers.resendRequest(1, userRequestOptions, resendOptions, debugFlag);
        resolve(responseResult);
        return;
      } catch (error) {
        reject(error);
        return;
      }
    }
    mainOperation(userRequestOptions, resendOptions, debugFlag);
  });
}

module.exports = axiosResend;

// Allow use of default import syntax in TypeScript
// module.exports.default = axiosResend;
