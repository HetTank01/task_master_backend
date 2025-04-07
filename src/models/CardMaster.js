import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class CardMaster extends Model { }

CardMaster.init({
    title: { type: DataTypes.STRING, allowNull: false, field: "title" },
    position: { type: DataTypes.INTEGER, allowNull: false, field: "position", defaultValue: 0 },
    description: { type: DataTypes.STRING, allowNull: true, field: "description" }
}, {
    sequelize,
    modelName: "CardMaster",
    tableName: "card_master"
})

export default CardMaster