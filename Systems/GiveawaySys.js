const giveawayModel = require("../Storage/Schemas/giveawaysSchema");
const {
    GiveawaysManager
} = require('discord-giveaways');

module.exports = (client) => {
    const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
        async getAllGiveaways() {
            return await giveawayModel.find().lean().exec();
        }

        async saveGiveaway(messageId, giveawayData) {
            await giveawayModel.create(giveawayData);
            return true;
        }

        async editGiveaway(messageId, giveawayData) {
            await giveawayModel.updateOne({
                messageId
            }, giveawayData).exec();

            return true;
        }

        async deleteGiveaway(messageId) {
            await giveawayModel.deleteOne({
                messageId
            }).exec();
            return true;
        }
    };

    // Create a new instance of your new class
    const manager = new GiveawayManagerWithOwnDatabase(client, {
        default: {
            botsCanWin: false,
            embedColor: '#FF0000',
            embedColorEnd: '#000000',
            reaction: '🎉'
        }
    });

    client.giveawaysManager = manager;
}