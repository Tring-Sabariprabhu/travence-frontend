
import CryptoJS from 'crypto-js' 

export const encryptPassword = (password) => {
  if(process.env.REACT_APP_CRYPTO_KEY)
    return CryptoJS.AES.encrypt(password, process.env.REACT_APP_CRYPTO_KEY).toString();
};

export const decryptPassword = (encryptedPassword) => {
  if(encryptPassword){
    if(process.env.REACT_APP_CRYPTO_KEY){
      const bytes = CryptoJS.AES.decrypt(encryptedPassword, process.env.REACT_APP_CRYPTO_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    }else{
      console.error("key not found")
    }
  }else{
    console.error('password undefined')
  }
};
