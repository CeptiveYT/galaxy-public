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
    name: "leaderboard",
    cooldown: 60,
    aliases: ["lb"],
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
        })

        if (MyServer) {

            if (MyEconomy) {
                if (MyUser) {

                    const users = await User.find({
                        serverID: message.guild.id
                    }).then(users => {
                        return users.filter(async user => {
                            await message.guild.members.fetch(user.userID);
                        });
                    })

                    const sortedUsers = users.sort((a, b) => {
                        return (b.wallet.balance + b.wallet.bank) - (a.wallet.balance + a.wallet.bank)
                    }).slice(0, 10);

                    const embed = new MessageEmbed({
                        title: `${MyEconomy.EconomyName} Economy | Leaderboard`,
                        description: `${sortedUsers.map((user, index) => {
                            return `**${index + 1}.** <@${user.userID}> - **${MyEconomy.currency} ${user.wallet.balance + user.wallet.bank}**`
                        }).join("\n")}`,
                        color: "LUMINOUS_VIVID_PINK"
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
