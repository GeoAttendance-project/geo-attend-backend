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
    department: {
      type: String,
      required: false, // Set to true if needed
    },
    year: {
      type: String, // or Number, based on your use case
      required: false,
    },
    attachmentLink: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const AttendanceAnnouncement = mongoose.model(
  "AttendanceAnnouncement",
  attendanceAnnouncementSchema
);

export default AttendanceAnnouncement;
