const {
    Client,
    Message,
    MessageEmbed
} = require('discord.js');
const guildSchema = require("../../Storage/Schemas/guildSchema");

const fs = require("fs");

module.exports = {
    name: "help",
    cooldown: 0,
    aliases: ["h"],
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

            if (!args[0]) {
                let categories = [];

                fs.readdirSync(`./1. Commands/`).forEach(async (dir) => {
                    const commands = fs.readdirSync(`./1. Commands/${dir}/`).filter(file => file.endsWith(".js"));

                    const cmds = commands.map((command) => {
                        let file = require(`../../1. Commands/${dir}/${command}`);

                        if (!file.name) return 'No command name.';

                        let name = file.name.replace(".js", "")

                        return `\`${name}\``
                    });

                    let data = new Object();

                    data = {
                        name: dir.toUpperCase(),
                        value: cmds.length == 0 ? 'In Progress' : cmds.join(" ")
                    };

                    categories.push(data);
                });

                const help = await new MessageEmbed({
                    title: "Galaxy Commands", 
                    description: `Use the \`${MyServer.prefix}${this.name}\` command with a command name to get the command information.`, 
                    fields: categories, 
                    color: "LUMINOUS_VIVID_PINK"
                })

                return message.channel.send({embeds: [help]})

            } else {
                const command = client.commands.get(args[0].toLowerCase()) || client.commands.find(c => c.aliases && c.aliases.includes(args[0].toLowerCase));
                
                if (!command) {
                    const noCommandEmbed = new MessageEmbed({
                        description: `I cannot find this command. \`${MyServer.prefix}help\` to view all commands`, 
                        color: "RED"
                    }); 
                    return message.channel.send({embeds: [noCommandEmbed]});
                }

                const commandHelpEmbed = new MessageEmbed({
                    title: "Command Information", 
                    color: "LUMINOUS_VIVID_PINK", 
                    fields: [
                        {
                            name: "Prefix", 
                            value: `\`${MyServer.prefix}\``, 
                        }, 
                        {
                            name: "Command", 
                            value: `${command.name ? `\`${command.name}\`` : "No command name."}`
                        }, 
                        {
                            name: "Aliases", 
                            value: `${command.aliases ? `\`${command.aliases}\`` : "No command aliases."}`
                        }, 
                        {
                            name: `Usage`, 
                            value: `${command.usage ? `${MyServer.prefix}${command.usage}`: `${MyServer.prefix}${command.name}`}`,
                        }, 
                        {
                            name: "Description", 
                            value: `${command.description ? command.description : "No description provided."}`
                        }
                    ]
                })
                return message.channel.send({embeds: [commandHelpEmbed]})
            }

        } else {
            return message.channel.send("Please set up Stream Bot first. `/setup`");
        }
    }
}