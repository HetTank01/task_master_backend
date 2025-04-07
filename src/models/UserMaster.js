import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class UserMaster extends Model { }

UserMaster.init({
    username: { type: DataTypes.STRING, allowNull: false, field: "username" },
    email: { type: DataTypes.STRING, allowNull: false, field: "email" },
    password: { type: DataTypes.STRING, allowNull: false, field: "password" },
    shared_boards: { type: DataTypes.JSON, allowNull: true, field: "shared_boards", defaultValue: [] },
}, {
    sequelize,
    modelName: "UserMaster",
    tableName: "user_master"
})

export default UserMaster