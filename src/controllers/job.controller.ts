import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const getAllJobs = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesn't exists"
            })
        }

        const jobs = await prisma.job.findMany({
            where: {
                status: "ACTIVE"
            }
        })
        if(jobs.length === 0){
            return res.status(200).json({
                success: true,
                message: "Jobs are not exists"
            })
        }
        
        res.status(200).json({
            success: true,
            message: "Jobs are fetched successfully",
            data: jobs
        })

    }catch (err){
        console.log("Error in getting jobs" + err);
        res.status(500).json({
            success: false,
            message: "Error in getting Jobs"
        })
    }
}
export const getJob = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesn't exists"
            })
        }

        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                success: false,
                message: "Job id is not exists"
            })
        }

        const job = await prisma.job.findFirst({
            where: {
                id: jobId
            }
        })
        if(!job){
            return res.status(400).json({
                success: false,
                message: "Job is not exists"
            })
        }

        res.status(200).json({
            success: true,
            message: "Job fetched successfully",
            data: job
        })

    }catch (err){
        console.log("Error in getting job" + err);
        res.status(500).json({
            success: false,
            message: "Error in getting Job"
        })
    }
}
export const updateJob = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesn't exists"
            })
        }

        
        if(user.role !== "COMPANY"){
            return res.status(401).json({
                success: false,
                message: "Insufficient privileges"
            })
        }

        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                success: false,
                message: "Job id is not exists"
            })
        }

        const job = await prisma.job.findFirst({
            where: {
                id: jobId
            }
        })
        if(!job){
            return res.status(400).json({
                success: false,
                message: "Job is not exists"
            })
        }

        const { type, title, description, position, location, salary, cgpaCutOff, deadline, status } = req.body;

        const updatedContent = {
            type: type ? type : job.type,
            title: title ? title : job.title,
            description: description ? description : job.description,
            position: position ? position : job.position,
            location: location ? location : job.location,
            salary: salary ? salary : job.salary,
            cgpaCutOff: cgpaCutOff ? cgpaCutOff : job.cgpaCutOff,
            deadline: deadline ? deadline : job.deadline,
            status: status ? status : job.status
        }

        const updatedJob = await prisma.job.update({
            where: {
                id: job.id
            },
            updateJob
        })

        res.status(200).json({
            success: true,
            message: "Job fetched successfully",
            data: updatedJob
        })

    }catch (err){
        console.log("Error in updating job" + err);
        res.status(500).json({
            success: false,
            message: "Error in updating Job"
        })
    }
}
export const createJob = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesn't exists"
            })
        }

        if(user.role !== "COMPANY"){
            return res.status(401).json({
                success: false,
                message: "Insufficient privileges"
            })
        }

        const { type, title, description, position, location, salary, cgpaCutOff, deadline, status, companyId } = req.body;

        const newJob = await prisma.job.create({
            type, title, description, position, location, salary, cgpaCutOff, deadline, status, companyId
        })
        res.status(200).json({
                success: false,
                message: "Job created successfully",
                data: newJob
            })
    }catch (err){
        console.log("Error in creation of job" + err);
        res.status(500).json({
            success: false,
            message: "Error in creation of Job"
        })
    }
}


