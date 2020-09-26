import { Message } from "discord.js";
import i18next from "i18next";
import IClient, { IDatabase } from "../interfaces/client.interface";
import i18n from "../utils/i18n";

class MessageEvent {
    client: IClient
    constructor(client: IClient) {
        this.client = client;
    }
    async run(message: Message, db: IDatabase) {
        const doc = await db.User.findOne({ id: message.author.id });
        const _doc = await db.Guild.findOne({ id: message.guild?.id });

        i18n.then(async (t) => {
        if (!_doc) {
            const Guild = new db.Guild({
                id: message.guild?.id,
                language: "en",
                prefix: "sc."
            });

            await Guild.save();
            return message.channel.send(t("global.registerGuild"));
        }

        if (message.author.bot) return;

        i18next.changeLanguage(_doc.language);

        if (message.content.match(new RegExp(`<@!?${this.client.user?.id}> ?$`))) {
            return message.reply(t("global.prefixMention", { prefix: _doc.prefix }));
        }

        if (message.content.indexOf(_doc?.prefix as string) !== 0) return;

        const args: any = message.content.slice(_doc?.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

        if (!cmd) return;

        if (!doc) {
            const User = new db.User({
                id: message.author.id,
                gold: 0
            });

            await User.save();
        };

            await cmd.run({ message, args, db: this.client.database, t });
        });
    }
}

export default MessageEvent;