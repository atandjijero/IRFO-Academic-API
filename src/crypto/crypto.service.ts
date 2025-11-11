import { Injectable } from '@nestjs/common';
import { cipher } from 'cipher-cbc-ts';

@Injectable()
export class CryptoService {
  process(message: string, keyHex: string, ivHex: string) {
    const key = Buffer.from(keyHex, 'hex');
    const iv = Buffer.from(ivHex, 'hex');
    const cph = cipher(key, iv);
    const encrypted = cph.encrypt(message);
    const decrypted = cph.decrypt(encrypted);
    return {
      encrypted,
      decrypted: decrypted.text,
    };
  }
}
