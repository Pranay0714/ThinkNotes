import express from 'express';
import { createNotes, getallNotes, updateNotes, deleteNote, getNoteById } from '../controllers/notesController.js';

const router = express.Router();

router.get("/", getallNotes);
router.get("/:id", getNoteById);
router.post("/",createNotes);
router.put("/:id", updateNotes);
router.delete("/:id", deleteNote);


export default router;



// app.delete("/api/notes/:id", (req, res) => {
//     res.json({message: "note deleted"});
// });