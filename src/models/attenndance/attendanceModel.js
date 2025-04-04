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
    gpsLocation: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
  },
  {
    timestamps: true, 
  }
);


const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
