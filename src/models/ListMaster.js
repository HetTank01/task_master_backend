import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class ListMaster extends Model { }

ListMaster.init({
    title: { type: DataTypes.STRING, allowNull: false, field: "title" },
    position: { type: DataTypes.INTEGER, allowNull: false, field: "position", defaultValue: 0 }
}, {
    sequelize,
    modelName: "ListMaster",
    tableName: "list_master"
})

export default ListMaster