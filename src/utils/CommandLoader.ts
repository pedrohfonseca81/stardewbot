import glob from "glob";
import IClient from "../interfaces/client.interface";

class CommandLoader {
    client: IClient
    constructor(client: IClient) {
        this.client = client;
    }
    load() {
        glob("src/commands/**/*.ts", {}, (err, files) => {
            for (const file of files) {
                import(`../../${file}`)
                    .then(command => {
                        const props = new command.default(this.client);

                        console.log(`${props.name} loaded.`);

                        this.client.commands.set(props.name, props);
                        props.aliases.forEach((alias: string) => {
                            this.client.aliases.set(alias, props.name);
                        });
                    });
            };
        });
    }
};

export default CommandLoader;