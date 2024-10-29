export enum appInfo {
  title = 'UPI Flow',
  desc = 'UPIFlow simplifies tracking your UPI transactions, giving you clear insights into your spending.',
}

export enum banks {
  icici = 'icicibank',
  sbi = 'statebank',
}

export enum PaymentModes {
  CASH = 'Cash',
  CREDIT_CARD = 'Credit Card',
  DEBIT_CARD = 'Debit Card',
  NET_BANKING = 'Net Banking',
  MOBILE_BANKING = 'Moblie Banking',
  UPI = 'UPI',
  WALLET = 'Wallet',
  CHEQUE = 'Cheque',
  OTHER = 'Other',
  Int = 'Interest',
}

export interface Transaction {
  id: number;
  date: string;
  balance: number;
  mode?: string | null;
  credit?: number | null;
  debit?: number | null;
  refNo?: string | null;
  details?: string | null;
  amt?: number;
}

export const FilterOption: { [key: string]: { name: string; format: string } } =
  {
    Daily: { name: 'Daily', format: 'MMM dd, yyyy' },
    Weekly: { name: 'Weekly', format: 'MMM dd' },
    Monthly: { name: 'Monthly', format: 'MMMM, yyyy' },
    ThreeMonths: { name: '3 Months', format: 'MMM' },
    SixMonths: { name: '6 Months', format: 'MMM' },
    Yearly: { name: 'Yearly', format: 'yyyy' },
  };
