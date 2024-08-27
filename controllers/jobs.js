const Job = require('../models/Job');
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors');

const getAllJobs = async (req, res) => {
    const jobs = await Job.find({ createdBy: req.user.userId } ).sort('createdAt');
    res.status(StatusCodes.OK).json({ jobs , count: jobs.length})
}

const getJob = async (req, res) => {
    const jobId = req.params.id;
    const user = req.user.userId;
    const job = await Job.findOne({ _id:jobId , createdBy: user});

    if(!job){ throw new NotFoundError(`Job not found with id : ${jobId}`) };

    res.status(StatusCodes.OK).json({ job });
}

const createJob = async (req, res) => {
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
    const jobId = req.params.id;
    const user = req.user.userId;
    const company = req.body.company;
    const position = req.body.position;

    if(company === '' || position === '' ){ throw new BadRequestError('Provide company and position')}; 

    const job = await Job.findByIdAndUpdate({ _id:jobId , createdBy: user} , req.body , { new:true, runValidators:true })
    
    if(!job){ throw new NotFoundError(`Job not found with id : ${jobId}`) };
    res.status(StatusCodes.OK).json({ job });
}

const deleteJob = async (req, res) => {
    // const jobId = req.params.id;
    // const user = req.user.userId;
    const { params:{id:jobId} , user:{userId:userId} } = req;
    const job = await Job.findByIdAndRemove({ _id:jobId , createdBy: userId});

    if(!job){ throw new NotFoundError(`Job not found with id : ${jobId}`) };

    res.status(StatusCodes.OK).json();
}

module.exports = {
    getAllJobs,
    getJob,
    createJob,
    updateJob,
    deleteJob
}

