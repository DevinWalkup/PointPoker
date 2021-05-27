import {ChangeUserRoleProps, CreateUserProps, JoinGameUserProps, RoleType, User} from "../Types/UserTypes";
import {Logger} from "../logger/logger";

const mongoose = require("mongoose");
const {v4: uuidv4} = require('uuid');

const User = mongoose.model("users");

export class UserService {
    private logger: Logger

    constructor() {
        this.logger = new Logger();
    }

    public async CreateAdminUser(data: CreateUserProps) : Promise<User> {
        let user = await User.findOne({
            name: data.name
        })

        if (user) {
            return user;
        }

        let userObj = new User({
            userId: uuidv4(),
            name: data.name,
            roleType: data.roleType
        })

        return await this.CreateUser(userObj)
    }

    public async CreateJoinUser(data: JoinGameUserProps) : Promise<User> {
        this.logger.info("Attempting to create the joining user");

        let user = await User.findOne({
            name: data.name
        })

        if (user) {
            return user;
        }

        let userObj = new User({
            userId: uuidv4(),
            name: data.name,
            roleType: RoleType.USER
        })

        return await this.CreateUser(userObj)
    }

    private async CreateUser(user: any) : Promise<User> {
        this.logger.info("Attempting to create user");
       user.save().catch((err: any) => {
            this.logger.error(err);
            throw new Error("Error creating new user")
        });

       return user;
    }

    public async GetUser(userId : String ) : Promise<User> {
        return User.findOne({userId: userId});
    }

    public async DeleteUser(userId: String): Promise<boolean> {
        let user = await User.findOne({userId: userId});

        if (user) {
            return !!User.deleteOne(user)
        }

        return true;
    }

    public async UpdateUserRole(data: ChangeUserRoleProps) : Promise<User | String> {
        let user = await User.findOne({
            userId: data.userId
        })

        if (!user) {
            return 'User not found';
        }

        user.roleType = data.roleType;

        await user.save();

        return user;
    }
}