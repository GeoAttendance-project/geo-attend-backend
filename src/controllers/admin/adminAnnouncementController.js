import attendanceAnnouncement from "../../models/admin/adminAnnouncementModel.js";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const postAnnouncement = catchAsync(async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    next(
      new AppError("Please provide title and content for the announcemnets")
    );
  }

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
