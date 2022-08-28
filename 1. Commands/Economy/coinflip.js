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
    name: "coinflip",
    cooldown: 15,
    aliases: ["cf"],
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

                    let winEmbed = new MessageEmbed({
                        color: "GREEN"
                    });
                    let loseEmbed = new MessageEmbed({
                        color: "RED"
                    });

                    let choice = args[0];
                    let amount = args[1];
                    if (!choice) return message.reply(`Please choose a side \`heads\` \`tails\`\nUsage: \`${MyServer.prefix}coinflip [heads | tails] [amount]\``);
                    if (!amount) return message.reply(`Please enter how much you want to wage.\nUsage: \`${MyServer.prefix}coinflip [heads | tails] [amount]\``);
                    if (amount % 1 != 0 || amount <= 0) return message.channel.send(`Please enter a valid amount to wage.\nUsage: \`${MyServer.prefix}coinflip [heads | tails] [amount]\``);
                    if (amount > MyUser.wallet.balance) return message.channel.send("You don't have that amount of money to wage.");

                    let winlosearr = ["heads", "tails"];
                    let outcome = winlosearr[Math.floor(Math.random() * winlosearr.length)];

                    let winlose = winlosearr;

                    await MyUser.updateOne({
                        $inc: {
                            "wallet.balance": -amount
                        }
                    })

                    let response = await message.channel.send({
                        embeds: [
                            winEmbed.setDescription(`You have bet **${MyEconomy.currency}${amount}** on **${choice}**.\nPlease wait 10 seconds to see the results.`)
                        ]
                    })

                    switch (choice) {
                        case "heads": {

                            if (outcome == "heads") {

                                setTimeout(async () => {

                                    await MyUser.updateOne({
                                        $inc: {
                                            "wallet.balance": (amount * 2)
                                        }
                                    }).then(async () => {
                                        await response.edit({
                                            embeds: [
                                                winEmbed.setDescription(`**HEADS!** You have won **${MyEconomy.currency}${amount}**`)
                                            ]
                                        }).then(async () => {
                                            await MyEconomy.updateOne({
                                                $inc: {
                                                    "Data.totalValue": amount
                                                }
                                            })
                                        })
                                    })

                                }, 10000);

                            } else {

                                setTimeout(() => {

                                    loseEmbed.setDescription(`**TAILS!** You have lost **${MyEconomy.currency}${amount}**`)
                                    return response.edit({
                                        embeds: [loseEmbed]
                                    }).then(async () => {
                                        await MyEconomy.updateOne({
                                            $inc: {
                                                "Data.totalValue": -amount
                                            }
                                        })
                                    })

                                }, 10000);

                            }
                        }
                        break;

                    case "tails": {
                        if (outcome == "tails") {

                            setTimeout(async () => {

                                await MyUser.updateOne({
                                    $inc: {
                                        "wallet.balance": (amount * 2)
                                    }
                                }).then(async () => {
                                    await response.edit({
                                        embeds: [
                                            winEmbed.setDescription(`**TAILS!** You have won **${MyEconomy.currency}${amount}**`)
                                        ]
                                    }).then(async () => {
                                        await MyEconomy.updateOne({
                                            $inc: {
                                                "Data.totalValue": amount
                                            }
                                        })
                                    })
                                })

                            }, 10000);

                        } else {

                            setTimeout(() => {

                                loseEmbed.setDescription(`**HEADS!** You have lost **${MyEconomy.currency}${amount}**`)
                                return response.edit({
                                    embeds: [loseEmbed]
                                }).then(async () => {
                                    await MyEconomy.updateOne({
                                        $inc: {
                                            "Data.totalValue": -amount
                                        }
                                    })
                                })

                            }, 10000);

                        }
                    }
                    }


                    let headTails = [
                        "heads",
                        "tails"
                    ]
                    let chosen = headTails[Math.floor(Math.random() * headTails.length)]



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