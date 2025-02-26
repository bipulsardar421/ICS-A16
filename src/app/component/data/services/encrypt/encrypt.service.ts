import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
@Injectable({
  providedIn: 'root',
})
export class EncryptService {
  private secretKey = 'Iam_bipul_sardar_this_is_my_secret_key_IamKeepingthis....you_ask_why?Because_i_can!@#$%^&*()1234';
  constructor() {}
  encrypt(value: string): string {
    return CryptoJS.AES.encrypt(value, this.secretKey).toString();
  }
  decrypt(encryptedValue: string): string | null {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, this.secretKey);
      return bytes.toString(CryptoJS.enc.Utf8) || null;
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }
}
