const {Client, Message} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "say",
    cooldown: 15,
    permissions: "MANAGE_MESSAGES",
    enabled: true,
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, args, commandName, client, Discord) {
        let MyServer = guildSchema.findOne({ serverID: message.guild.id });
    
        if (MyServer) {
            
            let query = args.slice(0).join(" ");
            
            if (query) {
                message.channel.send(query);
                await message.delete();
            } else {
                return message.reply("Please enter a message for me to say.");
            }

        } else {
            return message.reply("Please set up Stream Bot first. `/setup`");
        }

    }
}
