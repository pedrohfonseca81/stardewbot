import IClient from "../../interfaces/client.interface";
import IRunParams from "../../interfaces/command.interface";

class GoldCommand {
    name: string;
    aliases: string[];
    client: IClient
    constructor(client) {
        this.name = "gold";
        this.aliases = ["ouros"];

        this.client = client;
    };
    run({ message, db, t }: IRunParams) {
        db.User.findOne({ id: message.author.id }, (err, doc) => {
            if (doc) {
                message.channel.send(t("commands.gold.result", { gold: doc.gold }));
            };
        });
    };
};

export default GoldCommand;