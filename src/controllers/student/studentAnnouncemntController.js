import attendanceAnnouncement from "../../models/admin/adminAnnouncementModel.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const getAllAnnouncement = catchAsync(async (req, res, next) => {
  const { year, department } = req.student;

  const announcements = await attendanceAnnouncement
    .find({
      $or: [
        { year: year.toString(), department: department }, // 4 & IT
        { year: year.toString(), department: "ALL" }, // 4 & ALL
        { year: "ALL", department: department }, // ALL & IT
        { year: "ALL", department: "ALL" }, // ALL & ALL
      ],
    })
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    data: announcements,
  });
});