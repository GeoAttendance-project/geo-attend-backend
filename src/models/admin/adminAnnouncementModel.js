import mongoose from "mongoose";

const attendanceAnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);


const attendanceAnnouncement = mongoose.model(
  "AttendanceAnnouncemnt",
  attendanceAnnouncementSchema
);

export default attendanceAnnouncement;
