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
      const companyProfile = await prisma.company.findFirst({
        where: {
          email: user.email,
          phone: user.phone
        }
      });

      if(!companyProfile){
        res.status(404).json({
          success: false,
          message: "Company profile doesn't exists."
        })
      }
    
        res.status(200).json({
            success: true,
            message: "Your profile got successfully",
            data: {
              id: companyProfile?.id,
              email: companyProfile?.email,
              role: companyProfile?.role,
              branch: companyProfile?.branch,
              year: companyProfile?.year,
              cgpa: companyProfile?.cgpa,
              activeBacklog: companyProfile?.activeBacklog,
              isVerified: companyProfile?.isVerified,
              resumeUrl: companyProfile?.resumeUrl,
              description: companyProfile?.description,
              linkedin: companyProfile?.linkedin
            }
          });
    }else if (user.role === 'STUDENT'){
      const studentProfile = await prisma.student.findUnique({
        where: {
          email: user.email,
          phone: user.phone
        }
      })
      if(!studentProfile){
        res.status(404).json({
          success: false,
          message: "Student profile doesn't exists."
        })
      }

        res.status(200).json({
            success: true,
            message: "Your profile got successfully",
            data: {
                id: studentProfile?.id,
                email: studentProfile?.email,
                role: studentProfile?.role,
                industry: studentProfile?.industry,
                description: studentProfile?.description,
                linkedin: studentProfile?.linkedin,
                website: studentProfile?.website,
                founded: studentProfile?.founded
              }
          });
    }else{
      const coordinatorProfile = await prisma.coordinator.findUnique({
        where: {
          email: user.email,
          phone: user.phone
        }
      })
      if(!coordinatorProfile){
        res.status(404).json({
          success: false,
          message: "Coordinator profile doesn't exists."
        })
      }

        res.status(200).json({
            success: true,
            message: "Your profile got successfully",
            data: {
                id: coordinatorProfile?.id,
                email: coordinatorProfile?.email,
                role: coordinatorProfile?.role,
                branch: coordinatorProfile?.branch,
                year: coordinatorProfile?.year,
                cgpa: coordinatorProfile?.cgpa,
                activeBacklog: coordinatorProfile?.activeBacklog,
                isVerified: coordinatorProfile?.isVerified,
                resumeUrl: coordinatorProfile?.resumeUrl,
                description: coordinatorProfile?.description,
                linkedin: coordinatorProfile?.linkedin
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

      const newStudentProfile = await prisma.student.create({
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
        data: newStudentProfile,
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
  
        const newCompanyProfile = await prisma.company.create({
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
          data: newCompanyProfile,
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
  
        const newCoordinatorProfile = await prisma.coordinator.create({
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
          data: newCoordinatorProfile,
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
      const existingStudentProfile = await prisma.student.findFirst({
        where: {
          email: user.email,
          phone: user.phone
        }
      })
      if(!existingStudentProfile){
        res.status(404).json({
          success: false,
          message: "Student profile doesn't exists"
        })
      }

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
            name: name ? name : existingStudentProfile?.name,
            email: email ? email : existingStudentProfile?.email,
            phone: phone ? phone : existingStudentProfile?.phone,
            branch: branch ? branch : existingStudentProfile?.branch,
            year: year ? year : existingStudentProfile?.year,
            cgpa: cgpa ? cgpa : existingStudentProfile?.cgpa,
            active_backlog: active_backlog ? active_backlog : existingStudentProfile?.active_backlog,
            backlogs: backlogs ? backlogs : existingStudentProfile?.backlogs,
            resumeUrl: resumeUrl ? resumeUrl : existingStudentProfile?.resumeUrl,
            isVerified: false
          };
      
          const updatedStudentProfile = await prisma.student.update({
            where: { email: existingStudentProfile.email },
            updatedData,
          });

          res.status(200).json({
            success: true,
            message: "Your profile updated successfully",
            data: updatedStudentProfile,
          });
    }else if (user.role === "COMPANY") {
      const existingCompanyProfile = await prisma.company.findFirst({
        where: {
          email: user.email,
          phone: user.phone
        }
      })
      if(!existingCompanyProfile){
        res.status(404).json({
          success: true,
          message: "Company profile doesn't exists"
        })
      }

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
            name: name ? name : existingCompanyProfile?.name,
            email: email ? email : existingCompanyProfile?.email,
            phone: phone ? phone : existingCompanyProfile?.phone,
            industry: industry ? industry : existingCompanyProfile?.industry,
            founded: founded ? founded : existingCompanyProfile?.founded,
            description: description ? description : existingCompanyProfile?.description,
            linkedin: linkedin ? linkedin : existingCompanyProfile?.linkedin,
            website: website ? website : existingCompanyProfile?.website,
            isVerified: false
          };
  
        const updatedCompanyProfile = await prisma.company.update({
            where: {
                email: existingCompanyProfile.email,
                phone: existingCompanyProfile.phone
            }, 
            updatedData
        })
        
      res.status(200).json({
          success: true,
          message: "Your profile added successfully",
          data: updatedCompanyProfile,
        });
    }else {
      const existingCoordinatorProfile = await prisma.coordinator.findFirst({
        where: {
          email: user.email,
          phone: user.phone
        }
      })
      if(!existingCoordinatorProfile){
        res.status(404).json({
          success: false,
          message: "Coordinator profile doesn't exists"
        })
      }

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
            name: name ? name : existingCoordinatorProfile?.name,
            email: email ? email : existingCoordinatorProfile?.email,
            phone: phone ? phone : existingCoordinatorProfile?.phone,
            branch: branch ? branch : existingCoordinatorProfile?.branch,
            year: year ? year : existingCoordinatorProfile?.year,
            cgpa: cgpa ? cgpa : existingCoordinatorProfile?.cgpa,
            active_backlog: active_backlog ? active_backlog : existingCoordinatorProfile?.active_backlog,
            backlogs: backlogs ? backlogs : existingCoordinatorProfile?.backlogs,
            resumeUrl: resumeUrl ? resumeUrl : existingCoordinatorProfile?.resumeUrl,
            isVerified: false
          };
      
          const updatedCoordinatorProfile = await prisma.coordinator.update({
            where: { 
              email: existingCoordinatorProfile.email,
              phone: existingCoordinatorProfile.phone
             },
            updatedData,
          });

          res.status(200).json({
            success: true,
            message: "Your profile updated successfully",
            data: updatedCoordinatorProfile,
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

// export const deleteProfile = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const user = req.user;
//     if (!user) {
//       return res.status(400).json({
//         success: false,
//         message: "User doesn't exists, Please register.",
//       });
//     }

//     if(user.role === "STUDENT"){
//       const existingProfile = await prisma.student.findFirst({
//         where: {
//           email: user.email,
//           phone: user.phone
//         }
//       })
//       if(!existingProfile){
//         res.status(404).json({
//           message: "Student not exists"
//         })
//       }
//     }else if(user.role === "COMPANY"){

//     }else {

//     }

//     const deletedUser = await prisma.user.delete({
//       where: {
//         email: user?.email,
//       },
//     });

//     res.status(200).json({
//       success: true,
//       message: "Your profile deleted successfully",
//     });
//   } catch (err) {
//     console.log("Error in deletion of profile");
//     // return next(new AppError("Error in deletion of profile", 500));
//     return res.status(500).json({
//       success: false,
//       message: "Error in deletion of profile",
//     });
//   }
// };














