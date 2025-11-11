import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CryptoService } from './crypto.service';
import { MessageDto } from './dto/message.dto';
import { randomBytes } from 'crypto';

@ApiTags('Crypto')
@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('process')
  @ApiOperation({ summary: 'Chiffrer et déchiffrer un message' })
  processMessage(@Body() dto: MessageDto) {
    return this.cryptoService.process(dto.message, dto.key, dto.iv);
  }

  @Post('generate-keys')
  @ApiOperation({ summary: 'Générer une clé et un IV aléatoires (hex)' })
  generateKeys() {
    const key = randomBytes(16).toString('hex'); // 16 octets = 128 bits
    const iv = randomBytes(16).toString('hex');
    return { key, iv };
  }
}