export const applyJob = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesn't exists"
            })
        }

        const jobId = req.params.id;
        if(!jobId) { 
            return res.status(400).json({
                success: false,
                message: "job id is not exits"
            })
        }

        const job = await prisma.job.findFirst({
            where: {
                id: jobId
            }
        })
        if(!job) { 
            return res.status(400).json({
                success: false,
                message: "job is not exits"
            })
        }

        const { studentId, mode } = req.body;
        if(!studentId || !mode){
            return res.status(400).json({
                success: false,
                message: "StudentId and mode of job is not exists"
            })
        }

        const isStudentExists = await prisma.student.findFirst({
            where: {
                id: studentId
            }
        })
        if(!isStudentExists){
            return res.status(400).json({
                success: false,
                message: "Student is not exists"
            })
        }

        const applicationDetails = {
            jobId: job.id,
            studentId: studentId,
            mode: mode
        }

        const creatdApplication = await prisma.application.create({
            applicationDetails
        })

        res.status(200).json({
            success: true,
            message: "Application created successfully",
            data: applicationDetails
        })

    }catch(err) {
        console.log("Error occurs during apply job");
        res.status(500).json({
            success: false,
            message: "Error is happening in applying job",
        })
    }
}
export const jobApplication = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesn't exists"
            })
        }

        const applicationId = req.params.id;
        if(!applicationId) { 
            return res.status(400).json({
                success: false,
                message: "application id is not exits"
            })
        }

        const application = await prisma.application.findFirst({
            where: {
                id: applicationId
            },
            include: {
                job: {
                    select: {
                        type: true,
                        title: true,
                        position: true,
                        location: true,
                        salary: true,
                        cgpaCutOff: true,
                        deadline: true,
                        status: true,
                        company: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                student: {
                    select: {
                        name: true,
                        email: true,
                        resumeUrl: true,
                        phone: true,
                        year: true,
                        branch: true,
                        cgpa: true
                    }
                }
            }
        })
        if(!application) { 
            return res.status(400).json({
                success: false,
                message: "application is not exits"
            })
        }

        res.status(200).json({
            success: true,
            message: "Application created successfully",
            data: application
        })

    }catch(err) {
        console.log("Error occurs during apply job");
        res.status(500).json({
            success: false,
            message: "Error is happening in applying job",
        })
    }
}


export const updateApplicationStatus = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesn't exists"
            })
        }

        const applicationId = req.params.id;
        if(!applicationId) { 
            return res.status(400).json({
                success: false,
                message: "application id is not exits"
            })
        }

        const application = await prisma.application.findFirst({
            where: {
                id: applicationId
            }
        })
        if(!application) { 
            return res.status(400).json({
                success: false,
                message: "application is not exits"
            })
        }

        const updatedStatus = req.body?.status;

        const updatedApplication = await prisma.application.update({
            where: {
                id: applicationId
            },
            status: updatedStatus
        })

        res.status(200).json({
            success: true,
            message: "Application created successfully",
            data: updatedApplication
        })

    }catch(err) {
        console.log("Error occurs during updation application status", err);
        res.status(500).json({
            success: false,
            message: "Error occurs during updation application status",
        })
    }
}
export const closeJob = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const user = req.user;
        if(!user){
            return res.status(400).json({
                success: false,
                message: "User doesn't exists"
            })
        }

        const jobId = req.params.id;
        if(!jobId) { 
            return res.status(400).json({
                success: false,
                message: "Job id is not exits"
            })
        }

        const job = await prisma.job.findFirst({
            where: {
                id: jobId
            }
        })
        if(!job) { 
            return res.status(400).json({
                success: false,
                message: "Job is not exits"
            })
        }

        const updatedJob = await prisma.job.update({
            where: {
                id: jobId
            },
            status: "CLOSED"
        })

        res.status(200).json({
            success: true,
            message: "Job closed successfully",
            data: updateJob
        })

    }catch(err) {
        console.log("Error occurs during closing job", err);
        res.status(500).json({
            success: false,
            message: "Error occurs during closing job",
        })
    }
}

export const shortlistedStudents = async (req: Request, res: Response, next: NextFunction)=> {
    try {
        const user = req.user;
        if(!user){
            return res.status(404).json({
                success: false,
                message: "User doesn't exists"
            })
        }

        const jobId = req.params.id;
        if(!jobId) { 
            return res.status(404).json({
                success: false,
                message: "job id is not exits"
            })
        }

        const isJobExist = await prisma.job.findFirst({
            where: {
                id: jobId
            }
        })
        if(!isJobExist){
            return res.status(404).json({
                success: true,
                message: "Job is not exists",
            })
        }

        const eligibility = await prisma.jobEligibility.find({
            where: {
                jobId: jobId
            }
        })
        if(!eligibility){
            return res.status(404).json({
                success: true,
                message: "Eligibility is not exits"
            })
        }

        const eligibleStudents = await prisma.student.findMany({
            where:{
                year: eligibility.minYear,
                branch: eligibility.branch
            }
        })
        if(eligibleStudents.length === 0){
            return res.status(404).json({
                success: true,
                message: "Eligibility is not exits"
            })
        }

        res.status(200).json({
            success: true,
            message: "Shortlisted Candidates",
            data: eligibleStudents
        })

    }catch(err) {
        console.log("Error occurs during finding shortlisted students");
        res.status(500).json({
            success: false,
            message: "Error occurs during finding shortlisted students",
        })
    }
}