const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const {
    User,
    Economy
} = require("../../Storage/Schemas/Economy/Economy");
const {
    EconomyStorage
} = require("../../Storage/Economy/EconomyStorage");

module.exports = {
    name: "shop",
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

                    let currency = MyEconomy.currency;

                    const shopEmbed = new MessageEmbed({
                        title: `${MyEconomy.EconomyName}'s Shop`,
                        description: `List of items you can buy.\nUsage: \`${MyServer.prefix}buy [id]\``,
                        color: "LUMINOUS_VIVID_PINK",
                        fields: [{
                                name: `<:crystal:1005149749806112859> Crystal - ${currency} ${EconomyStorage.items.crystal.buy_price}`,
                                value: `ID: \`${EconomyStorage.items.crystal.id}\`\n`,
                            },
                            {
                                name: `<:pickaxe:1005460414886334505> Pickaxe - ${currency} ${EconomyStorage.items.pickaxe.buy_price}`,
                                value: `ID: \`${EconomyStorage.items.pickaxe.id}\`\n`
                            },
                            {
                                name: `<:diamondaxe:1005460385589100625> Axe - ${currency} ${EconomyStorage.items.axe.buy_price}`,
                                value: `ID: \`${EconomyStorage.items.axe.id}\`\n`
                            }
                            
                        ]
                    });
                    message.channel.send({
                        embeds: [shopEmbed]
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