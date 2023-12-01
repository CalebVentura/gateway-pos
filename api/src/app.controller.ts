import {
  Controller,
  Param,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { PaymentDto, UpdatePaymentDto } from './dtos/payment.dtos';
import {
  PaymentsOwnPipe,
  TokenOwnPipe,
} from './common/payments.pipe/payments.own.pipe';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Hello world
  @Get('/health')
  getHello() {
    return { message: 'Hello world' };
  }

  // Generate a token
  @Post('/tokens')
  generateToken(@Body(new PaymentsOwnPipe()) paymentDto: PaymentDto): any {
    return this.appService.generateToken(paymentDto);
  }

  // Get a token
  @Get('/tokens/:tokenId')
  getToken(@Param('tokenId', TokenOwnPipe) tokenId: string): any {
    return this.appService.getDataByToken(tokenId);
  }

  /** ADICIONALES USANDO POSTGRESQL */

  // Create a new payment
  @Post('/pg')
  postPayment(@Body(new PaymentsOwnPipe()) paymentDto: PaymentDto): any {
    return this.appService.createPayment(paymentDto);
  }

  // Get all payments
  @Get('/pg')
  getPayments(): any {
    return this.appService.getAllPayment();
  }

  // Get one payment
  @Get('/pg/:id')
  getPayment(@Param('id', ParseIntPipe) id: number): any {
    return this.appService.getPaymentById(id);
  }

  // Update a payment
  @Patch('/pg/:id')
  updatePayment(
    @Param('id', ParseIntPipe) id: number,
    @Body(new PaymentsOwnPipe()) payload: UpdatePaymentDto,
  ): any {
    return this.appService.update(id, payload);
  }

  // Delete a payment
  @Delete('/pg/:id')
  deletePayment(@Param('id', ParseIntPipe) id: number): any {
    return this.appService.remove(id);
  }
}
