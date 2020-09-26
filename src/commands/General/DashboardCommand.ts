import { MessageEmbed } from "discord.js";
import i18next from "i18next";
import IClient from "../../interfaces/client.interface";
import IRunParams from "../../interfaces/command.interface";

class DashboardCommand {
    name: string;
    aliases: string[];
    client: IClient;
    constructor(client) {

        this.name = "dashboard";
        this.aliases = ["settings", "config", "painel"];

        this.client = client;
    }
    run({ message, args, db, t }: IRunParams) {
        if (!message.member?.hasPermission("MANAGE_GUILD")) return message.channel.send(t("global.no_permission"));

        db.Guild.findOne({ id: message.guild?.id }, (err, doc) => {
            if (doc) {
                let arg = args[0];
                let arg1 = args[1];
                let arg2 = args[2];

                if (arg === "set") {
                    if (!arg1 || !arg2) return message.channel.send(t("commands.dashboard.argsIsMissing.0", { prefix: doc.prefix }));
                    switch (arg1.toLowerCase()) {
                        case "language":
                            if (!["pt", "en"].includes(arg2.toLowerCase())) return message.channel.send("Invalid language.");

                            doc.language = arg2;
                            doc.save();
                            i18next.changeLanguage(arg2);
                            message.channel.send(t("commands.dashboard.result"));
                            break;
                        case "prefix":
                            if (arg2.length > 5) return message.channel.send(t("commands.dashboard.invalidPassword"))

                            doc.prefix = arg2;
                            doc.save();
                            message.channel.send(t("commands.dashboard.result"));
                            break;
                        default:
                            message.channel.send(t("commands.dashboard.argsIsMissing.0", { prefix: doc.prefix }));
                            break;
                    }
                }

                if (!arg) {
                    const embed = new MessageEmbed();

                    embed.setTitle(t("commands.dashboard.settings.title", { guild_name: message.guild?.name }));
                    embed.addField(t("commands.dashboard.settings.prefix"), `${doc.prefix}`);
                    embed.addField(t("commands.dashboard.settings.language"), doc.language.toUpperCase());

                    message.channel.send(embed);
                }
            };
        });
    }
};

export default DashboardCommand;