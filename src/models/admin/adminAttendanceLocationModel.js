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
      type: { 
        type: String, 
        default: "Point", 
        enum: ["Point"] 
      },
      coordinates: {
        type: [Number], 
        required: true,
      }
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

// Create 2dsphere index on geoLocation to enable geospatial queries
attendanceLocationSchema.index({ geoLocation: "2dsphere" });

const AttendanceLocation = mongoose.model(
  "AttendanceLocation",
  attendanceLocationSchema
);

export default AttendanceLocation;
