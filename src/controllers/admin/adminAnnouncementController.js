import { matchedData, validationResult } from "express-validator";
import attendanceAnnouncement from "../../models/admin/adminAnnouncementModel.js";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { addAnnouncementValidator } from "../../validators/admin/admin.announcement.validator.js";

export const postAnnouncement = catchAsync(async (req, res, next) => {
  await Promise.all(
    addAnnouncementValidator.map((validator) => validator.run(req))
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError(`${errors.array().at(0)?.msg}`, 400));
  }

  const { title, content } = matchedData(req, {
    locations: ["body", "params"],
  });
  const announcement = await attendanceAnnouncement.create({
    title,
    content,
  });

  res.status(201).json({
    status: "success",
    data: announcement,
  });
});

export const getAllAnnouncement = catchAsync(async (req, res, next) => {
  const announcements = await attendanceAnnouncement.find({});
  res.status(201).json({
    status: "success",
    data: announcements,
  });
});

export const getAnnouncement = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const announcement = await attendanceAnnouncement.findById({ _id: id });
  res.status(201).json({
    status: "success",
    data: announcement,
  });
});
