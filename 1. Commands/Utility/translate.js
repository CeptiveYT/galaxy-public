const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const translate = require("@iamtraction/google-translate")

module.exports = {
    name: "translate",
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

        if (MyServer) {

            let query = args.slice(0).join(" ");
            if (!query) return message.reply("Please enter a message for me to translate!");

            const translated = translate(query, {
                from: "auto", // any detected lanuage
                to: "en" // english
            })

            let embed = new MessageEmbed({
                color: "GREEN",
                description: `**__Original Text__**\n\`\`\`${query}\`\`\` \n**__Translated Text (en)__**\n\`\`\`${(await translated).text}\`\`\``
            });

            message.channel.send({
                embeds: [embed]
            })

        } else {
            return message.channel.send("Please set up Stream Bot first. `/setup`");
        }
    }
}