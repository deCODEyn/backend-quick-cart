import { cpf } from 'cpf-cnpj-validator';

export function isCpfValid(cpfToValidate: string): boolean {
  return cpf.isValid(cpfToValidate);
}

const regex = /^[0-9.-]+$/;
export function isRgValid(rg: string): boolean {
  return regex.test(rg);
}
