import { model, Document, Schema } from "mongoose";
import IUser from "../../interfaces/user.interface";

type IUserSchema = Document & IUser;

const UserSchema = new Schema({
    id: {
        type: String
    },
    gold: {
        type: Number,
        default: 0
    },
    inventory: {
        type: Map,
    }
});

const User = model<IUserSchema>("users", UserSchema);

export default User;