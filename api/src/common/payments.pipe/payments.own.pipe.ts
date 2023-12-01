import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { PaymentDto } from 'src/dtos/payment.dtos';
import { LuhnValidator } from '../algorithms/luhn.validator';

@Injectable()
export class PaymentsOwnPipe implements PipeTransform {
  transform(value: PaymentDto, metadata: ArgumentMetadata) {
    const { email, card_number, cvv, expiration_year, expiration_month } =
      value;

    /** VALIDACIÓN DE email */
    // Garantizar que sean email válidos utilizando los siguientes dominios “gmail.com”, “hotmail.com”, “yahoo.es”.
    const emailRegex = new RegExp(
      /^[a-zA-Z0-9._-]+@(gmail.com|hotmail.com|yahoo.es)$/,
    );
    const isValidEmail = emailRegex.test(email);
    if (!isValidEmail) {
      throw new BadRequestException(
        'El email es inválido: Debe ser @gmail.com, @hotmail.com o @yahoo.es y solo puede tener como caracteres especiales a ., _ y -',
      );
    }
    // Garantizar que la longitud del email sea de 5 a 100 caracteres.
    const emailLength = email.length;
    if (emailLength < 5 || emailLength > 100) {
      throw new BadRequestException(
        'El email debe tener entre 5 y 100 caracteres',
      );
    }

    /** VALIDACIÓN DE card_number */
    // card_number debe ser de tipo number
    const cardNumberIsNumber = typeof card_number === 'number';
    if (!cardNumberIsNumber) {
      throw new BadRequestException('El número de tarjeta debe ser numérico');
    }
    // Debe tener entre 13 y 16 dígitos.
    const cardNumberLength = card_number.toString().length;
    if (cardNumberLength < 13 || cardNumberLength > 16) {
      throw new BadRequestException(
        'El número de tarjeta debe tener entre 13 y 16 dígitos',
      );
    }
    // Utilizar el algoritmo de LUHN para garantizar que la tarjeta sea válida.
    const isCardValid = LuhnValidator.validateCreditCardNumber(card_number);
    if (!isCardValid) {
      throw new BadRequestException('El número de tarjeta es inválido');
    }

    /** VALIDACIÓN DE cvv */
    // cvv debe ser de tipo number
    const cvvIsNumber = typeof cvv === 'number';
    if (!cvvIsNumber) {
      throw new BadRequestException('El cvv debe ser numérico');
    }
    // El cvv de las tarjetas de crédito AMEX deben tener 4 dígitos, para el resto de tarjetas debe tener 3 dígitos.
    const cardNumberString = card_number.toString();
    const firstDigit = cardNumberString[0];
    const isAmex = firstDigit === '3';
    const cvvLength = cvv.toString().length;
    const isValidCvv = isAmex ? cvvLength === 4 : cvvLength === 3;
    if (!isValidCvv) {
      throw new BadRequestException(
        `El cvv debe tener ${isAmex ? '4' : '3'} dígitos`,
      );
    }

    /** VALIDACIÓN DE expiration_month */
    // expiration_month debe ser de tipo string
    const expirationMonthIsString = typeof expiration_month === 'string';
    if (!expirationMonthIsString) {
      throw new BadRequestException(
        'El mes de expiración debe ser una cadena de texto',
      );
    }
    // expiration_month debe tener una longitud de 2 caracteres.
    const expirationMonthLength = expiration_month.length;
    if (expirationMonthLength !== 2) {
      throw new BadRequestException(
        'El mes de expiración debe tener 2 caracteres',
      );
    }
    // expiration_month debe ser un número entre 1 y 12.
    const expirationMonthNumber = Number(expiration_month);
    const isValidExpirationMonth =
      expirationMonthNumber >= 1 && expirationMonthNumber <= 12;
    if (!isValidExpirationMonth) {
      throw new BadRequestException(
        'El mes de expiración debe ser un número entre 1 y 12',
      );
    }

    /** VALIDACIÓN DE expiration_year */
    // expiration_year debe ser de tipo string
    const expirationYearIsString = typeof expiration_year === 'string';
    if (!expirationYearIsString) {
      throw new BadRequestException(
        'El año de expiración debe ser una cadena de texto',
      );
    }
    // expiration_year debe tener una longitud de 4 caracteres.
    const expirationYearLength = expiration_year.length;
    if (expirationYearLength !== 4) {
      throw new BadRequestException(
        'El año de expiración debe tener 4 caracteres',
      );
    }
    // expiration_year debe ser un número mayor o igual al año actual, pero menor a dentro de 5 años.
    const expirationYearNumber = Number(expiration_year);
    const currentYear = new Date().getFullYear();
    const isValidExpirationYear =
      expirationYearNumber >= currentYear &&
      expirationYearNumber <= currentYear + 5;
    if (!isValidExpirationYear) {
      throw new BadRequestException(
        `El año de expiración debe ser mayor o igual al año actual (${currentYear}) y menor a dentro de 5 años`,
      );
    }

    return value;
  }
}

@Injectable()
export class TokenOwnPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('El token es requerido');
    }
    if (typeof value !== 'string') {
      throw new BadRequestException('El token debe ser una cadena de texto');
    }
    if (value.length !== 16) {
      throw new BadRequestException('El token debe tener 16 caracteres');
    }
    return value;
  }
}
