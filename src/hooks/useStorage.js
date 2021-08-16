import { storage } from "../firebase/config";

export default function () {
  function read(target) {
    const arr = [storage.ref(target[0])];
    for (let i = 1; i < target.length; i++) {
      arr.push(arr[i - 1].child(target[i]));
    }
    return arr[arr.length - 1];
  }

  function getDownloadURL(target) {
    if (Array.isArray(target)) {
      return read(target).getDownloadURL();
    } else {
      return target.getDownloadURL();
    }
  }

  return { read, getDownloadURL };
}
