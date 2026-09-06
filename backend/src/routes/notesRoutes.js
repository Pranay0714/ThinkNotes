import express from 'express';
import { createNotes, getallNotes, updateNotes, deleteNote, getNoteById } from '../controllers/notesController.js';
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getallNotes);
router.get("/:id", protect, getNoteById);
router.post("/", protect,createNotes);
router.put("/:id", protect, updateNotes);
router.delete("/:id", protect, deleteNote);


export default router;



// app.delete("/api/notes/:id", (req, res) => {
//     res.json({message: "note deleted"});
// });