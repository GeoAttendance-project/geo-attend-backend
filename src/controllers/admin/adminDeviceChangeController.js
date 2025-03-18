import DeviceChangeRequest from "../../models/student/studentDeviceChangeModel.js";
import Student from "../../models/student/studentModel.js";
import AppError from "../../utils/appError.js";
import { catchAsync } from "../../utils/catchAsync.js";

export const requestsDeviceChange = catchAsync(async (req, res, next) => {
  const requests = await DeviceChangeRequest.find().populate(
    "student",
    "name email department year"
  );
  res.json({ success: true, data: requests });
});

export const deviceChangeApproveOrReject = catchAsync(
  async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body; // Accepts "APPROVED" or "REJECTED"
    console.log(req.params);
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const request = await DeviceChangeRequest.findById(id);
    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    if (status === "APPROVED" && request) {
      const removeOldDeviceId = await Student.findOneAndUpdate(
        { deviceId: request.newDeviceId },
        { deviceId: null }
      );
      const student = await Student.findById(request.student);
      student.deviceId = request.newDeviceId;
      await student.save();
    }

    request.status = status;
    await request.save();

    res.status(200).json({
      success: true,
      message: `Request ${status.toLowerCase()} successfully`,
    });
  }
);
