// Mock Database Layer using localStorage
const KEYS = {
  USERS: "neuro_predict_users",
  PREDICTIONS: "neuro_predict_predictions",
};

const DEFAULT_USERS = [
  {
    name: "System Admin",
    email: "admin@gmail.com",
    password: "admin123",
    role: "admin",
    joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
  },
  {
    name: "John Doe",
    email: "user@gmail.com",
    password: "user123",
    role: "user",
    joinedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
];

const DEFAULT_PREDICTIONS = [
  {
    id: "pred_1",
    userEmail: "user@gmail.com",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
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
    id: "pred_2",
    userEmail: "user@gmail.com",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
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

// Helper functions for safe localStorage operations
function getItem(key, defaultValue) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

// Initialization of DB tables
export function initDB() {
  if (!localStorage.getItem(KEYS.USERS)) {
    setItem(KEYS.USERS, DEFAULT_USERS);
  }
  if (!localStorage.getItem(KEYS.PREDICTIONS)) {
    setItem(KEYS.PREDICTIONS, DEFAULT_PREDICTIONS);
  }
}

// Run immediately on import
initDB();

export const db = {
  users: {
    list: () => {
      return getItem(KEYS.USERS, []);
    },
    findByEmail: (email) => {
      const users = getItem(KEYS.USERS, []);
      return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    },
    create: (newUser) => {
      const users = getItem(KEYS.USERS, []);
      const exists = users.some(
        (u) => u.email.toLowerCase() === newUser.email.toLowerCase()
      );
      if (exists) {
        throw new Error("A user with this email address already exists.");
      }
      const userRecord = {
        ...newUser,
        email: newUser.email.toLowerCase(),
        joinedAt: new Date().toISOString(),
      };
      users.push(userRecord);
      setItem(KEYS.USERS, users);
      return userRecord;
    },
    delete: (email) => {
      const users = getItem(KEYS.USERS, []);
      const filtered = users.filter(
        (u) => u.email.toLowerCase() !== email.toLowerCase()
      );
      setItem(KEYS.USERS, filtered);
      return true;
    },
    updateRole: (email, newRole) => {
      const users = getItem(KEYS.USERS, []);
      const updated = users.map((u) => {
        if (u.email.toLowerCase() === email.toLowerCase()) {
          return { ...u, role: newRole };
        }
        return u;
      });
      setItem(KEYS.USERS, updated);
      return true;
    },
  },
  predictions: {
    list: () => {
      return getItem(KEYS.PREDICTIONS, []);
    },
    listByUser: (email) => {
      const predictions = getItem(KEYS.PREDICTIONS, []);
      return predictions
        .filter((p) => p.userEmail.toLowerCase() === email.toLowerCase())
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Newest first
    },
    create: (newPrediction) => {
      const predictions = getItem(KEYS.PREDICTIONS, []);
      const predictionRecord = {
        ...newPrediction,
        id: `pred_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
      };
      predictions.push(predictionRecord);
      setItem(KEYS.PREDICTIONS, predictions);
      return predictionRecord;
    },
    clear: () => {
      setItem(KEYS.PREDICTIONS, []);
      return true;
    },
    delete: (id) => {
      const predictions = getItem(KEYS.PREDICTIONS, []);
      const filtered = predictions.filter((p) => p.id !== id);
      setItem(KEYS.PREDICTIONS, filtered);
      return true;
    },
  },
};
