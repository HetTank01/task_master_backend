import BoardMaster from "./BoardMaster.js";
import CardMaster from "./CardMaster.js";
import CommentMaster from "./CommentMaster.js";
import ListMaster from "./ListMaster.js";
import UserMaster from "./UserMaster.js";


// Associations

BoardMaster.belongsTo(UserMaster)
UserMaster.hasMany(BoardMaster)

// BoardMaster <--> ListMaster
ListMaster.belongsTo(BoardMaster)
BoardMaster.hasMany(ListMaster)

// ListMaster <--> CardMaster
CardMaster.belongsTo(ListMaster)
ListMaster.hasMany(CardMaster)

// CommentMaster <--> CardMaster
CommentMaster.belongsTo(CardMaster)
CardMaster.hasMany(CommentMaster)

// CommentMaster <--> UserMaster
CommentMaster.belongsTo(UserMaster)
UserMaster.hasMany(CommentMaster)

CommentMaster.hasMany(CommentMaster, { as: "replies", foreignKey: "ParentId", onDelete: "CASCADE" })
CommentMaster.belongsTo(CommentMaster, { as: "parent", foreignKey: "ParentId" })