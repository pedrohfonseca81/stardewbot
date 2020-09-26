import { Message } from "discord.js";
import { IDatabase } from "./client.interface";

interface IRunParams {
    message: Message;
    args: string[];
    db: IDatabase;
    t: any;
}

export default IRunParams;