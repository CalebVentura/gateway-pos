import { PartialType } from '@nestjs/swagger';

export class PaymentDto {
  card_number: number;
  cvv: number;
  expiration_month: string;
  expiration_year: string;
  email: string;
}

export class UpdatePaymentDto extends PartialType(PaymentDto) {}
