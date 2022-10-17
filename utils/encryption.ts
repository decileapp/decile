import CryptoJS from "crypto-js";

export const encrypt = (text: string) => {
  const encJson = CryptoJS.AES.encrypt(
    JSON.stringify(text),
    process.env.SECRET_KEY || ""
  ).toString();
  return encJson;
};

export const decrypt = (ciphertext: string) => {
  var bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_KEY || "");
  var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
};
