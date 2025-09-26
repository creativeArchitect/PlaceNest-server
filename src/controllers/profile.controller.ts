import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exists, Please register.",
      });
    }
    
    if(user.role === 'COMPANY'){
        res.status(200).json({
            success: true,
            message: "Your profile got successfully",
            data: {
              id: user?.id,
              email: user?.email,
              role: user?.role,
              branch: user?.branch,
              year: user?.year,
              cgpa: user?.cgpa,
              activeBacklog: user?.activeBacklog,
              isVerified: user?.isVerified,
              resumeUrl: user?.resumeUrl,
              description: user?.description,
              linkedin: user?.linkedin
            }
          });
    }else if (user.role === 'STUDENT'){
        res.status(200).json({
            success: true,
            message: "Your profile got successfully",
            data: {
                id: user?.id,
                email: user?.email,
                role: user?.role,
                industry: user?.industry,
                description: user?.description,
                linkedin: user?.linkedin,
                website: user?.website,
                founded: user?.founded
              }
          });
    }else{
        res.status(200).json({
            success: true,
            message: "Your profile got successfully",
            data: {
                id: user?.id,
                email: user?.email,
                role: user?.role,
                branch: user?.branch,
                year: user?.year,
                cgpa: user?.cgpa,
                activeBacklog: user?.activeBacklog,
                isVerified: user?.isVerified,
                resumeUrl: user?.resumeUrl,
                description: user?.description,
                linkedin: user?.linkedin
            }
          });
    }
  } catch (err) {
    console.log("Error in getting user profile");
    return res.status(500).json({
      success: false,
      message: "Error in getting user profile",
    });
  }
};

export const addProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exists, Please register.",
      });
    }

    if (user.role === "STUDENT") {
      const {
        name,
        email,
        phone,
        branch,
        year,
        cgpa,
        active_backlog,
        backlogs,
        resumeUrl,
      } = req.body;

      if (
        !name ||
        !email ||
        !phone ||
        !branch ||
        !year ||
        !cgpa ||
        !active_backlog ||
        !backlogs ||
        !resumeUrl
      ) {
        return res.status(400).json({
            success: false,
            message: "User doesn't exists, Please register.",
          });
      }

      const newUser = await prisma.user.create({
        name,
        email,
        phone,
        branch,
        year,
        cgpa,
        active_backlog,
        backlogs,
        resumeUrl,
      });
      
    res.status(200).json({
        success: true,
        message: "Your profile added successfully",
        data: newUser,
      });
    }else if (user.role === "COMPANY") {
        const {
          name,
          email,
          phone,
          industry,
          description,
          founded,
          linkedin,
          website
        } = req.body;
  
        if (
          !name ||
          !email ||
          !phone ||
          !industry ||
          !description ||
          !founded ||
          !linkedin || !website
        ) {
        return res.status(400).json({
            success: false,
            message: "Enter required fields.",
          });
        }
  
        const newUser = await prisma.Company.create({
            name,
            email,
            phone,
            industry,
            description,
            founded,
            linkedin,
            website
        });
        
      res.status(200).json({
          success: true,
          message: "Your profile added successfully",
          data: newUser,
        });
    }else {
        const {
          name,
          email,
          phone,
          branch,
          year,
          cgpa,
          active_backlog,
          backlogs,
          resumeUrl,
        } = req.body;
  
        if (
          !name ||
          !email ||
          !phone ||
          !branch ||
          !year ||
          !cgpa ||
          !active_backlog ||
          !backlogs ||
          !resumeUrl
        ) {
          return res.status(400).json({
              success: false,
              message: "User doesn't exists, Please register.",
            });
        }
  
        const newUser = await prisma.user.create({
          name,
          email,
          phone,
          branch,
          year,
          cgpa,
          active_backlog,
          backlogs,
          resumeUrl,
        });
        
      res.status(200).json({
          success: true,
          message: "Your profile added successfully",
          data: newUser,
        });
      }
  } catch (err) {
    console.log("Error in creation of user profile");
    return res.status(500).json({
      success: false,
      message: "Error in creation of user profile",
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exists, Please register.",
      });
    }

    if(user.role === "STUDENT"){
        const {
            name,
            email,
            phone,
            branch,
            year,
            cgpa,
            active_backlog,
            backlogs,
            resumeUrl,
          } = req.body;
      
          const updatedData = {
            name: name ? name : req.user?.name,
            email: email ? email : req.user?.email,
            phone: phone ? phone : req.user?.phone,
            branch: branch ? branch : req.user?.branch,
            year: year ? year : req.user?.year,
            cgpa: cgpa ? cgpa : req.user?.cgpa,
            active_backlog: active_backlog ? active_backlog : req.user?.active_backlog,
            backlogs: backlogs ? backlogs : req.user?.backlogs,
            resumeUrl: resumeUrl ? resumeUrl : req.user?.resumeUrl,
            isVerified: false
          };
      
          const updatedUser = await prisma.user.update({
            where: { email: email },
            updatedData,
          });

          res.status(200).json({
            success: true,
            message: "Your profile updated successfully",
            data: updatedUser,
          });
    }else if (user.role === "COMPANY") {
        const {
          name,
          email,
          phone,
          industry,
          description,
          founded,
          linkedin,
          website
        } = req.body;

        const updatedData = {
            name: name ? name : req.user?.name,
            email: email ? email : req.user?.email,
            phone: phone ? phone : req.user?.phone,
            industry: industry ? industry : req.user?.industry,
            founded: founded ? founded : req.user?.founded,
            description: description ? description : req.user?.description,
            linkedin: linkedin ? linkedin : req.user?.linkedin,
            website: website ? website : req.user?.website,
            isVerified: false
          };
  
        const newUser = await prisma.user.update({
            where: {
                email: user.email
            }, updatedData
        })
        
      res.status(200).json({
          success: true,
          message: "Your profile added successfully",
          data: newUser,
        });
    }else {
        const {
            name,
            email,
            phone,
            branch,
            year,
            cgpa,
            active_backlog,
            backlogs,
            resumeUrl,
          } = req.body;
      
          const updatedData = {
            name: name ? name : req.user?.name,
            email: email ? email : req.user?.email,
            phone: phone ? phone : req.user?.phone,
            branch: branch ? branch : req.user?.branch,
            year: year ? year : req.user?.year,
            cgpa: cgpa ? cgpa : req.user?.cgpa,
            active_backlog: active_backlog ? active_backlog : req.user?.active_backlog,
            backlogs: backlogs ? backlogs : req.user?.backlogs,
            resumeUrl: resumeUrl ? resumeUrl : req.user?.resumeUrl,
            isVerified: false
          };
      
          const updatedUser = await prisma.user.update({
            where: { email: email },
            updatedData,
          });

          res.status(200).json({
            success: true,
            message: "Your profile updated successfully",
            data: updatedUser,
          });
    }
  } catch (err) {
    console.log("Error in updation in profile");
    return res.status(500).json({
      success: false,
      message: "Error in updation in profile",
    });
  }
};

export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exists, Please register.",
      });
    }

    const deletedUser = await prisma.user.delete({
      where: {
        email: user?.email,
      },
    });

    res.status(200).json({
      success: true,
      message: "Your profile deleted successfully",
    });
  } catch (err) {
    console.log("Error in deletion of profile");
    // return next(new AppError("Error in deletion of profile", 500));
    return res.status(500).json({
      success: false,
      message: "Error in deletion of profile",
    });
  }
};














