import mongoose,{Schema,model,models} from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document{
    email:string;
    password:string;
    role:"user" | "admin";
    // name:string;
    createdAt:Date;
    _id:mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>({
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,enum:["user","admin"],default:"user"},
    // name:{type:String,required:true},
    createdAt:{type:Date,default:Date.now}
})

userSchema.pre("save",async function(){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);
    }
});

const User = models?.User || model<IUser>("User",userSchema);
export default User;