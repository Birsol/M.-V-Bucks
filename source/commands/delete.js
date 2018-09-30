const Command = require("../handlers/command.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "delete",
            aliases: ["arret", "end"]
        });
    }

    execute(message) {
        if(!message.guildAdmin && !message.globalAdmin) return message.channel.send('Permissions invalides. La permission `MANAGE_SERVER` ou le rôle `MG Admin` est requis.');

        const match = /(?:delete|stop|end)(?:\s+(?:<#)?(\d{17,20})(?:>)?)?(?:\s+(\d+))/i.exec(message.content);

        if (!match) return message.channel.send(`Usage de la commande invalide : \`${this.client.config.prefix}delete [#|nom-du-salon] <nombre-du-giveaway>\``);

        const channel = match[1] ? message.guild.channels.get(match[1]) || message.channel : message.channel;

        if (this.client.giveawayCache.filter(giveaway => giveaway.channel.id === channel.id).size <= 0) return message.channel.send(`Il n'y a pas de giveaway en cours dans le salon **${channel.name}**.`);

        const a = this.client.giveawayCache.get(`${channel.id}-${match[2]}`);

        if(!a) return message.channel.send(`ERREUR: Il n'y a pas de giveaway en cours dans ce salon !`);

        clearInterval(a.interval);

        a.msg.delete();

        this.client.giveawayCache.delete(`${channel.id}-${match[2]}`);

        message.channel.send(`Le giveaway **${match[2]}** a été supprimé`);
    }
};
