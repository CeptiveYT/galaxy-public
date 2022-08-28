const {Client, Message, MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "invite",
    cooldown: 30,
    aliases: ["inv"],
    enabled: true,
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, args, commandName, client, Discord) {
        let MyServer = await guildSchema.findOne({ serverID: message.guild.id });

        if (MyServer) {

            const embed = new MessageEmbed({
                title: "Invite Galaxy", 
                description: `Invite Galaxy to your server by clicking the button below!`, 
                color: "LUMINOUS_VIVID_PINK"
            });

            const row = new MessageActionRow()
            row.addComponents(
                new MessageButton({
                    label: "Invite me!", 
                    emoji: "🤖", 
                    style: "LINK",
                    url: "https://discord.com/api/oauth2/authorize?client_id=1000760561002365049&permissions=8&scope=applications.commands%20bot"
                })
            );
            
            message.channel.send({
                embeds: [embed], components: [row]
            })

        } else {
            return message.channel.send("Please set up Stream Bot first. `/setup`");
        }
    }
}
