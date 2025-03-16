import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    markedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    morning: {
      gpsLocation: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
      markedAt: { type: Date, default: null },
    },
    afternoon: {
      gpsLocation: {
        latitude: { type: Number },
        longitude: { type: Number},
      },
      markedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
