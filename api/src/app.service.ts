import { Injectable, BadRequestException } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';

import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { PaymentDto, UpdatePaymentDto } from './dtos/payment.dtos';
import { PaymentEntity } from './entities/payment.entity';
import { RedisService } from './services/redis.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(PaymentEntity)
    private paymetRepository: Repository<PaymentEntity>,
    private readonly redisService: RedisService,
  ) {}

  // Create a new payment
  async createPayment(PaymentDto: PaymentDto): Promise<any> {
    // Create
    const payment = this.paymetRepository.create(PaymentDto);
    return await this.paymetRepository.save(payment);
  }

  // Get a payments
  async getAllPayment(): Promise<any> {
    return await this.paymetRepository.find({ order: { id: 'ASC' } });
  }

  // Get one payment by id
  async getPaymentById(id: number): Promise<any> {
    const payment = await this.paymetRepository.findOneBy({ id });
    if (!payment) {
      throw new BadRequestException('Payment not found');
    }
    return payment;
  }

  // Update
  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    const resp = await this.paymetRepository.update(
      { id },
      { ...updatePaymentDto },
    );

    if (resp.affected) {
      throw new BadRequestException(`Payment with id ${id} not exist.`);
    }

    return {
      message: `Payment with id ${id} successfully updated.`,
      error: '',
      statusCode: 200,
    };
  }

  // Eliminar una transacción
  async remove(id: number) {
    const resp = await this.paymetRepository.softDelete(id);

    if (resp.affected) {
      throw new BadRequestException(`Payment with id ${id} not exist.`);
    }

    return {
      message: `Payment with id ${id} successfully deleted.`,
      error: '',
      statusCode: 200,
    };
  }

  async generateToken(paymentDto: PaymentDto) {
    // Generación de token
    const tokenLength = 16;
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < tokenLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }
    let encryptedToken = CryptoJS.SHA256(token).toString(CryptoJS.enc.Hex);
    encryptedToken = encryptedToken.substring(0, tokenLength);
    // Guardado de la información en Redis
    await this.redisService.setWithExpiration(
      encryptedToken,
      JSON.stringify({ token: encryptedToken, ...paymentDto }),
      60 * 15,
    );

    return { token: encryptedToken };
  }

  async getDataByToken(tokenId: string) {
    const paymentData = await this.redisService.get(tokenId);
    if (!paymentData) {
      throw new BadRequestException('Payment with token not found');
    }
    // Se quita el cvv para no mostrarlo.
    delete paymentData.cvv;
    return paymentData;
  }
}
