const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const {
    User,
    Economy,
    CryptoPrices
} = require("../../Storage/Schemas/Economy/Economy");
const {
    EconomyStorage
} = require("../../Storage/Economy/EconomyStorage");
const asciiTable = require('ascii-table');

module.exports = {
    name: "crypto",
    cooldown: 30,
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

                    let crypto = await CryptoPrices.findOne({
                        id: "1"
                    });

                    let prices = crypto.prices;
                    const table = new asciiTable("Crypto Prices");
                    table.setHeading("Name", `Price`);

                    table.addRow("Bitcoin", prices.bitcoin);
                    table.addRow("Etherium", prices.etherium);
                    table.addRow("Cadarno", prices.cadarno);
                    table.addRow("Tether", prices.tether);
                    table.addRow("Dogecoin", prices.doge);
                    table.addRow("Stream", prices.stream);
                    table.addRow("Shiba", prices.shiba);
                    table.addRow("Litecoin", prices.litecoin);

                    const embed = new MessageEmbed({
                        color: "LUMINOUS_VIVID_PINK",
                        description: `\`\`\`${table.toString()}\`\`\``
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