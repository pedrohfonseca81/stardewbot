import { connect } from "mongoose"

export default {
    connect() {
        return connect(process.env.MONGO_URI as string, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
}