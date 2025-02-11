import attendanceAnnouncement from "../../models/admin/adminAnnouncementModel.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const getAllAnnouncement = catchAsync(async (req, res, next) => {
    const announcements = await attendanceAnnouncement.find({});
    res.status(201).json({
      status: "success",
      data: announcements,
    });
  });