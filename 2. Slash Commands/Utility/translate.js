const translate = require('@iamtraction/google-translate');
const {
    Client,
    MessageEmbed,
    CommandInteraction,
    Message
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "translate",
    description: "translate any language into english",
    enabled: true,
    options: [
      {
          name: "message",
          description: "Message you want to translate",
          type: 3,
          required: true
      },
      {
          name: "to",
          description: "Select a language you want to translate the message to.",
          type: 3,
          required: true,
          choices: [
            {
              name: "English",
              value: "en"
            },
            {
              name: "French",
              value: "fr"
            },
            {
              name: "German",
              value: "de"
            },
            {
              name: "Russian",
              value: "ru"
            },
            {
              name: "Japanese",
              value: "ja"
            },
            {
              name: "Chinese Simpified",
              value: "zh-cn"
            },
            {
              name: "Chinese Traditional",
              value: "zh-tw"
            },
            {
              name: "Italian",
              value: "it"
            }
          ]
      }
    ],
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = await guildSchema.findOne({
            serverID: interaction.guild.id
        });

        if (MyServer) {

            let message = interaction.options.getString("message");
            let language = interaction.options.getString("to")

            const translated = await translate(message, {
                from: "auto",
                to: `${language}`
            });

            interaction.reply({
                content: `${translated.text}`,
                ephemeral: false
            })

        } else {
            return interaction.reply("Please set up Galaxy Bot first. `/setup`");
        }
    }
}
