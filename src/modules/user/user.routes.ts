
import { response, Router } from "express";
import { User } from "./user.model";

const router=Router();

router.post("/", async(req,res)=> {
    
        const user = await User.create(req.body);

        res.status(200).json({
            success: true,
            message: "User created successfully",
            response: user
        })

    }
);

router.get("/:id", async(req,res)=>{
    const user = await User.findByPk(req.params.id);

    if(!user){
        return res.status(404).json({
            success: false,
            message:"User not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "User found successfull",
        response: user
    });
});

export default router;
