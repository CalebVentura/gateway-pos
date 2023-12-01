export class LuhnValidator {
  static validateCreditCardNumber(cardNumber: number): boolean {
    // Convertir el número a una cadena y limpiar espacios en blanco
    const cleanedCardNumber = cardNumber.toString().replace(/\s/g, '');

    // Verificar que la cadena sea una serie de dígitos numéricos
    if (!/^\d+$/.test(cleanedCardNumber)) {
      return false;
    }

    // Convertir la cadena a un array de números
    const digits = cleanedCardNumber.split('').map(Number);

    // Invertir el array
    const reversedDigits = digits.reverse();

    // Aplicar el algoritmo de Luhn
    let sum = 0;
    for (let i = 0; i < reversedDigits.length; i++) {
      let digit = reversedDigits[i];

      // Duplicar los dígitos en posiciones pares
      if (i % 2 !== 0) {
        digit *= 2;

        // Restar 9 si el resultado es mayor que 9
        if (digit > 9) {
          digit -= 9;
        }
      }

      // Sumar los dígitos
      sum += digit;
    }

    // El número es válido si la suma es un múltiplo de 10
    return sum % 10 === 0;
  }
}
