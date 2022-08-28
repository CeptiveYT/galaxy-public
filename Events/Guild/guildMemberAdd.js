const { Client, Message, GuildMember, Guild, MessageEmbed } = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");
const { Blacklist } = require('../../Storage/Schemas/UserBlacklist');

module.exports = {
    name: "guildMemberAdd",
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

            const SoftBannedUser = await Blacklist.findOne({
                Server_ID: member.guild.id, 
                User_ID: member.user.id
            });

            if (SoftBannedUser) {
                return member.kick()
            };

            const wChannel = guild.channels.cache.get(MyServer.welcomechannelID); 
            if (!wChannel) return; 

            const welcomeEmbed = new MessageEmbed({
                title: `${member.user.username} has joined the server!`,
                description: `Please welcome ${member.user} to the server.\n**Latest Member Count:** \`${guild.memberCount}\``,
                thumbnail: {
                    url: `${member.user.displayAvatarURL({ dynamic: true })}`
                }, 
                color: "#2f3136"
            }); 

            wChannel.send({ embeds: [welcomeEmbed] });

        } else {
            return
        }

    }
}
