import { MessageEmbed } from "discord.js";
import IClient from "../../interfaces/client.interface";
import IRunParams from "../../interfaces/command.interface";

class HelpCommand {
    name: string;
    aliases: string[];
    client: IClient;
    constructor(client) {
        this.name = "help";

        this.aliases = ["h", "commands", "cmds", "ajuda"]

        this.client = client;
    };
    async run({ message, db, t }: IRunParams) {
        const guild = await db.Guild.findOne({ id: message.guild?.id });
        const embed = new MessageEmbed();

        embed.setTitle(t("commands.help.sessions.index.title"));
        embed.addField(t("commands.help.sessions.index.fields.0.title"), `⚙️ **${t("commands.help.sessions.index.fields.0.fields.general")}**\n<:gold:757654598096781343> **${t("commands.help.sessions.index.fields.0.fields.economy")}**`, true);
        embed.addField("Links", "<:github:757655796426473492>[Github](https://github.com)", true);

        message.channel.send(embed).then(msg => {
            msg.react("🏠");
            msg.react("⚙️");
            msg.react("757654598096781343");

            const indexReaction = (reaction, user) => {
                return reaction.emoji.name === '🏠' && user.id === message.author.id;
            };

            const generalReaction = (reaction, user) => {
                return reaction.emoji.name === '⚙️' && user.id === message.author.id;
            };

            const economyReaction = (reaction, user) => {
                return reaction.emoji.id === '757654598096781343' && user.id === message.author.id;
            };

            const indexCollector = msg.createReactionCollector(indexReaction, { time: 2 * 60000 });
            const generalCollector = msg.createReactionCollector(generalReaction, { time: 2 * 60000 });
            const economyCollector = msg.createReactionCollector(economyReaction, { time: 2 * 60000 });

            indexCollector.on("collect", (reaction, user) => {
                msg.edit(embed);
            });

            generalCollector.on('collect', (reaction, user) => {
                const generalEmbed = new MessageEmbed();

                generalEmbed.setTitle(t("commands.help.sessions.general.title"));
                generalEmbed.addField(t("commands.help.sessions.general.fields.0.title", { prefix: guild?.prefix }), t("commands.help.sessions.general.fields.0.content", { prefix: guild?.prefix }))
                generalEmbed.addField(t("commands.help.sessions.general.fields.1.title", { prefix: guild?.prefix }), t("commands.help.sessions.general.fields.1.content", { prefix: guild?.prefix }))
                generalEmbed.addField(t("commands.help.sessions.general.fields.2.title", { prefix: guild?.prefix }), t("commands.help.sessions.general.fields.2.content", { prefix: guild?.prefix }));

                msg.edit(generalEmbed);
            });

            economyCollector.on("collect", (reaction, user) => {
                const economyEmbed = new MessageEmbed();

                economyEmbed.setTitle(t("commands.help.sessions.economy.title"));
                economyEmbed.addField(t("commands.help.sessions.economy.fields.0.title", { prefix: guild?.prefix }), t("commands.help.sessions.economy.fields.0.content", { prefix: guild?.prefix }));

                msg.edit(economyEmbed);
            });
        });
    };
};

export default HelpCommand;