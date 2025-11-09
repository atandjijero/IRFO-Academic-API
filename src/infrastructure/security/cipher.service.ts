import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CipherService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly key = crypto.createHash('sha256').update(String(process.env.CIPHER_KEY)).digest();
  private readonly ivLength = 16;

  encrypt(text: string): string {
    const iv = crypto.randomBytes(this.ivLength);
    const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  }

  decrypt(encryptedText: string): string {
    if (
      !encryptedText ||
      typeof encryptedText !== 'string' ||
      !encryptedText.includes(':')
    ) {
      throw new Error('Invalid encrypted input');
    }

    const [ivHex, encryptedHex] = encryptedText.split(':');
    if (!ivHex || !encryptedHex) {
      throw new Error('Malformed encrypted string');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const encrypted = Buffer.from(encryptedHex, 'hex');
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  }
}
