const Discord = require("discord.js"); 
const colors = require("../Colors/EmbedColors");

const Test_Embed = new Discord.MessageEmbed({
    title: "Test Embed", 
    description: `This is a new test embed!`,
});

const About = new Discord.MessageEmbed({
    title: "About Galaxy", 
    description: "Galaxy is a multi-purpose Discord Bot that has been made to help out servers with anything that they may need. Galaxy comes with many default features that include moderation, utility and economy aspects. You can see all of these commands by using the `help prefix` command. You can run either the prefix command of it or the slash command version.\n\nPlease note that the `help` command is still being worked on!", 
    color: "LUMINOUS_VIVID_PINK",
    timestamp: new Date()
});

const TOS = new Discord.MessageEmbed({
    title: "Terms Of Service", 
    description: "Galaxy is a public discord bot in which its main purpose is to help servers with moderation and utility tasks. As a result Galaxy Bot is open to the public, however, Galaxy must not be used with malicious intent (Mass/Kicking Banning people or any other malicious actions). If a report does come up that Galaxy has been used in this way or breaks one of the terms below, you server will be blacklisted meaning that you will still be able to have the bot in your server but you will not be able to use any of the commands.\nAlso if your server has premium enabled the money you paid for that will not be elegible for refund and the premium status of your server will be terminated.\n\n**__Please make sure you do not break any of these terms__**\n- Do not use Galaxy with malicious intent\n- Do not sell any Galaxy Premium Codes\n\n**__Extra Notice__**\nPlease also read the **Privacy Policy** using the `/privacy` as well so you know how your data is being handled!", 
    color: "LUMINOUS_VIVID_PINK"
});

const Privacy = new Discord.MessageEmbed({
    title: "Privacy Policy", 
    description: "This is the privacy policy for Galaxy Bot and how it deals with your data.", 
    color: "LUMINOUS_VIVID_PINK", 
    fields: [
        {
            name: "__What Data Do we store?__", 
            value: "Galaxy Bot stores the necessary data in which it needs to function. This data may include **Server Names**, **Server IDs**, **User IDs ** and **Usernames**. All of this data is stored on a MongoDB Cloud Database in which the only people that can access it are the developers. While your data is in this database we ensure you that it is not being used other than for bot commands such as `server-info` and any economy commands that requires you to look at your unique `user_id` to get your economy profile. While in this database we also ensure that non of this data will be leaked due to the amount of people that are working on Galaxy Bot."
        },
        {
            name: "__What is your Data used for?__", 
            value: "We use your data to make the multi-server economy system work. The data which we use are the `server id` and your `user id` so you are able to get your economy profile within that server. This data ensures that all of your profiles are not linked to each other, which means that there will be no exploits along the way (able to transfer money from 1 server profile to another). We also may use your data in a blacklist system which means that we can add your server to our **Blacklisted** Server Collection. If the bot is unable to join your server this means that your server has been blacklisted on our system. To determine your server we use your `server id` to check if the `server id` matches ones we have in the database if it does then the bot will remove itself from the server. **Please note: All the data collected is public. (anyone can copy your server or user id with developer tools enabled!)**",
        }, 
        {
            name: "__Discord Stored Data__", 
            value: "Not all of the data we store is put on the database. Some of the data like **`deleted messages`** are stored in a discord channel in a private and confidential server where it is closed off from the rest of the public. This server is runned by the developers of the bot only and this is the server in which we will execute our blacklist command (only if a server needs to be blacklisted).\nOther data like (message edits) will also be stored as well, this will allow us to see any message that has been edited while the bot is in your server, the `user id` of these people will also be stored as well so we can blacklist the user from using bot commands if necessary.",
        }
    ]
});

const embed = {
    TestEmbed: Test_Embed,
    About: About,
    TOS: TOS, 
    Privacy: Privacy
};

module.exports = embed; 