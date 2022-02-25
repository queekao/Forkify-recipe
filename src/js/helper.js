import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';
//timeout 'fn' for we dont fetch data too long
const timeout = s => {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  try {
    const API = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            //The data type that we pass in
          },
          body: JSON.stringify(uploadData),
          //Body for accepting the data
        })
      : fetch(url);
    const response = await Promise.race([API, timeout(TIMEOUT_SEC)]);
    //we need make time more readable so we can put time in configuration
    const data = await response.json();
    if (!response.ok) throw new Error(`${data.message} ${response.status}`);
    return data; //need to return data from this 'fn'
    // and this 'data' become 'resolve' of the promise
  } catch (err) {
    // console.log(err);//instead of just log the error we can re-throw it
    throw err;
  }
};
// export const getJSON = async function (url) {
//   await AJAX(url);
// };
// export const sendJSON = async function (url, uploadData) {
//   await AJAX(url, uploadData);
// };
