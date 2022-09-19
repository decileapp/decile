import CryptoJS from "crypto-js";

export const encrypt = (text: string) => {
  return CryptoJS.AES.encrypt(text, process.env.SECRET_KEY || "").toString();
};

export const decrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_KEY || "");
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
