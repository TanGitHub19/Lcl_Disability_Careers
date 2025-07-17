import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String,
      required: false,
    },
    resume: {
      type: String,
      required: true,
    },
    medicalCertificate: {
      type: String,
      required: false,
    },
    videoIntroduction: {
      type: String,
      required: false,
    },
    additionalFiles: [{ type: String }],
    accessibilityNeeds: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Shortlisted",
        "Rejected",
        "Interview Scheduled",
        "Interview Completed",
        "Hired",
      ],
      default: "Pending",
    },
    interview: {
      scheduled_time: Date,
      interview_type: {
        type: String,
        enum: ["In-Person", "Online"],
        required: false,
      },
      location: {
        type: String,
        required: function () {
          return this.interview_type === "In-Person";
        },
      },
      platformLink: {
        type: String,
        required: function () {
          return this.interview_type === "Online";
        },
      },
      status: {
        type: String,
        enum: ["Scheduled", "Completed", "Cancelled", "Confirmed", "Declined"],
        default: "Scheduled",
      },
      rescheduleRequestedByApplicant: {
        type: Boolean,
        default: false,
      },
      newScheduledTime: {
        type: Date,
        required: false,
      },
    },
  },

  {
    timestamps: true,
  }
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;
