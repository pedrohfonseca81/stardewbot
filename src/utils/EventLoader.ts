import fs from "fs";
import IClient from "../interfaces/client.interface";

class EventLoader {
    client: IClient
    constructor(client: IClient) {
        this.client = client;
    }
    load() {
        fs.readdir(`${process.cwd()}/src/events`, (err, files) => {
            for (const file of files) {
                import(`${process.cwd()}/src/events/${file}`)
                    .then(event => {
                        this.client.on(file.replace(/\.ts?$/, ""),
                            (...args) => new event.default(this.client).run(...args, this.client.database));
                    });
            }
        })
    }
};

export default EventLoader;