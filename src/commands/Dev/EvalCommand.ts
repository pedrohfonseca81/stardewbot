import { MessageEmbed } from "discord.js";
import IClient from "../../interfaces/client.interface";
import IRunParams from "../../interfaces/command.interface";

class EvalCommand {
    name: string;
    aliases: string[];
    client: IClient;
    constructor(client: IClient) {
        this.name = "eval";
        this.aliases = [];

        this.client = client;
    }
    run({ message, args }: IRunParams) {
        
        if (this.client.mainteners.includes(message.author.id)) {
            let code = args.join(" ");

            if (code.match(/```(.*)```/gs)) {
                code = code.trim().replace(/```js/gs, "").replace(/```/gs, "");
            }

            if (code) {
                const embed = new MessageEmbed();

                try {
                    let debugedCode = eval(code);

                    if (debugedCode.toString().match(new RegExp(process.env.DISCORD_TOKEN as string, "gs"))) {
                        debugedCode = debugedCode.replace(new RegExp(process.env.DISCORD_TOKEN as string, "gs"), "IDIOT");
                    }

                    embed.setTitle("Eval");
                    embed.addField("Input", `\`\`\`js\n${code}\`\`\``);
                    embed.addField("Output", `\`\`\`js\n${debugedCode}\`\`\``);

                    message.channel.send(embed);
                } catch (err) {
                    message.channel.send(`Error: \`${err}\``)
                }
            }
        } else {
            message.channel.send("No permission");
        }
    }
}

export default EvalCommand;