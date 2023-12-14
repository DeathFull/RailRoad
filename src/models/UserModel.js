import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  role: { type: String, required: true, enum: ["Admin", "Employee", "User"] },
});

UserSchema.plugin(passportLocalMongoose);

export const UserModel = mongoose.model("User", UserSchema);
