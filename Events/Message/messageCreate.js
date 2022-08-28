const {
    output,
    date
} = require("better-output");
const {
    Client,
    Message,
    MessageEmbed,
    Collection,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const cfg = require("../../Storage/Botcfg.json");
const ms = require("ms")
const color = require("colors");

const guildSchema = require("../../Storage/Schemas/guildSchema");
const {
    Blacklist
} = require("../../Storage/Schemas/GuildBlacklistSchema");
const {
    PremiumGuild
} = require("../../Storage/Schemas/premiumSchema");

module.exports = {
    name: "messageCreate",
    /**
     * @param {Message} message 
     * @param {Client} client 
     */
    async execute(message, client, Discord) {

        let server = await guildSchema.findOne({
            serverID: message.guildId
        });
        let prefix;

        if (server) {
            prefix = server.prefix;
        } else {
            prefix = cfg.PREFIX;
        }

        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) ||
            client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;

        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                const NoPerms = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`You do not have permissions to use this command.\n**Missing Permission:** \`${command.permissions}\``);
                return message.reply({
                        embeds: [NoPerms]
                    })
                    .then((sent) => {
                        setTimeout(() => {
                            sent.delete();
                        }, 7500);
                    })
            }
        }

        const {
            cooldowns
        } = client;

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 1) * 1000

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;

                const timeLeftEmbed = new MessageEmbed()
                    .setColor("RED")
                    .setDescription(`Please wait another ${ms(timeLeft.toFixed(1))} seconds before using this command again.`)

                return message.reply({
                        embeds: [timeLeftEmbed]
                    })
                    .then((sent) => {
                        setTimeout(() => {
                            sent.delete()
                        }, 7500);
                    });
            };
        };

        timestamps.set(message.author.id, now);
        setTimeout(() => {
            timestamps.delete(message.author.id)
        }, cooldownAmount);

        try {
            const row = new MessageActionRow();
            row.addComponents(
                new MessageButton({
                    customId: "bl_guild",
                    label: "Contact us",
                    style: "PRIMARY",
                    emoji: "📝"
                })
            )

            const blacklisted = await Blacklist.findOne({
                Guild_ID: message.guild.id,
            });

            if (blacklisted) return message.channel.send({
                embeds: [new MessageEmbed({
                    color: "RED",
                    description: "⛔ This server has been blacklisted from using any commands. If you feel this is a mistake please press the button below and someone will get back to you."
                })],
                components: [row]
            })

            if (!command.enabled || command.enabled === false)
                return message.channel.send("This command has been disabled my the developers.");

            const Premium = await PremiumGuild.findOne({
                ServerID: message.guild.id
            });

            if (command.premium || command.premium === true) {
                if (!Premium) return message.reply({
                    content: "This command has been limited to premium servers only.",
                    ephemeral: true
                })
            }

            await command.execute(message, args, commandName, client, Discord);
            console.log(`[Prefix Command - ${date.now()}]`.green + " " + `Executed /${command.name} in "${message.guild.name}"`.white);
        } catch (err) {
            return output.error(err)
        }

    }
}