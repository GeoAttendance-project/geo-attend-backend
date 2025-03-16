import mongoose from "mongoose";

const deviceChangeRequestSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    oldDeviceId: { type: String, required: true },
    newDeviceId: { type: String, required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
  });
  
  const DeviceChangeRequest = mongoose.model("DeviceChangeRequest", deviceChangeRequestSchema);
  

  export default DeviceChangeRequest;
