import { enhanceText } from "../services/wordglowService.js";

export async function enhanceNote(req, res) {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Text is required",
      });
    }

    const result = await enhanceText(text);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error enhancing note:", error);

    res.status(500).json({
      message: "Failed to enhance note",
    });
  }
}