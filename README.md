# axios-resend

Axios plugin that intercepts failed requests and send them again.

## Installation

```bash
npm install axios-resend
```

## Usage

```js
const axiosResend = require('axios-resend');

axiosResend(
  { // Request Options
    method: 'POST', // support 'GET', 'PUT', 'POST' // *required
    baseURL: 'http://localhost:3000/', // *required
    functionUrl: 'getInfo', // *required
    config: {
      timeOut: 5000, // default 1000
      validateStatus: function (status) {
        return status < 500; // Reject only if the status code is greater than or equal to 500
      },
    },
    params: { text: 'hello' }
  },
  { // Resend Options
    retryMaxCount: 5, // default 5, The number of times to resend before failing.
    retrydelayDuration: 1000, // default 1000
    delayDurationIncrease: true, // default true, if TRUE, increase the duration before the next resend
  },
  true // debug mode, if true, print log to console
).then( response => { //axios response
    console.log(response);
 }, error => { // Error
    console.log(error);
 }
);
  ```
