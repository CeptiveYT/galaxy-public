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
    name: "mine",
    cooldown: 3600,
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

                    let Axe = MyUser.inv.pickaxe;
                    if (Axe < 1) return message.reply("You need an axe before you can use this command!" + " " + `\`${MyServer.prefix}shop\``)

                    let MinPay = EconomyStorage.pays.minePay.min;
                    let MaxPay = EconomyStorage.pays.minePay.max;

                    let pay = generate.ranInt(MinPay, MaxPay);
                    let ironOre = generate.ranInt(1, 19);

                    const response = new MessageEmbed({
                        description: `${message.author} you have mined **${ironOre} Iron ore** and earned **${MyEconomy.currency} ${pay}**`,
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