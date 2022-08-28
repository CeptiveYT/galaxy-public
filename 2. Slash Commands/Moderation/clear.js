const { Client, MessageEmbed, CommandInteraction, Message } = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "clear",
    description: "Clear a number of messages from a channel.",
    permission: "MANAGE_MESSAGES",
    enabled: true,
    options: [
        {
            name: "amount",
            description: "The amount of messages you want to delete.",
            type: 4,
            required: true
        },
        {
            name: "channel",
            description: "The channel you want messages to be deleted in.",
            type: 7,
            required: false
        }
    ],
    /**
     *
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        let MyServer = await guildSchema.findOne({ serverID: interaction.guild.id });

        if (MyServer) {

            const { options, guild } = interaction;

            let amount = options.getInteger("amount");
            let channel = options.getChannel("channel") || interaction.channel;

            if (amount < 1) return interaction.reply({ content: "You need to delete at least 1 message.", ephemeral: true });
            if (amount > 100) return interaction.reply({ content: "You cannot delete more than 100 messages.", ephemeral: true });

            if (channel.type !== "GUILD_TEXT") return interaction.reply({ content: "Please provide a channel that is text based.", ephemeral: true });

            let chosenChannel = guild.channels.cache.get(channel.id);

            try {

                chosenChannel.bulkDelete(amount);
                await interaction.reply({
                    embeds: [
                        new MessageEmbed({
                            description: `Successfully deleted ${amount} messages from ${chosenChannel}`,
                            color: "GREEN"
                        })
                    ],
                    ephemeral: true
                })
            } catch (err) {
                console.log(err);
                interaction.reply("An error occured. Please check the console.")
            }

        } else {
            return interaction.reply("Please set up Galaxy Bot first. `/setup`");
        }
    }
}
