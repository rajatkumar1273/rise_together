import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
    },
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "campaigns",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.donations) {
  delete mongoose.models.donations;
}

const DonationModel = mongoose.model("donations", donationSchema);

export default DonationModel;
