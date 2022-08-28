const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const {
    User,
    Economy,
    CryptoWallets,
    CryptoPrices
} = require("../../Storage/Schemas/Economy/Economy");
const {
    EconomyStorage
} = require("../../Storage/Economy/EconomyStorage");
const Ascii = require("ascii-table");

module.exports = {
    name: "wallet",
    cooldown: 60, 
    enabled: true,
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, args, commandName, client, Discord) {
        let MyServer = await guildSchema.findOne({
            serverID: message.guild.id
        });

        let MyEconomy = await Economy.findOne({
            serverID: message.guild.id
        });
        let MyUser = await User.findOne({
            userID: message.author.id,
            serverID: message.guild.id
        });

        if (MyServer) {

            if (MyEconomy) {
                if (MyUser) {

                    let MyCrypto = await CryptoWallets.findOne({
                        serverID: message.guild.id,
                        userID: message.author.id
                    });
                    let CryptoPrice = await CryptoPrices.findOne({
                        id: "1"
                    })

                    let wallet = MyCrypto.wallet;
                    let prices = CryptoPrice.prices;

                    let BitcoinTotal = wallet.bitcoin * prices.bitcoin;
                    let EtheriumTotal = wallet.etherium * prices.etherium;
                    let TetherTotal = wallet.tether * prices.tether;
                    let CadarnoTotal = wallet.cadarno * prices.cadarno;
                    let DogeTotal = wallet.doge * prices.doge;
                    let StreamTotal = wallet.stream * prices.stream;
                    let ShibaTotal = wallet.shiba * prices.shiba;
                    let LitecoinTotal = wallet.litecoin * prices.litecoin;

                    const Table = new Ascii(`${message.author.username}'s Crypto Wallet`);
                    Table.setHeading("Name", "Amount", "Total Worth");
                    Table.addRow("Bitcoin", wallet.bitcoin, BitcoinTotal);
                    Table.addRow("Etherium", wallet.etherium, EtheriumTotal);
                    Table.addRow("Tether", wallet.tether, TetherTotal);
                    Table.addRow("Cadarno", wallet.cadarno, CadarnoTotal);
                    Table.addRow("Doge", wallet.doge, DogeTotal);
                    Table.addRow("Stream", wallet.stream, StreamTotal);
                    Table.addRow("Shiba", wallet.shiba, ShibaTotal);
                    Table.addRow("Litecoin", wallet.litecoin, LitecoinTotal);

                    const embed = new MessageEmbed({
                        color: "LUMINOUS_VIVID_PINK",
                        description: `\`\`\`${Table.toString()}\`\`\``
                    })

                    message.channel.send({
                        embeds: [embed]
                    })


                } else {
                    return message.reply(`You need to create a profile/account. \`${MyServer.prefix}start\``)
                }
            } else {
                return message.reply("The administrators still need to create an economy. `/economy create`");
            }

        } else {
            return message.channel.send("Please set up Galaxy Bot first. `/setup`");
        }
    }
}