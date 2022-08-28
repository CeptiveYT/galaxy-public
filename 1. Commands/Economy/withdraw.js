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
    name: "withdraw",
    aliases: ["with"],
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

                    const amount = args[0];
                    let balance = MyUser.wallet.bank;

                    if (amount == "all") {
                        if (balance % 1 != 0 || balance <= 0) return message.reply("You are currently in debt and are not able to withdraw anything!");
                        await MyUser.updateOne({
                            $inc: {
                                "wallet.bank": -balance,
                                "wallet.balance": balance,
                            }
                        }).then(() => {
                            const response = new MessageEmbed({
                                description: `You have withdrew **${MyEconomy.currency}${balance}** from your bank.`,
                                color: "GREEN"
                            });
                            message.channel.send({
                                embeds: [response]
                            })
                        })

                    } else {
                        if (amount % 1 != 0 || amount <= 0) return message.reply("Deposit must be a whole number");
                        try {

                            if (amount > MyUser.wallet.bank) return message.channel.send("You don't have that amount of money to withdraw.");

                            await MyUser.updateOne({
                                $inc: {
                                    "wallet.balance": amount,
                                    "wallet.bank": -amount
                                }
                            }).then(() => {
                                const response = new MessageEmbed({
                                    description: `You have withdrew **${MyEconomy.currency}${amount}** from your bank`,
                                    color: "LUMINOUS_VIVID_PINK"
                                })
                                message.channel.send({
                                    embeds: [response]
                                })
                            })

                        } catch (err) {
                            console.log(err)
                        }

                    }

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