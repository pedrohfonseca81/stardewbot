import { MessageEmbed } from "discord.js";
import IClient, { IDatabase as Database } from "../../interfaces/client.interface";
import stringSimilarity from "string-similarity";
import _ from "lodash";
import IRunParams from "../../interfaces/command.interface";

class WikiCommand {
    name: string;
    aliases: string[];
    client: IClient;
    constructor(client) {
        this.name = "wiki";
        this.aliases = [];

        this.client = client;
    }
    async run({ message, args, db, t }: IRunParams) {
        const server = await db.Guild.findOne({ id: message.guild?.id });
        let choices = {
            search(_, textargs: string[]) {
                let text = textargs.slice(1).join(" ");
                if (!text) return message.channel.send(t("commands.wiki.search.argsIsMissing.0", { prefix: server?.prefix }))

                message.channel.send(t("commands.wiki.search.loading")).then((msg) => {
                    db.WikiPost.find({ language: server?.language }, (err, doc) => {
                        let postNames = doc.map(e => e.name);

                        let matches = stringSimilarity.findBestMatch(text.charAt(0).toUpperCase() + text.slice(1), postNames);

                        if (matches.bestMatch.rating * 100 < 35) {
                            return msg.edit(t("commands.wiki.search.invalidSearch"));
                        }

                        let bestMatch = postNames[matches.bestMatchIndex];

                        db.WikiPost.findOne({ name: bestMatch, language: server?.language }, (err, _doc) => {
                            const WikiEmbed = new MessageEmbed();

                            WikiEmbed.setTitle(_doc?.name);
                            if (_doc?.link) {
                                WikiEmbed.setURL(_doc?.link);
                            }
                            for (const field of (_doc as any).content) {
                                WikiEmbed.addField(field.title, field.content.length >= 600 ? `${field.content.slice(0, 600).trim()}... [See more](${_doc?.link})` : field.content);
                            };
                            if (_doc?.thumbnail_image_url) {
                                WikiEmbed.setThumbnail(_doc?.thumbnail_image_url)
                            }
                            if (_doc?.image_url) {
                                WikiEmbed.setImage(_doc?.image_url);
                            }
                            if (_doc?.category) {
                                WikiEmbed.setFooter(_doc.category)
                            }

                            msg.edit(null, WikiEmbed);
                        })
                    })
                })
            },
            list() {
                db.WikiPost.find({ language: server?.language }, (err, doc) => {
                    let postNames = doc.map(e => `\`${e.name}\``);

                    message.channel.send(t("commands.wiki.list.result", { posts: postNames.length >= 50 ? postNames.slice(0, 50).join(", ") + '...' : postNames.join(", ") }))
                });
            },
            category(__, textargs: string[]) {
                db.WikiPost.find({}, (err, doc) => {
                    let category = textargs.slice(1).join(" ");

                    const categories = _.uniq(doc.filter(el => el.language === server?.language).map((el) => el.category));

                    if (!category) return message.channel.send(t("commands.wiki.category.argsIsMissing.0", { prefix: server?.prefix, categories: categories.map((e) => `\`${e}\``).join(", ") }));

                    let matches = stringSimilarity.findBestMatch(category, categories);

                    if (matches.bestMatch.rating * 100 < 35) {
                        return message.channel.send(t("commands.wiki.category.invalidSearch"));
                    }

                    let bestMatch = categories[matches.bestMatchIndex];

                    db.WikiPost.find({ category: bestMatch }, (err, doc) => {
                        const _categories = doc.filter(el => el.language === server?.language).map(el => `\`${el.name}\``);

                        message.channel.send(`**Posts**: ${_categories.join(", ")}`)
                    })
                });
            },
        }

        if (choices[args[0]]) {
            choices[args[0]](this.client, args);
        } else {
            message.channel.send(t("commands.wiki.invalidOption", { options: Object.keys(choices).map(e => `\`${e}\``).join(", ") }))
        }
    }
}

export default WikiCommand;