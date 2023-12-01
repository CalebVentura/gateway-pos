import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
  Entity,
} from 'typeorm';

@Entity({ name: 'payment', schema: 'public' })
export class PaymentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'card_number', type: 'bigint' })
  card_number: number;

  @Column({ name: 'cvv' })
  cvv: number;

  @Column({ name: 'expiration_month' })
  expiration_month: string;

  @Column({ name: 'expiration_year' })
  expiration_year: string;

  @Column({ name: 'email' })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
