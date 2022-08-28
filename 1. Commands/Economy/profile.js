const {
  Client,
  Message,
  MessageEmbed
} = require("discord.js");
const guildSchema = require("../../Storage/Schemas/guildSchema");
const {
  User,
  Economy
} = require("../../Storage/Schemas/Economy/Economy");
const axios = require("axios").default;

module.exports = {
  name: "profile",
  cooldown: 10,
  enabled: true,
  /**
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, args, commandName, client, Discord) {
    let MyServer = await guildSchema.findOne({
      serverID: message.guild.id
    });

    if (MyServer) {
      const MyEconomy = await Economy.findOne({
        serverID: message.guild.id
      });

      if (MyEconomy) {
        const user = await User.findOne({
          userID: message.author.id,
          serverID: message.guild.id
        });

        if (!user) {
          return message.channel.send(
            `You need to create a profile/account. \`${MyServer.prefix}start\``
          );
        } else {
          let currency = MyEconomy.currency;

          let balance = await user.wallet.balance;
          let bank = await user.wallet.bank;
          let crystals = await user.wallet.crystals;

          const me = message.author.id;

          const r = new MessageEmbed({
            title: `${message.author.username}'s Profile`,
            thumbnail: {
              url: `${message.author.displayAvatarURL({
                dynamic: true,
              })}`,
            },
            color: "LUMINOUS_VIVID_PINK",
            fields: [{
                name: "ℹ️ __General__",
                value: `**User:** ${message.author}\n**User ID:** \`${message.author.id}\`\n**Economy:** \`${MyEconomy.EconomyName}\``,
                inline: true,
              },
              {
                name: `${MyEconomy.currency} __Wallet__`,
                value: `**Balance:** **${currency}${balance}** \n**Bank:** **${currency}${bank}** \n**Crystals:** **${crystals}**`,
                inline: true,
              },
            ],
          });
          return message.channel.send({
            embeds: [r]
          });
            
        }
      } else {
        return message.channel.send(
          "The administrators still need to create an economy. `/economy create`"
        );
      }
    } else {
      return message.channel.send("Please set up Galaxy Bot first. `/setup`");
    }
  },
};