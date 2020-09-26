import { Guild as IGuild } from "discord.js";
import IClient, { IDatabase } from "../interfaces/client.interface";

class GuildCreate {
    client: IClient
    constructor(client: IClient) {
        this.client = client;
    }
    async run(guild: IGuild, db: IDatabase) {
        db.Guild.findOne({ id: guild.id }, (err, doc) => {
            if(!doc) {
                const Guild = new db.Guild({
                    id: guild.id,
                    language: "en",
                    prefix: "sb."
                });

                Guild.save();
            }
        })
    }
}

export default GuildCreate;