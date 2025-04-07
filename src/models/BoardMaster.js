import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class BoardMaster extends Model { }

BoardMaster.init({
    title: { type: DataTypes.STRING, allowNull: false, field: "title" },
}, {
    sequelize,
    modelName: "BoardMaster",
    tableName: "board_master"
})

export default BoardMaster