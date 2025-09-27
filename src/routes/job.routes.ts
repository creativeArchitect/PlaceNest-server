import { applicationStatus, applyJob, createJob, getAllJobs, getJob, jobApplication, updateJob, updateApplicationStatus, closeJob, shortlistedStudents } from "@/controllers/job.controller";
import { isUserLoggedIn } from "@/middlewares/auth.middleware";
import { Router } from "express";

const jobRouter = Router();

jobRouter.get('/', isUserLoggedIn, getAllJobs);
jobRouter.get('/:id', isUserLoggedIn, getJob);
jobRouter.get('/:id', isUserLoggedIn, updateJob);
jobRouter.get('/:id', isUserLoggedIn, createJob);

jobRouter.get('/:id/apply', isUserLoggedIn, applyJob);
jobRouter.get('/application/:id', isUserLoggedIn, jobApplication);
jobRouter.get('/:id/close', isUserLoggedIn, closeJob);
jobRouter.get('/:id/eligibility', isUserLoggedIn, updateApplicationStatus);
jobRouter.get('/:id/shortlisted/students', isUserLoggedIn, shortlistedStudents);

jobRouter.get('/:id/application/:studentId/status', isUserLoggedIn, applicationStatus);

export default jobRouter;