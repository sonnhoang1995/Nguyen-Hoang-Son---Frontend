export interface Token {
    currency: string
    price: number
    date: string
}

export enum FormType {
    From = "from",
    To = "to"
}

export type CurrencySwapFormType = FormType.From | FormType.To
