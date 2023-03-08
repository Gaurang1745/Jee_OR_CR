const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Job = require("../models/RankList");

const getAllJobs = async (req, res) => {
  // console.log(req.user.userId);
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs });
};

const getJob = async (req, res) => {
  const findJob = await Job.findOne({
    _id: req.params.id,
    createdBy: req.user.userId,
  });
  if (!findJob) {
    throw new NotFoundError(`Job not found with job id : ${req.params.id}`);
  }
  res.status(StatusCodes.OK).json({ findJob });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    params: { id: jobId },
    user: { userId },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequestError("Company or position name cannot be empty");
  }
  const patchJob = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!patchJob) {
    throw new NotFoundError(`Job not found with job id : ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ patchJob });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

const deleteJob = async (req, res) => {
  const findJob = await Job.findByIdAndDelete({
    _id: req.params.id,
    createdBy: req.user.userId,
  });
  if (!findJob) {
    throw new NotFoundError(`Job not found with job id : ${req.params.id}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
