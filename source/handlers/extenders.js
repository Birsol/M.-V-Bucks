const { MessageEmbed, TextChannel, DMChannel } = require("discord.js");

MessageEmbed.prototype.send = function() {
    if (!this.sendToChannel || !(this.sendToChannel instanceof TextChannel || this.sendToChannel instanceof DMChannel)) return Promise.reject("Embed n'a pas été créé dans le salon");
    return this.sendToChannel.send("", { embed: this });
};

TextChannel.prototype.buildEmbed = DMChannel.prototype.buildEmbed = function() {
    return Object.defineProperty(new MessageEmbed(), "sendToChannel", { value: this });
};
