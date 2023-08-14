import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

export const isFileImage = (file = {}) => {
  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/jpg'];
  return validImageTypes.includes(file.type);
};

export const parse = (jsonString) => {
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    return {};
  }
};

export const isScrollable = (elementID) => {
  const div = document.getElementById(elementID);
  return div.scrollHeight > div.clientHeight;
};

export const html2Text = (html) => {
  const tempDivElement = document.createElement('div');

  tempDivElement.innerHTML = html;

  return tempDivElement.textContent || tempDivElement.innerText || '';
};

export const getMe = () => {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      return {};
    }
    return jwtDecode(accessToken);
  } catch (e) {
    return {};
  }
}

export const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const pushNotification = ({tag, content}) => {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      // eslint-disable-next-line no-new
      new Notification('Dogoo IM', {
        body: content,
        tag,
        lang: 'vi-VN',
        renotify: true,
        requireInteraction: true,
      });
    }
  });
};

export const strSplice = (str = '', start, count, insertStr = '') => {
  return str.slice(0, start) + insertStr + str.slice(start + Math.abs(count));
}

export function utf8ToAscii(input) {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\u00df/g, 'ss')
    .replace(/\u00c6/g, 'AE')
    .replace(/\u00e6/g, 'ae')
    .replace(/\u0132/g, 'IJ')
    .replace(/\u0133/g, 'ij')
    .replace(/\u0152/g, 'OE')
    .replace(/\u0153/g, 'oe')
    .replace(/\u00d0/g, 'D')
    .replace(/\u0110/g, 'D')
    .replace(/\u00f0/g, 'd')
    .replace(/\u0111/g, 'd')
    .replace(/\u0126/g, 'H')
    .replace(/\u0127/g, 'h')
    .replace(/\u0131/g, 'i')
    .replace(/\u0237/g, 'j')
    .replace(/\u0141/g, 'L')
    .replace(/\u0142/g, 'l')
    .replace(/\u00d8/g, 'O')
    .replace(/\u00f8/g, 'o')
    .replace(/\u0166/g, 'T')
    .replace(/\u0167/g, 't')
    .replace(/\u00de/g, 'Th')
    .replace(/\u00fe/g, 'th')
    .replace(/\u0152/g, 'OE')
    .replace(/\u0153/g, 'oe')
    .replace(/\u00c6/g, 'AE')
    .replace(/\u00e6/g, 'ae');
}

export const getOperationID = () => {
  return `${new Date().getTime()}`;
};
