'use strict';
const axios = require('axios');
const constants = require('./constants');

const requestConfig = function (requestOptions) {
  var config = {
    baseURL: requestOptions.baseURL,
    timeout: (requestOptions.config && requestOptions.config.timeOut) || constants.DEFAULT_TIMEOUT,
  };
  if (requestOptions.config.validateStatus) config.validateStatus = requestOptions.config.validateStatus;
  if (requestOptions.headers) config.headers = requestOptions.headers;
  if (requestOptions.params && requestOptions.method.toUpperCase() === 'GET') config.params = requestOptions.params;
  return config;
}

const axiosGet = async function (requestOptions) {
  try {
    return await axios.get(
      requestOptions.functionUrl,
      requestConfig(requestOptions),
    );
  } catch (error) {
    console.log('Anxios Get Error:');
    // logError(error);
    throw (error);
  }
}

const axiosPost = async function (requestOptions) {
  try {
    return await axios.post(
      requestOptions.functionUrl,
      requestOptions.params || {},
      requestConfig(requestOptions),
    );
  } catch (error) {
    console.log('Anxios Post Error:');
    // logError(error);
    throw (error);
  }
}

const axiosPut = async function (requestOptions) {
  try {
    return await axios.put(
      requestOptions.functionUrl,
      requestOptions.params || {},
      requestConfig(requestOptions),
    );
  } catch (error) {
    console.log('Anxios Put Error:');
    // logError(error);
    throw (error);
  }
}

const resendRequest = async function (retryCount, requestOptions, resendOptions, debugFlag) {
  try {
    let responseResult;
    if (requestOptions.method.toUpperCase() === 'POST' ) {
      responseResult = await axiosPost(requestOptions);
    } else if (requestOptions.method.toUpperCase() === 'PUT') {
      responseResult = await axiosPut(requestOptions);
    } else {
      responseResult = await axiosGet(requestOptions);
    }
    if (!responseResult) {
      throw new Error('No valid Response!');
    } else {
      return responseResult;
    }
  } catch (error) {
    logError(error, debugFlag);
    if (retryCount <= resendOptions.retryMaxCount) {
      try {
        logMsg("Retry " + retryCount, debugFlag);
        const delayDuration = (resendOptions.delayDurationIncrease) ? (retryCount * resendOptions.retrydelayDuration) : resendOptions.retrydelayDuration;
        await delayCall(delayDuration);
        return await resendRequest(retryCount + 1, requestOptions, resendOptions, debugFlag);
      } catch (error) {
        throw (error);
      }
    } else {
      throw new Error("Resend Failure!");
    }
  }
}

const logError = function (error, debugFlag = true) {
  if(debugFlag) {
    console.log('------------------');
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else {
      console.log(error);
    }
    console.log('==================');
  }
}

const logMsg = function (msg, debugFlag = true) {
  if (debugFlag) {
    console.log(msg);
  }
}

const delayCall = function (duration) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve();
    }, duration);
  });
}

module.exports = {
  resendRequest
}