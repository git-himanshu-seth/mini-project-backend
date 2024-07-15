const { RESPONSE_TYPE } = require("./constants");

function capitalizeWords(str) {
  let words = str.split(" ");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  return words.join(" ");
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatString(str) {
  let lowercaseStr = str.toLowerCase();
  let formattedStr =
    lowercaseStr.charAt(0).toUpperCase() + lowercaseStr.slice(1);

  return formattedStr;
}
const handleJoiErrorResponse = (message) => {
  return {
    data: null,
    meta: {
      message: message
        ? capitalizeFirstLetter(message.replace(/"/g, "").replace("_", " "))
        : "",
      status: RESPONSE_TYPE.FAIL,
    },
  };
};

const handleResponseWithoutData = (message, statusCode) => {
  return {
    data: null,
    meta: {
      message: message ? formatString(message.replace(/([A-Z])/g, " $1")) : "",
      code: statusCode,
    },
  };
};

const handleResponseWithData = (message, statusCode, data) => {
  return {
    data: data,
    meta: {
      message: message ? formatString(message.replace(/([A-Z])/g, " $1")) : "",
      code: statusCode,
    },
  };
};

module.exports = {
  capitalizeWords,
  capitalizeFirstLetter,
  formatString,
  handleJoiErrorResponse,
  handleResponseWithoutData,
  handleResponseWithData,
};
