
import { Op } from "sequelize";
import { Meeting } from "../module/meeting.model";
import { ERRORS } from "../../../utils/constants";

export class MeetingService {

 static async checkConflict(userId:number,start:Date,end:Date,excludeId?:number){
  const conflict = await Meeting.findOne({
   where:{
    userId,
    id: excludeId ? { [Op.ne]: excludeId } : { [Op.ne]: null },
    startTime:{ [Op.lt]: end },
    endTime:{ [Op.gt]: start }
   }
  });
  if(conflict){
   const err:any = new Error(ERRORS.SLOT_BOOKED);
   err.status=400;
   throw err;
  }
 }

 static async create(data:any){
  const start = new Date(data.startTime);
  const end = new Date(data.endTime);

  if(start>=end) throw {status:400,message:"Invalid time range"};

  await this.checkConflict(data.userId,start,end);

  return Meeting.create({...data,startTime:start,endTime:end});
 }

 static async list(filters:any){
  const where:any={};
  if(filters.userId) where.userId=filters.userId;
  if(filters.start && filters.end){
   where.startTime={ [Op.between]:[new Date(filters.start),new Date(filters.end)] };
  }
  return Meeting.findAll({where});
 }

 static async get(id:number){
  const m = await Meeting.findByPk(id);
  if(!m) throw {status:404,message:ERRORS.NOT_FOUND};
  return m;
 }

 static async update(id:number,data:any){
  const meeting = await this.get(id);

  const start = data.startTime ? new Date(data.startTime) : meeting.getDataValue("startTime");
  const end = data.endTime ? new Date(data.endTime) : meeting.getDataValue("endTime");

  await this.checkConflict(meeting.getDataValue("userId"),start,end,id);

  await meeting.update({...data,startTime:start,endTime:end});
  return meeting;
 }

 static async delete(id:number){
  const m= await this.get(id);
  await m.destroy();
 }
}
