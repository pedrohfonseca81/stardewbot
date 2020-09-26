import { Client, Collection } from "discord.js";
import { Document, Model } from "mongoose";
import Guild from "./guild.interface";
import User from "./user.interface";
import WikiPost from "./wiki_post.interface";

/**
 * Database
*/

type IUser = Document & User;
type IWikiPost = Document & WikiPost;
type IGuild = Document & Guild;

interface IDatabase {
    User: Model<IUser>;
    WikiPost: Model<IWikiPost>;
    Guild: Model<IGuild>;
};

/**
 * Settings
 */

interface ISettings {
    prefix: string;
};

/** 
 * Client
 */

interface IClient extends Client {
    database: IDatabase;
    mainteners: string[];
    settings: ISettings;
    commands: Collection<string, any>;
    aliases: Collection<string, any>;
};

export { IDatabase, ISettings };
export default IClient;