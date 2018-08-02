'use strict';
const axios = require('axios');
const constants = require('./constants');

const requestConfig = function (requestOptions) {
  var config = {
    baseURL: requestOptions.baseURL,
    timeout: requestOptions.timeOut || constants.DEFAULT_TIMEOUT,
  };
  if (requestOptions.headers) config.headers = requestOptions.headers;
  if (requestOptions.params && requestOptions.method.toUpperCase() === 'GET') config.params = requestOptions.params;
  return config;
}

const axiosGet = async function (requestOptions) {
  try {
    return axios.get(
      requestOptions.functionUrl,
      this.requestConfig(requestOptions.config),
    );
  } catch (error) {
    console.log('Anxios Get Error:');
    this.logError(error);
    throw (error);
    // throw new Error('Request Timeout!');
  }
}

const axiosPost = async function (requestOptions) {
  try {
    return axios.get(
      requestOptions.functionUrl,
      requestOptions.params,
      this.requestConfig(requestOptions.config),
    );
  } catch (error) {
    console.log('Anxios Post Error:');
    this.logError(error);
    throw (error);
  }
}

const resendRequest = async function (retryCount, requestOptions, resendOptions, debugFlag) {
  try {
    var self = this;
    let responseResult;
    if(options.method.toUpperCase() === 'POST' ) {
      responseResult = await this.axiosPost(requestOptions);
    } else {
      responseResult = await this.axiosGet(requestOptions);
    }
    if (!responseResult || responseResult.status !== 200) {
      throw new Error('No valid Response!');
    } else {
      return responseResult;
    }
  } catch (error) {
    this.logError(error, debugFlag);
    if (retryCount <= resendOptions.retryMaxCount) {
      try {
        const delayDuration = (resendOptions.delayDurationIncrease) ? (retryCount * resendOptions.retrydelayDuration) : resendOptions.retrydelayDuration;
        await self.delayCall(delayDuration);
        return await self.resendRequest(retryCount + 1, requestOptions, resendOptions, debugFlag);
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
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else {
      console.log(error);
    }
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
  axiosGet,
  axiosPost,
}