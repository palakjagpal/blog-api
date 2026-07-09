import mongoose from "mongoose";

const viewLogSchema = new mongoose.Schema({
  blog: { type: mongoose.Schema.Types.ObjectId, ref: "Blog", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "BlogUser", default: null }, 
  ip: { type: String, default: null },
  viewedAt: { type: Date, default: Date.now }
});

viewLogSchema.index({ blog: 1, user: 1 });
viewLogSchema.index({ blog: 1, ip: 1 });

const ViewLog = mongoose.model("ViewLog", viewLogSchema);
export default ViewLog;