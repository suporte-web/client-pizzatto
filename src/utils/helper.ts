export const formatarTelefone = (valor: string): string => {
  // Remove tudo que não é dígito
  const apenasDigitos = valor.replace(/\D/g, '');
  
  // Limita a 11 dígitos (máximo para telefone brasileiro)
  const digitosLimitados = apenasDigitos.slice(0, 11);
  
  // Aplica a formatação baseada no número de dígitos
  if (digitosLimitados.length <= 2) {
    return digitosLimitados;
  } else if (digitosLimitados.length <= 6) {
    return `(${digitosLimitados.slice(0, 2)}) ${digitosLimitados.slice(2)}`;
  } else if (digitosLimitados.length <= 10) {
    return `(${digitosLimitados.slice(0, 2)}) ${digitosLimitados.slice(2, 6)}-${digitosLimitados.slice(6)}`;
  } else {
    return `(${digitosLimitados.slice(0, 2)}) ${digitosLimitados.slice(2, 7)}-${digitosLimitados.slice(7)}`;
  }
};

export const formatarCPF = (valor: string): string => {
  // Remove tudo que não é dígito
  const apenasDigitos = valor.replace(/\D/g, '');
  
  // Limita a 11 dígitos
  const digitosLimitados = apenasDigitos.slice(0, 11);
  
  // Aplica a formatação do CPF
  if (digitosLimitados.length <= 3) {
    return digitosLimitados;
  } else if (digitosLimitados.length <= 6) {
    return `${digitosLimitados.slice(0, 3)}.${digitosLimitados.slice(3)}`;
  } else if (digitosLimitados.length <= 9) {
    return `${digitosLimitados.slice(0, 3)}.${digitosLimitados.slice(3, 6)}.${digitosLimitados.slice(6)}`;
  } else {
    return `${digitosLimitados.slice(0, 3)}.${digitosLimitados.slice(3, 6)}.${digitosLimitados.slice(6, 9)}-${digitosLimitados.slice(9)}`;
  }
};