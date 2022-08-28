const {
  Client,
  Message,
  MessageEmbed
} = require("discord.js");
const guildSchema = require("../../Storage/Schemas/guildSchema");
const {
  User,
  Economy,
  CryptoWallets
} = require("../../Storage/Schemas/Economy/Economy");

module.exports = {
  name: "start",
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
      const {
        guild,
        author
      } = message;

      let MyEconomy = await Economy.findOne({
        serverID: guild.id,
      });

      let MyUser = await User.findOne({
        userID: message.author.id,
        serverID: message.guild.id,
      })

      const successEmbed = new MessageEmbed({
        color: "GREEN",
      });
      const errorEmbed = new MessageEmbed({
        color: "RED",
      });

      if (MyUser) return message.channel.send({
        embeds: [
          errorEmbed.setDescription("You already have an account set up!")
        ]
      })

      if (MyEconomy) {
        await User.create({
          serverID: guild.id,
          userID: author.id,
          EconomyID: MyEconomy.EconomyID
        });
        await MyEconomy.updateOne({
          $inc: {
            "Data.totalUsers": 1,
          },
        });
        await CryptoWallets.create({
          serverID: message.guild.id, 
          userID: message.author.id
        })

        successEmbed.setDescription(
          `You have created your economy profile in the **${MyEconomy.EconomyName}** Economy. \`${MyServer.prefix}profile\``
        );
        message.reply({
          embeds: [successEmbed]
        });
      } else {
        errorEmbed.setDescription(
          "The server admin still needs to create an economy. `/economy create`"
        );
        return message.channel.send({
          embeds: [errorEmbed]
        });
      }
    } else {
      return message.channel.send("Please set up Galaxy Bot first. `/setup`");
    }
  },
};