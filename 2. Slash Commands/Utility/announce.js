const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const guildSchema = require("../../Storage/Schemas/guildSchema");
const {
    PremiumGuild
} = require("../../Storage/Schemas/premiumSchema")

module.exports = {
    name: "announce",
    description: "⭐ Announce a message to the server by creating an embed!",
    permission: "MANAGE_CHANNELS",
    enabled: true,
    options: [
        {
            name: "title",
            type: 3,
            description: "Enter a title for your embed.",
            required: true
        },
        {
            name: "description",
            type: 3,
            description: "Enter a description for your embed",
            required: true
        },
        {
            name: "color",
            type: 3,
            required: true,
            description: "Select a color for your embed.",
            choices: [
                { name: "Green", value: "GREEN" },
                { name: "Aqua", value: "AQUA" },
                { name: "Pink", value: "LUMINOUS_VIVID_PINK" },
            ]
        },
        {
            name: "add-ping",
            type: 3,
            description: "Select a ping you would like to add",
            choices: [
                { name: "@everyone", value: "@everyone" },
                { name: "@here", value: "@here" },
            ]
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = await guildSchema.findOne({
            serverID: interaction.guild.id
        });

        const {
            options,
            guild,
            member,
            channel,
        } = interaction;

        const premium = await PremiumGuild.findOne({
            ServerID: guild.id
        });
        if (!premium) return interaction.reply({
            embeds: [
                new MessageEmbed({
                    author: { name: "This command is limited to premium guilds only." },
                    description: "Buy Galaxy Premium Here - [Buy Premium](https://discord.com/channels/990391641930100756/1009213365782065222)"
                })
            ]
        })

        if (MyServer) {

            const title = options.getString("title");
            const description = options.getString("description");
            const color = options.getString("color");
            const ping = options.getString("add-ping");

            const embed = new MessageEmbed({
                title: `${title}`,
                description: `${description}`,
                color: `${color}`,
                footer: `Sent by: ${member.user.tag}`
            });

            interaction.reply({ content: "Announcement has been sent!" }).then(() => {
                setTimeout(() => {
                    interaction.deleteReply();
                }, 5000);
            })
            channel.send({ content: `${ping}`, embeds: [embed] });

        } else {
            return interaction.reply("Please set up galaxy bot first. `/setup`");
        }
    }
}
