// src/@types/pix-payload.d.ts
declare module 'pix-payload' {
  interface PixOptions {
    chave: string;
    nome: string;
    cidade: string;
    valor: number;
    txid?: string;
  }

  export class Pix {
    constructor(options: PixOptions);
    getPayload(): string;
  }
}