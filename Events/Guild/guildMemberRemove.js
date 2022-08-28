const { Client, MessageEmbed, GuildMember, Message } = require("discord.js"); 
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "guildMemberRemove", 
    once: false,
    /**
     * @param {Message} message
     * @param {Client} client
     * @param {GuildMember} member
     */
    async execute(member, client, Discord) {
        let { guild } = member

        let MyServer = await guildSchema.findOne({ serverID: guild.id });

        if (MyServer) {

            let welcomeid = MyServer.welcomechannelID;
            if (!welcomeid) return

            const wChannel = guild.channels.cache.get(welcomeid);

            const welcomeEmbed = new MessageEmbed({
                title: `${member.user.username} has left the server!`,
                description: `**${member.user.tag}** has left the server.\n**Latest Member Count:** \`${guild.memberCount}\``,
                thumbnail: {
                    url: `${member.user.displayAvatarURL({ dynamic: true })}`
                }, 
                color: "#2f3136"
            })

            wChannel.send({ embeds: [welcomeEmbed] });

        } else {
            return
        }
    }
}