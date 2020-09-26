import IClient from "../../interfaces/client.interface";
import IRunParams from "../../interfaces/command.interface";

class AddPostContentCommand {
    name: string;
    aliases: string[];
    client: IClient;
    constructor(client: IClient) {
        this.name = "addpostcontent";
        this.aliases = [];

        this.client = client;
    }
    async run({message, args, db }: IRunParams) {
        if (this.client.mainteners.includes(message.author.id)) {
            const name = args[0];
            if (!name) return message.channel.send("Correct usage: <prefix>addpostcontent <name> <content>");

            db.WikiPost.findOne({ name }, (err, doc) => {
                if (!doc) return message.channel.send("Invalid post");

                const content = args.slice(1).join(" ");
                if (!content) return message.channel.send("Correct usage: <prefix>addpostcontent <name> <content>");

                try {
                    const json = JSON.parse(content);
                    doc.content.push(json);
                    doc.save();

                    message.channel.send("Success!");
                } catch(e) {
                    return message.channel.send("Invalid body");
                }
            });
        }
    }
}

export default AddPostContentCommand;