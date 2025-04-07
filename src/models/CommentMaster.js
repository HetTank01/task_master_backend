import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class CommentMaster extends Model { }

CommentMaster.init({
    description: { type: DataTypes.STRING, allowNull: false, field: "description" },
    ParentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: "ParentId",
        references: {
            model: "comment_master",
            key: "id"
        }
    }
}, {
    sequelize,
    modelName: "CommentMaster",
    tableName: "comment_master"
})

export default CommentMaster