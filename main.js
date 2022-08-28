const {
    output,
    generate
} = require("better-output");
const {
    set
} = require("ceptive");
const Discord = require("discord.js");
const {
    Collection,
    Client,
    MessageEmbed
} = require("discord.js");
require("module-alias/register");
const client = new Client({
    intents: 32767,
    partials: [
        "CHANNEL",
        "GUILD_MEMBER",
        "GUILD_SCHEDULED_EVENT",
        "MESSAGE",
        "REACTION",
        "USER"
    ]
});

const cfg = require("./Storage/Botcfg.json");

// commands
client.commands = new Collection();
client.cooldowns = new Collection();
client.slash = new Collection();
client.buttons = new Collection();

const { promisify } = require("util");
const Ascii = require("ascii-table");
const { glob } = require("glob");
const PG = promisify(glob);

require("./Handlers/Buttons")(client, PG, Ascii);

['Events', 'Commands', 'SlashCommands'].forEach(file => {
    require(`./Handlers/${file}`)(client, Discord)
})

require("./Systems/GiveawaySys")(client);

const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { YtDlpPlugin } = require("@distube/yt-dlp")

client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin],
    youtubeDL: false,
});

module.exports = { client };

const status = queue =>
    `Volume: \`${queue.volume}%\` | Loop: \`${queue.repeatMode ? (queue.repeatMode === 2 ? 'All Queue' : 'This Song') : 'Off'
    }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
    .on('playSong', (queue, song) =>
        queue.textChannel.send({
            embeds: [
                new MessageEmbed({
                    color: "LUMINOUS_VIVID_PINK",
                    description: `🎶 Now Playing \`${song.name}\`\nLength: \`${song.formattedDuration}\`\nRequested by: ${song.user}`
                })
            ]
        })
    )
    .on('addSong', (queue, song) =>
        queue.textChannel.send({
            embeds: [new MessageEmbed({
                color: "LUMINOUS_VIVID_PINK",
                description: `🎶 Added \`${song.name}\` to the queue.\nLength: \`${song.formattedDuration}\`\nRequested by: ${song.user}`
            })]
        })
    )
    .on('addList', (queue, playlist) =>
        queue.textChannel.send(
            ` | Added \`${playlist.name}\` playlist (${playlist.songs.length
            } songs) to queue\n${status(queue)}`
        )
    )
    .on('error', (channel, e) => {
        if (channel) channel.send({
            embeds: [
                new MessageEmbed({
                    description: "An error has occured!",
                    color: "LUMINOUS_VIVID_PINK",
                    fields: [{ name: "Error", value: `\`\`\`${e.toString().slice(0, 1974)}\`\`\`` }]
                })
            ]
        })
        else console.error(e)
    })
    .on('empty', queue => queue.textChannel.send({
        embeds: [
            new MessageEmbed({
                description: "Voice channel is empty, I am leaving the channel.", color: "LUMINOUS_VIVID_PINK"
            })
        ]
    }))
    .on('searchNoResult', (message, query) =>
        message.channel.send(` | No result found for \`${query}\`!`)
    )
    .on('finish', queue => queue.textChannel.send({
        embeds: [
            new MessageEmbed({
                description: "Queue has been finished.",
                color: "LUMINOUS_VIVID_PINK"
            })
        ]
    }));


client.login(cfg.TOKEN);
const {
    CryptoPrices,
} = require("./Storage/Schemas/Economy/Economy");
(async () => {

    const CryptoSettings = require("./Storage/Economy/CryptoPrices.json");

    let prices = await CryptoPrices.findOne({
        id: "1"
    });

    if (!prices) return;

    let time = CryptoSettings.timeout * 60000;

    await setInterval(async () => {
        let bitcoin_Price = generate.ranInt(CryptoSettings.bitcoin.min, CryptoSettings.bitcoin.max);
        await prices.updateOne({
            $set: {
                "prices.bitcoin": bitcoin_Price
            }
        })
    }, time);

    await setInterval(async () => {
        let etherium_Price = generate.ranInt(CryptoSettings.etherium.min, CryptoSettings.etherium.max);
        await prices.updateOne({
            $set: {
                "prices.etherium": etherium_Price
            }
        })
    }, time);

    await setInterval(async () => {
        let tether_Price = generate.ranInt(CryptoSettings.tether.min, CryptoSettings.tether.max);
        await prices.updateOne({
            $set: {
                "prices.tether": tether_Price
            }
        })
    }, time);

    await setInterval(async () => {
        let cadarno_Price = generate.ranInt(CryptoSettings.cadarno.min, CryptoSettings.cadarno.max);
        await prices.updateOne({
            $set: {
                "prices.cadarno": cadarno_Price
            }
        })
    }, time);

    await setInterval(async () => {
        let doge_Price = generate.ranInt(CryptoSettings.doge.min, CryptoSettings.doge.max);
        await prices.updateOne({
            $set: {
                "prices.doge": doge_Price
            }
        })
    }, time);

    await setInterval(async () => {
        let stream_Price = generate.ranInt(CryptoSettings.stream.min, CryptoSettings.stream.max);
        await prices.updateOne({
            $set: {
                "prices.stream": stream_Price
            }
        })
    }, time);

    await setInterval(async () => {
        let shiba_Price = generate.ranInt(CryptoSettings.shiba.min, CryptoSettings.shiba.max);
        await prices.updateOne({
            $set: {
                "prices.shiba": shiba_Price
            }
        })
    }, time);

    await setInterval(async () => {
        let litecoin_Price = generate.ranInt(CryptoSettings.litecoin.min, CryptoSettings.litecoin.max);
        await prices.updateOne({
            $set: {
                "prices.litecoin": litecoin_Price
            }
        })
    }, time);

})()