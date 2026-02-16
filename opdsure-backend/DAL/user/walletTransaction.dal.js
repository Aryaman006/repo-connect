const { walletTransaction } = require("../../models");

const WalletTransactionDal= {

    AddWalletTransaction: async (data) => await walletTransaction.create(data),
    GetWalletTransaction: async (query, params) => await walletTransaction.findOne(query).select(params).lean(),
    GetWalletTransactions: async (query, limit, params) => await walletTransaction.find(query).select(params).limit(limit).sort("-createdAt")

};

module.exports = WalletTransactionDal;
