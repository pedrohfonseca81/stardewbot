import { Client, Collection } from "discord.js";
import database from "./database";
import Guild from "./database/models/Guild";
import User from "./database/models/User";
import WikiPost from "./database/models/WikiPost";
import IClient, { IDatabase, ISettings } from "./interfaces/client.interface";
import CommandLoader from "./utils/CommandLoader";
import EventLoader from "./utils/EventLoader";

class StardewBot extends Client implements IClient {
    commands: Collection<string, any>;
    aliases: Collection<string, any>;
    settings: ISettings;
    mainteners: string[]
    database: IDatabase;
    constructor() {
        super();

        this.database = {
            User,
            WikiPost,
            Guild
        };

        this.commands = new Collection();
        this.aliases = new Collection();
        this.settings = {
            prefix: "sb."
        };
        this.mainteners = ["656905831215923200", "753966649215811674"];
    }
    startUp() {
        database.connect();
        this.login(process.env.DISCORD_TOKEN);

        new EventLoader(this).load();
        new CommandLoader(this).load();
    }
};

export default StardewBot;