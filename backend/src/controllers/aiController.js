import { enhanceText } from "../services/wordglowService.js";

export async function enhanceNote(req, res) {
  try {
    const { text, mode = "improve" } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Text is required",
      });
    }

    const allowedModes = [
      "improve",
      "grammar",
      "professional",
      "concise",
      "clarity",
    ];

    if (!allowedModes.includes(mode)) {
      return res.status(400).json({
        message: "Invalid AI improvement mode",
      });
    }

    const result = await enhanceText(text, mode);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error enhancing note:", error);

    res.status(500).json({
      message: "Failed to enhance note",
    });
  }
}