const { readdirSync } = require("fs"); 

module.exports = (client, Discord) => {
    const commandFolders = readdirSync(`./1. Commands`);
    for (const folder of commandFolders) {
        const commandFiles = readdirSync(`./1. Commands/${folder}`).filter(file => file.endsWith(".js")); 
        for (const file of commandFiles) {
            const command = require(`../1. Commands/${folder}/${file}`); 
            client.commands.set(command.name, command); 
        }
    }
}