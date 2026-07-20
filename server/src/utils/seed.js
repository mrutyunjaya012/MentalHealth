import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Prediction } from "../models/Prediction.js";

const DEFAULT_USERS = [
  {
    name: "System Admin",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "John Doe",
    email: "user@gmail.com",
    password: "user123",
    role: "user",
  },
];

const DEFAULT_PREDICTIONS = [
  {
    userEmail: "user@gmail.com",
    inputs: {
      age: 28,
      gender: "Male",
      heightCm: 178,
      weightKg: 80,
      sleepHours: 5.5,
      sleepQuality: 4,
      bedtimeRegularity: 4,
      awakenings: 2,
      stress: 8,
      anxietyScore: 7,
      moodScore: 4,
      activityMinutes: 20,
      screenTimeHours: 6,
      socialMediaHours: 4,
      caffeineCups: 3,
      alcohol: "Occasionally",
      smoking: "Never",
      diet: "Unbalanced",
      socialSupport: 5,
      restingHr: 82,
      hrv: 38,
      spo2: 97,
      steps: 4000,
    },
    results: {
      depression: 68,
      anxiety: 75,
      sleep: 72,
    },
  },
  {
    userEmail: "user@gmail.com",
    inputs: {
      age: 28,
      gender: "Male",
      heightCm: 178,
      weightKg: 78,
      sleepHours: 7.5,
      sleepQuality: 8,
      bedtimeRegularity: 8,
      awakenings: 0,
      stress: 3,
      anxietyScore: 2,
      moodScore: 8,
      activityMinutes: 45,
      screenTimeHours: 3,
      socialMediaHours: 1.5,
      caffeineCups: 1,
      alcohol: "Occasionally",
      smoking: "Never",
      diet: "Balanced",
      socialSupport: 8,
      restingHr: 68,
      hrv: 62,
      spo2: 99,
      steps: 9500,
    },
    results: {
      depression: 22,
      anxiety: 18,
      sleep: 25,
    },
  },
];

async function seed() {
  await connectDB();

  for (const user of DEFAULT_USERS) {
    const exists = await User.findOne({ email: user.email });
    if (!exists) {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      await User.create({ ...user, password: hashedPassword });
      console.log(`Created user: ${user.email}`);
    }
  }

  const predictionCount = await Prediction.countDocuments();
  if (predictionCount === 0) {
    await Prediction.insertMany(DEFAULT_PREDICTIONS);
    console.log(`Inserted ${DEFAULT_PREDICTIONS.length} sample predictions`);
  }

  console.log("Database seeding complete");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
