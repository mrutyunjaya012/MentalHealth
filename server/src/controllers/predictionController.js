import { Prediction } from "../models/Prediction.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getPredictions = asyncHandler(async (_req, res) => {
  const predictions = await Prediction.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: predictions.length,
    data: predictions.map((p) => p.toJSON()),
  });
});

export const getPredictionsByUser = asyncHandler(async (req, res) => {
  const predictions = await Prediction.find({
    userEmail: req.params.email.toLowerCase(),
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: predictions.length,
    data: predictions.map((p) => p.toJSON()),
  });
});

export const getPredictionById = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findById(req.params.id);

  if (!prediction) {
    res.status(404);
    throw new Error("Prediction not found");
  }

  res.status(200).json({
    success: true,
    data: prediction.toJSON(),
  });
});

export const createPrediction = asyncHandler(async (req, res) => {
  const { userEmail, inputs, results } = req.body;

  if (!userEmail || !inputs || !results) {
    res.status(400);
    throw new Error("userEmail, inputs, and results are required");
  }

  const prediction = await Prediction.create({
    userEmail,
    inputs,
    results,
  });

  res.status(201).json({
    success: true,
    message: "Prediction created successfully",
    data: prediction.toJSON(),
  });
});

export const updatePrediction = asyncHandler(async (req, res) => {
  const { inputs, results } = req.body;

  const prediction = await Prediction.findByIdAndUpdate(
    req.params.id,
    { ...(inputs && { inputs }), ...(results && { results }) },
    { new: true, runValidators: true }
  );

  if (!prediction) {
    res.status(404);
    throw new Error("Prediction not found");
  }

  res.status(200).json({
    success: true,
    message: "Prediction updated successfully",
    data: prediction.toJSON(),
  });
});

export const deletePrediction = asyncHandler(async (req, res) => {
  const prediction = await Prediction.findByIdAndDelete(req.params.id);

  if (!prediction) {
    res.status(404);
    throw new Error("Prediction not found");
  }

  res.status(200).json({
    success: true,
    message: "Prediction deleted successfully",
  });
});
