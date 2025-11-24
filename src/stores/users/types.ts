export interface UserAcessos {
    administrador: boolean;
    financeiro: boolean;
    rh: boolean;
    comercial: boolean;
    vendedor: boolean;
    cliente: boolean;
}

export interface IUser {
  _id: string;
  nome: string;
  email: string;
  administrador: boolean;
  interno: boolean;
  primeiroAcesso: boolean;
  empresa: string | {
    _id: string;
    cnpj: string;
    razaoSocial: string;
    logo?: string;
    ativo: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  acessos: UserAcessos;
  createdAt: string;
  updatedAt: string;
  politicaAceita: boolean;
}