const Command = require("../handlers/command.js");
const Giveaway = require("../handlers/giveaway.js");

module.exports = class extends Command {
    constructor(client, filePath) {
        super(client, filePath, {
            name: "create",
            aliases: ["start", "creer"]
        });
    }

    async execute(message) {
        if (!message.channel.permissionsFor(message.guild.me).has(['EMBED_LINKS', 'ADD_REACTIONS'])) return message.channel.send('Permissions invalides. Pour faire simple, les permissions `EMBED_LINKS` et `ADD_REACTIONS` sont requises.');
        if (!message.guildAdmin && !message.globalAdmin) return message.channel.send('Invalid Permissions. `MANAGE_SERVER` permission or `MG Admin` role required.');

        const match = /(?:start|begin|create)(?:\s+<?#?(\d{17,20})>?)?(?:\s+-w\s+(\d+))?\s+(?:(\d+)|(?:(\d+)\s*d(?:ays)?)?\s*(?:(\d+)\s*h(?:ours|rs|r)?)?\s*(?:(\d+)\s*m(?:inutes|in)?)?\s*(?:(\d+)\s*s(?:econds|ec)?)?)\s+(.+)/i.exec(message.content);
        if (!match) return message.channel.send(`Usage de la commande invalide : \`${this.client.config.prefix}create [#|nom-du-salon][\'-w <nombre de gagnants>\'] <#d#h#m#s|temps-en-secondes> <titre-du-giveaway>\``);

        const channel = message.guild.channels.get(match[1]) || message.channel;

        //if (this.client.giveawayCache.has(channel.id)) return message.channel.send(`There is already a giveaway in ${channel.name}.`);

        //const filtered = [];

        const filtered = this.client.giveawayCache.filter(giveaway => giveaway.channel.id === (match[1] ? match[1] : message.channel.id)).size;

        if (filtered >= 5) return message.channel.send(`ERREUR: Vous devez au maximum avoir 5 giveaways sur les salons`);

        /*Object.keys(this.client.giveawayCache).forEach(key => key.includes(match[1] ? message.guild.channels.get(match[1]) : message.channel.id) ? filtered.push(key) : null);

        if(filtered.length > 5) return message.channel.send(`ERR: You may only have a maximum of 5 giveaways per channel.`);*/

        if (message.deletable) message.delete({ timeout: 1000, reason: "M. V-Bucks" });

        new Giveaway(this.client, message, match);
    }
};
