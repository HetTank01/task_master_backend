import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";
import BoardMaster from "./BoardMaster.js";
import UserMaster from "./UserMaster.js";

class BoardUser extends Model { }

BoardUser.init({
    role: {
        type: DataTypes.ENUM("owner", "editor", "viewer"),
        allowNull: false,
        defaultValue: "viewer",
    },
}, {
    sequelize,
    modelName: "BoardUser",
    tableName: "board_user"
})

export default BoardUser