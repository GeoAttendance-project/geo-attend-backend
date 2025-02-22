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
        enum: ["Point"],
        default: "Point",
        required: true,  // Ensure type is always provided
      },
      coordinates: {
        type: [Number], 
        required: true,
        validate: {
          validator: function (val) {
            return val.length === 2; // Ensure exactly [longitude, latitude]
          },
          message: "Coordinates must have exactly two values: [longitude, latitude]",
        },
      }
    },
    radius: {
      type: Number, // Changed from String to Number
      default: 10, // Ensure it's stored as a number
    },
  },
  {
    timestamps: true,
  }
);

// Create 2dsphere index on geoLocation to enable geospatial queries
attendanceLocationSchema.index({ geoLocation: "2dsphere" });

// Sync indexes to ensure they are created in the database
attendanceLocationSchema.pre("save", async function (next) {
  await this.constructor.syncIndexes();
  next();
});

const AttendanceLocation = mongoose.model(
  "AttendanceLocation",
  attendanceLocationSchema
);

export default AttendanceLocation;
