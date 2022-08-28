const { Client, Message, MessageEmbed } = require("discord.js");
const guildSchema = require("../../Storage/Schemas/guildSchema");
const moment = require("moment");
const { createTranscript } = require("discord-html-transcripts");
const { generate } = require("better-output");

module.exports = {
    name: "channel",
    cooldown: 10,
    aliases: ["ch"],
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

            let option = args[0];
            if (!option) {
                return message.channel.send({
                    embeds: [
                        new MessageEmbed({
                            title: "Channel Command",
                            description: "Here are the different type of options you can use for the `channel` command.",
                            color: "LUMINOUS_VIVID_PINK",
                            fields: [
                                {
                                    name: "__Public Options__",
                                    value: `**info:** \`${MyServer.prefix}channel info\` \n**getid:** \`${MyServer.prefix}channel getid\``,
                                    inline: false
                                },
                                {
                                    name: "__Non-Public Options__",
                                    value: `**archive:** \`${MyServer.prefix}channel archive\` \n**create:** \`${MyServer.prefix}channel create [name] [text | voice]\` \n**delete:** \`${MyServer.prefix}channel delete [#channnel-name]\``,
                                    inline: false
                                }
                            ]
                        })
                    ]
                })
            };

            switch (option) {
                case "info": {
                    let channel = message.guild.channels.cache.get(message.channel.id);

                    message.channel.send({
                        embeds: [
                            new MessageEmbed({
                                title: `${channel.name} | Channel Information`,
                                color: "LUMINOUS_VIVID_PINK",
                                description: `${channel.topic || "No Topic Set"}`,
                                fields: [
                                    {
                                        name: "__General__",
                                        value: `**Channel Name:** ${channel.name}\n**Channel ID:** ${channel.id}\n**Channel Type:** ${channel.type.replace("GUILD_", " ")} \n**Category:** ${channel.parent || "No Category"}}`,
                                        inline: true
                                    },
                                    {
                                        name: "__Channel Settings__",
                                        value: `**Viewable:** ${channel.viewable} \n**NSFW:** ${channel.nsfw}`,
                                        inline: true
                                    }
                                ]
                            })
                        ]
                    })
                }
                    break;
                case "getid": {
                    let channel = message.guild.channels.cache.get(message.channel.id);
                    message.channel.send(`**Channel Name: \`${channel.name}\` | ID: \`${channel.id}\`**`)
                }
                    break; 
                case "archive": {
                    if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.channel.send({
                        embeds: [
                            new MessageEmbed({
                                color: "RED", 
                                description: `You are missing some permissions to use this command.\n**Missing Permission:** \`MANAGE_CHANNELS\``,
                            })
                        ]
                    }); 

                    let archiveid = `${generate.ranString(10)}`;

                    const transcript = await createTranscript(message.channel, {
                        limit: 0, 
                        fileName: `${message.channel.name} - ${archiveid}.html`,
                        returnBuffer: false
                    })
                    

                    let ArchiveChannel = await message.guild.channels.cache.get(MyServer.ChannelArchivesID); 
                    if (!ArchiveChannel) {

                        return message.channel.send({embeds: [new MessageEmbed().setAuthor({name: "Creating Channel Archives..."}).setColor("ORANGE")] }).then(async (msg) => {
                            const everyone = message.guild.roles.cache.find((r) => r.name == "@everyone")

                            let NewChannel = await message.guild.channels.create("channel-archives", {
                                permissionOverwrites: [
                                    {
                                        id: everyone.id, 
                                        deny: ["SEND_MESSAGES"], 
                                        allow: ["VIEW_CHANNEL"]
                                    }
                                ]
                            })
    
                            await MyServer.updateOne({ChannelArchivesID: NewChannel.id}).then(async () => {
                                msg.edit({
                                    embeds: [
                                        new MessageEmbed({
                                            author: {
                                                name: "Created \"channel-archives\" channel!"
                                            }, 
                                            color: "GREEN"
                                        })
                                    ]
                                }).then((m) => {
                                    setTimeout(() => {
                                        m.delete(); 
                                    }, 5000);
                                })
                            });

                            let response = await message.channel.send({embeds: [
                                new MessageEmbed({
                                    author: {
                                        name: "Creating Archive...",
                                        color: "ORANGE"
                                    }
                                })
                            ]}).then(async (msg) => {
                                let archivedMessage = await NewChannel.send({
                                    embeds: [
                                        new MessageEmbed({
                                            title: `${message.channel.name} | Archive`, 
                                            color: "LUMINOUS_VIVID_PINK", 
                                            description: `This is the archive for ${message.channel.name}`,
                                            fields: [
                                                {
                                                    name: "Channel Archived",
                                                    value: `${message.channel}`, 
                                                    inline: true
                                                }, 
                                                {
                                                    name: "Date Archived",
                                                    value: `\`\`\`fix\n${moment(Date.now()).format("MMMM Do YYYY")}\`\`\``,
                                                    inline: true
                                                },
                                                {
                                                    name: "Archive ID", 
                                                    value: `\`\`\`${archiveid}\`\`\`` 
                                                }
                                            ]
                                        })
                                    ]
                                });
                                await NewChannel.send({files: [transcript]});

                                await msg.edit({embeds: [
                                    new MessageEmbed({
                                        color: "GREEN", 
                                        title: `${message.channel.name} | Archived`,
                                        description: `${message.channel} has been archived.`,
                                        fields: [
                                            {
                                                name: "Archive", 
                                                value: `[Click here](${archivedMessage.url})`,
                                                inline: true
                                            }
                                        ]
                                    })
                                ]})
                            })
                        })
                    } else {
                        const NewChannelID = await MyServer.ChannelArchivesID;
                        const newchannel = message.guild.channels.cache.get(NewChannelID);
                        
                        return message.channel.send({
                            embeds: [
                                new MessageEmbed({
                                    title: "Creating Archive...",
                                    color: "ORANGE"
                                })
                            ]
                        }).then(async (msg) => {
                            let sent = await newchannel.send({
                                embeds: [
                                    new MessageEmbed({
                                        title: `${message.channel.name} | Archive`, 
                                        color: "LUMINOUS_VIVID_PINK", 
                                        description: `This is the archive for ${message.channel.name}`,
                                        fields: [
                                            {
                                                name: "Channel Archived",
                                                value: `${message.channel}`, 
                                                inline: true
                                            }, 
                                            {
                                                name: "Date Archived",
                                                value: `\`\`\`fix\n${moment(Date.now()).format("MMMM Do YYYY")}\`\`\``,
                                                inline: true
                                            },
                                            {
                                                name: "Archive ID", 
                                                value: `\`\`\`${archiveid}\`\`\`` 
                                            }
                                        ]
                                    })
                                ]
                            })
                            await newchannel.send({files: [transcript]})

                            await msg.edit({
                                embeds: [
                                    new MessageEmbed({
                                        color: "GREEN", 
                                        title: `${message.channel.name} | Archived`,
                                        description: `${message.channel} has been archived.`,
                                        fields: [
                                            {
                                                name: "Archive", 
                                                value: `[Click here](${sent.url})`
                                            }
                                        ]
                                    })
                                ]
                            })
                        })
                    }
                
                }
                break;
            }

        } else {
            return message.reply("Please set up galaxy bot first. `/setup`");
        }
    }
}
