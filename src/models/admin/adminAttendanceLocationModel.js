import mongoose from "mongoose";

const attendanceLocationSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      enum: ["IT"],
    },
    year: {
      type: Number,
      required: true,
      min: 2,
      max: 4,
    },
    geoLocation: {
        type: [Number],
        required: true,
    },

    radius: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

attendanceLocationSchema.index({ geoLocation: "2dsphere" });

const AttendanceLocation = mongoose.model(
  "AttendanceLocation",
  attendanceLocationSchema
);

export default AttendanceLocation;
