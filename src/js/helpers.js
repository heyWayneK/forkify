import { API_TIMEOUT_SECONDS } from './config.js';

const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Api took too long, timed out was ${seconds} seconds`));
    }, seconds * 1000);
  });
};

export const AJAX = async function (url, uploadData = undefined) {
  console.log(`uploadData`, uploadData);
  try {
    fetchUrl = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const result = await Promise.race([fetchUrl, timeout(API_TIMEOUT_SECONDS)]);
    const json = await result.json();
    if (!result.ok) throw new Error(`${json.message} (${result.status})`);
    return json;
  } catch (error) {
    throw error;
  }
};

/* 
export const getJSON = async function (url) {
  try {
    // Loading Recipe
    const result = await Promise.race([fetch(url), timeout(API_TIMEOUT_SECONDS)]);
    const json = await result.json();

    if (!result.ok) throw new Error(`No Recipe fetched ${json.message} (${result.status})`);

    return json;
  } catch (error) {
    throw error;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    // Send Recipe
    const sendObj = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadData),
    };
    const result = await Promise.race([fetch(url, sendObj), timeout(API_TIMEOUT_SECONDS)]);
    const json = await result.json();

    if (!result.ok) throw new Error(`No Recipe fetched ${json.message} (${result.status})`);

    return json;
  } catch (error) {
    throw error;
  }
};
*/
