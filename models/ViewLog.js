import mongoose from "mongoose";

const viewLogSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  viewedAt: { type: Date, default: Date.now }
});

const ViewLog = mongoose.model("ViewLog", viewLogSchema);
export default ViewLog;