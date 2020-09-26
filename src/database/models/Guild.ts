import { model, Document, Schema } from "mongoose";
import IGuild from "../../interfaces/guild.interface";

type IGuildSchema = Document & IGuild;

const GuildSchema = new Schema({
    id: {
        type: String
    },
    prefix: {
        type: String,
    },
    language: {
        type: String,
    }
});

const Guild = model<IGuildSchema>("guilds", GuildSchema);

export default Guild