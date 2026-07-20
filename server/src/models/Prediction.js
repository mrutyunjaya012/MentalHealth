import mongoose from "mongoose";

const inputsSchema = new mongoose.Schema(
  {
    age: Number,
    gender: String,
    heightCm: Number,
    weightKg: Number,
    sleepHours: Number,
    sleepQuality: Number,
    bedtimeRegularity: Number,
    awakenings: Number,
    stress: Number,
    anxietyScore: Number,
    moodScore: Number,
    activityMinutes: Number,
    screenTimeHours: Number,
    socialMediaHours: Number,
    caffeineCups: Number,
    alcohol: String,
    smoking: String,
    diet: String,
    socialSupport: Number,
    restingHr: Number,
    hrv: Number,
    spo2: Number,
    steps: Number,
  },
  { _id: false }
);

const resultsSchema = new mongoose.Schema(
  {
    depression: { type: Number, required: true },
    anxiety: { type: Number, required: true },
    sleep: { type: Number, required: true },
  },
  { _id: false }
);

const predictionSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: [true, "User email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    inputs: {
      type: inputsSchema,
      required: true,
    },
    results: {
      type: resultsSchema,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret) {
        ret.id = ret._id.toString();
        ret.timestamp = ret.createdAt;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Prediction = mongoose.model("Prediction", predictionSchema);
