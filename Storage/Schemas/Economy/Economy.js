const mongoose = require("mongoose");

const NewEconomySchema = new mongoose.Schema({
  EconomyID: { type: String, require: true },
  serverID: { type: String, require: true },
  ownerID: { type: String, require: true },
  currency: { type: String, require: true },
  EconomyName: { type: String, require: true },
  Data: {
    totalValue: { type: Number, default: 0 },
    totalUsers: { type: Number, default: 0 },
  },
});

const NewUserSchema = new mongoose.Schema({
  serverID: { type: String, require: true },
  EconomyID: { type: String, require: true }, 
  userID: { type: String, require: true },
  wallet: {
    balance: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    crystals: { type: Number, default: 0 },
  },
  inv: {
    pickaxe: { type: Number, default: 0 },
    axe: { type: Number, default: 0 },
  }
});

const CryptoWalletSchema = new mongoose.Schema({
  serverID: { type: String, require: true }, 
  userID: { type: String, require: true }, 
  wallet: {
    bitcoin: { type: Number, default: 0 },
    etherium: { type: Number, default: 0 },
    tether: { type: Number, default: 0 },
    cadarno: { type: Number, default: 0 },
    doge: { type: Number, default: 0 },
    stream: { type: Number, default: 0 },
    shiba: { type: Number, default: 0 },
    litecoin: { type: Number, default: 0 },
  }
})

const CryptoPricesSchema = new mongoose.Schema({
  id: String, 
  prices: {
    bitcoin: { type: Number, default: 0 },
    etherium: { type: Number, default: 0 },
    tether: { type: Number, default: 0 },
    cadarno: { type: Number, default: 0 },
    doge: { type: Number, default: 0 },
    stream: { type: Number, default: 0 },
    shiba: { type: Number, default: 0 },
    litecoin: { type: Number, default: 0 },
  }
})

const Economy = mongoose.model("economies", NewEconomySchema);
const User = mongoose.model("economy_users", NewUserSchema);
const CryptoWallets = mongoose.model("crypto_wallets", CryptoWalletSchema);
const CryptoPrices = mongoose.model("crypto_prices", CryptoPricesSchema)


module.exports = {
  Economy,
  User, 
  CryptoWallets,
  CryptoPrices
};
