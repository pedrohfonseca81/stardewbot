import { toASCII } from "punycode";
import IClient from "../interfaces/client.interface";

class Ready {
    client: IClient
    constructor(client: IClient) {
        this.client = client;
    }
    async run() {
        toASCII
        console.log("Bot successfully connected.");
    }
}

export default Ready;