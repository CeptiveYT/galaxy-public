const { Client, Message, MessageEmbed } = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

module.exports = {
    name: "clear",
    cooldown: 0,
    permissions: "MANAGE_MESSAGES",
    aliases: ["purge"],
    enabled: true,
    /**
     * @param {Message} message
     * @param {Client} client
     */
    async execute(message, args, commandName, client, Discord) {
        let MyServer = await guildSchema.findOne({ serverID: message.guild.id });

        if (MyServer) {

            let amount = args[0];
            if (isNaN(amount)) return message.reply("Please enter a number!");
            if (amount > 100) return message.reply("Please enter a number that is not more than 100.");
            if (amount < 1) return message.reply("Please enter a number more than 0.");

            const embed = new MessageEmbed({
                description: `Successfully deleted ${amount} messages.`,
                color: "GREEN"
            });

            message.channel.bulkDelete(amount);

            await message.channel.send({ embeds: [embed] })
                .then((sent) => {
                    setTimeout(() => {
                        sent.delete()
                    }, 2500);
                })


        } else {
            return message.channel.send("Please set up Galaxy Bot first. `/setup`");
        }
    }
}
