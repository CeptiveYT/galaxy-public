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
    name: "buy",
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

                    let choice = args[0];
                    let a = args[1];

                    let amount = parseInt(a)
                    if (!choice) return message.channel.send(`You need to proide an id! \`${MyServer.prefix}buy [id]\``)

                    let balance = MyUser.wallet.balance

                    switch (choice) {
                        case EconomyStorage.items.axe.id: {

                            if (balance < EconomyStorage.items.axe.buy_price) return message.reply("You do not have the funds in your balance to buy this item!");
                            await MyUser.updateOne({
                                $inc: {
                                    "wallet.balance": -EconomyStorage.items.axe.buy_price,
                                    "inv.axe": 1
                                }
                            }).then(() => {
                                message.channel.send({
                                    embeds: [
                                        new MessageEmbed({
                                            description: `You have bought 1 axe for ${MyEconomy.currency} ${EconomyStorage.items.axe.buy_price}`,
                                            color: "GREEN"
                                        })
                                    ]
                                })
                            })

                        }
                        break;
                    case EconomyStorage.items.pickaxe.id: {
                        if (balance < EconomyStorage.items.pickaxe.buy_price) return message.reply("You do not have the funds in your balance to buy this item!");
                        await MyUser.updateOne({
                            $inc: {
                                "wallet.balance": -EconomyStorage.items.pickaxe.buy_price,
                                "inv.pickaxe": 1
                            }
                        }).then(() => {
                            message.channel.send({
                                embeds: [
                                    new MessageEmbed({
                                        description: `You have bought 1 pickaxe for ${MyEconomy.currency} ${EconomyStorage.items.pickaxe.buy_price}`,
                                        color: "GREEN"
                                    })
                                ]
                            })
                        })
                    }
                    break;
                    case EconomyStorage.items.crystal.id: {

                        if (!a) {
                            if (balance < EconomyStorage.items.crystal.buy_price) return message.reply("You do not have the funds in your balance to buy this item!");
                            await MyUser.updateOne({
                                $inc: {
                                    "wallet.balance": -EconomyStorage.items.crystal.buy_price,
                                    "wallet.crystals": 1
                                }
                            }).then(() => {
                                message.channel.send({
                                    embeds: [
                                        new MessageEmbed({
                                            description: `You have bought 1 crystal for ${MyEconomy.currency} ${EconomyStorage.items.crystal.buy_price}`,
                                            color: "GREEN"
                                        })
                                    ]
                                })
                            })
                        } else {

                            let crystalPrice = EconomyStorage.items.crystal.buy_price;
                            let totaldPrice = amount * crystalPrice;

                            if (balance < totaldPrice) return message.reply("You do not have the funds in your balance to buy this item!");
                            await MyUser.updateOne({
                                $inc: {
                                    "wallet.balance": -totaldPrice,
                                    "wallet.crystals": amount
                                }
                            }).then(() => {
                                message.channel.send({
                                    embeds: [
                                        new MessageEmbed({
                                            description: `You have bought ${a} crystals for ${MyEconomy.currency} ${totaldPrice}`,
                                            color: "GREEN"
                                        })
                                    ]
                                })
                            })
                        }
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