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
const {
    generate
} = require('better-output');

module.exports = {
    name: "crime",
    cooldown: 300,
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


                    let winLose = generate.ranInt(1, 2);

                    switch (winLose) {
                        // win 
                        case 1: {

                            let minPay = EconomyStorage.pays.crimePay.min;
                            let maxPay = EconomyStorage.pays.crimePay.max;
                            let pay = generate.ranInt(minPay, maxPay);

                            const response = new MessageEmbed({
                                description: `${message.author} you committed a crime and earned your self **${MyEconomy.currency}${pay}**`,
                                color: "GREEN"
                            });

                            await MyUser.updateOne({
                                $inc: {
                                    "wallet.balance": pay
                                }
                            }).then(() => {
                                message.channel.send({
                                    embeds: [response]
                                }).then(async () => {
                                    await MyEconomy.updateOne({
                                        $inc: {
                                            "Data.totalValue": pay
                                        }
                                    })
                                })
                            })
                        }
                        break;

                        // lose
                    case 2: {
                        let minPay = EconomyStorage.pays.crimePay.min;
                        let maxPay = EconomyStorage.pays.crimePay.max;
                        let losePay = generate.ranInt(minPay, maxPay);

                        const response = new MessageEmbed({
                            description: `${message.author} you tried to commit a crime but got caught. You were charged **${MyEconomy.currency}-${losePay}**`,
                            color: "RED"
                        })

                        await MyUser.updateOne({
                            $inc: {
                                "wallet.balance": -losePay
                            }
                        }).then(() => {
                            message.channel.send({
                                embeds: [response]
                            }).then(async () => {
                                await MyEconomy.updateOne({
                                    $inc: {
                                        "Data.totalValue": -losePay
                                    }
                                })
                            })
                        })
                    }
                    break;
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