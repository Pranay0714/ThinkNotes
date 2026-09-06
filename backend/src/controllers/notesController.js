import Note from "../models/Notes.js";

// Get all notes of logged-in user
export async function getallNotes(req, res) {
  try {
    const notes = await Note.find({
      user: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes", error);
    res.status(500).json({
      message: "Error fetching notes",
    });
  }
}

// Get a specific note of logged-in user
export async function getNoteById(req, res) {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!note) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error fetching note", error);
    res.status(500).json({
      message: "Error fetching note",
    });
  }
}

// Create note for logged-in user
export async function createNotes(req, res) {
  try {
    const { title, content } = req.body;

    const note = new Note({
      title,
      content,
      user: req.user.userId,
    });

    const savedNote = await note.save();

    res.status(201).json(savedNote);
  } catch (error) {
    console.error("Error creating note", error);
    res.status(500).json({
      message: "Error creating note",
    });
  }
}

// Update only logged-in user's note
export async function updateNotes(req, res) {
  try {
    const { title, content } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        title,
        content,
      },
      {
        new: true,
      }
    );

    if (!updatedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error updating note", error);
    res.status(500).json({
      message: "Error updating note",
    });
  }
}

// Delete only logged-in user's note
export async function deleteNote(req, res) {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!deletedNote) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.status(200).json({
      message: "Note deleted",
    });
  } catch (error) {
    console.error("Error deleting note", error);
    res.status(500).json({
      message: "Error deleting note",
    });
  }
}