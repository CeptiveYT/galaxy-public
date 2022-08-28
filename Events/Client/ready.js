const {
    Client,
    Presence,
    Message
} = require("discord.js");
const color = require("colors");
const mongoose = require("mongoose");
const cfg = require("../../Storage/Botcfg.json");
const ms = require("ms")

module.exports = {
    name: "ready",
    /**
     * @param {Client} client
     * @param {Message} message
     */
    async execute(message, client, Discord) {
        console.log(color.yellow("[Information]" + color.blue(" Client is online!")))

        setInterval(() => {
            client.user.setActivity({
                name: `${client.users.cache.size} People`,
                type: "WATCHING"
            }); 
        }, 5000);

        client.user.setStatus("dnd");

        mongoose.connect(cfg["msrv-galaxybot"], {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }).then(() => {
            console.log(color.yellow("[Information]") + " " + color.blue("Connected to the Database"));
        });

    }
}