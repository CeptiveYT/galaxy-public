const { Perms } = require("../Storage/Validation/Permissions");
const { Client } = require("discord.js");
const { promisify } = require("util");
const { glob } = require("glob");
const Ascii = require("ascii-table");
const { Routes } = require("discord-api-types/v9");
const { REST } = require("@discordjs/rest");
const PG = promisify(glob);
const cfg = require("../Storage/Botcfg.json")
require("colors");

/**
 * @param {Client} client
 */
module.exports = async (client) => {
    const Table = new Ascii("Slash Commands Loaded");
    Table.setHeading("Name", "Description", "Status", "Output");

    let SlashCommandsArray = [];
    let command;

    (await PG(`${process.cwd().replace(/\\/g, "/")}/2. Slash Commands/*/*.js`)).map(async (file) => {
        command = require(file);

        if (!command.name)
            return Table.addRow(file.split("/")[7], "", "🔴 Failed", "Missing a name.");

        if (!command.description)
            return Table.addRow(command.name, " ", "🔴 Failed", "Missing a description.");

        if (command.permission) {
            if (Perms.includes(command.permission))
                command.defaultPermission = false;
            else
                return Table.addRow(command.name, command.description, "🔴 Failed", "Permission is invalid.");
        };

        SlashCommandsArray.push(command);
        client.slash.set(command.name, command)

        await Table.addRow(command.name, command.description, "🟢 Loaded!", "All Set");
    })

    client.on("ready", () => {

        const rest = new REST({ version: "9" }).setToken(cfg.TOKEN);

        rest.put(Routes.applicationCommands(cfg.client_id), { body: SlashCommandsArray });

    })

    console.log(Table.toString());
}