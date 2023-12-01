import { PaymentDto } from './payment.dtos';

export class PaymentRedisDto extends PaymentDto {
  id: number;
  created_at: Date;
  updated_at: Date;
  token: string;
}
