const {
    Client,
    Message,
    MessageEmbed,
    MessageFlags
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const {
    User,
    Economy
} = require("../../Storage/Schemas/Economy/Economy");

module.exports = {
    name: "balance",
    cooldown: 10,
    aliases: ["bal"],
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
                    let balance = MyUser.wallet.balance;
                    let bank = MyUser.wallet.bank;
                    let crystals = MyUser.wallet.crystals;

                    let crystalemoji = "<:crystal:1005149749806112859>"

                    const response = new MessageEmbed({
                        title: `${message.author.username}'s balance`,
                        color: "LUMINOUS_VIVID_PINK",
                        fields: [{
                                name: `${currency} Balance`,
                                value: `\`\`\`${balance}\`\`\``,
                                inline: true
                            },
                            {
                                name: `${currency} Bank`,
                                value: `\`\`\`${bank}\`\`\``,
                                inline: true
                            },
                            {
                                name: `${crystalemoji} Crystals`,
                                value: `\`\`\`${crystals}\`\`\``,
                                inline: true
                            },
                        ]
                    });

                    message.channel.send({
                        embeds: [response]
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