export interface IEarning {
  _id: string;
  userId: string;
  userInfo?: any;
  transactionTokenId: string;
  transactionInfo?: any;
  performerId: string;
  performerInfo?: any;
  sourceType: string;
  grossPrice: number;
  netPrice?: number;
  commission?: number;
  isPaid?: boolean;
  createdAt: Date;
  paidAt?: Date;
  transactionStatus?: string;
  targetInfo?: {
    username?: string;
  };
  sourceInfo?: {
    username?: string;
  };
}
