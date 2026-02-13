
import { Request,Response,NextFunction, response } from "express";
import { MeetingService } from "../service/meeting.service";

export class MeetingController{

 static create = async(req:Request,res:Response,next:NextFunction)=>{
    try{ 
        const meeting = await MeetingService.create(req.body);

        res.status(200).json({
            success: true,
            message: "Meeting has been created successfully",
            response: meeting
        })
    }
    catch(e){ 
        next(e);
    }
 };

 static list = async(req:Request,res:Response,next:NextFunction)=>{
  try{ 
        const allMeetings = await MeetingService.list(req.query);

        res.status(200).json({
            success: true,
            message: "All meetings get successfully",
            response: allMeetings
        })
    }
    catch(e){ 
        next(e); 
    }
 };

 static get = async(req:Request,res:Response,next:NextFunction)=>{
  try{ 
       const meeting = await MeetingService.get(Number(req.params.id));

       res.status(200).json({
          success: true,
          message: "Meeting found successfull",
          response: meeting
       })
   }
   catch(e){ 
       next(e); 
   }
 };

 static update = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const updateMeeting = await MeetingService.update(Number(req.params.id), req.body);

        res.status(200).json({
            success: true,
            message: "Meeting updated successfully",
            response: updateMeeting
        })
    }
    catch(e){ 
        next(e); 
    }
 };

 static delete = async(req:Request,res:Response,next:NextFunction)=>{
    try{ 
        await MeetingService.delete(Number(req.params.id)); 

        res.status(200).json({
            success: true,
            message: "meeting deleted successfully"
        })
    }
    catch(e){ 
        next(e); 
    }
 };
}
