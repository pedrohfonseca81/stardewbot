import IClient from "../../interfaces/client.interface";
import IRunParams from "../../interfaces/command.interface";

class AddPostCommand {
    name: string;
    aliases: string[];
    client: IClient;
    constructor(client: IClient) {
        this.name = "addpost";
        this.aliases = [];

        this.client = client;
    };
    async run({ message, args, db, t }: IRunParams) {
        if (this.client.mainteners.includes(message.author.id)) {
            let server = await db.Guild.findOne({ id: message.guild?.id });

            let code = args.join(" ");
            if (!code) return message.channel.send(t("commands.addpost.argsIsMissing.0", { prefix: server?.prefix }));

            try {
                const json = JSON.parse(code);

                db.WikiPost.findOne({ name: json.name }, (err, doc) => {
                    const Post = new db.WikiPost(json);

                    Post.save();

                    message.channel.send(t("commands.addpost.result"));
                });
            } catch (e) {
                return message.channel.send(t("commands.addpost.invalidBody"));
            };
        };
    };
};

export default AddPostCommand;