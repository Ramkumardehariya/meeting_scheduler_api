
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../config/database";

export class Meeting extends Model {}

Meeting.init({
 id:{ type:DataTypes.INTEGER, autoIncrement:true, primaryKey:true },
 userId:{ type:DataTypes.INTEGER, allowNull:false },
 title:{ type:DataTypes.STRING, allowNull:false },
 startTime:{ type:DataTypes.DATE, allowNull:false },
 endTime:{ type:DataTypes.DATE, allowNull:false }
},{
 sequelize,
 tableName:"meetings",
 timestamps:true,
 indexes:[
  { fields:["userId"] },
  { fields:["startTime"] },
  { fields:["endTime"] }
 ]
});
