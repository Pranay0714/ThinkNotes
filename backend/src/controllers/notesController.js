import Note from "../models/Notes.js";
export async function getallNotes(_, res){
    try {
        const notes = await Note.find().sort({createdAt: -1});
        res.status(200).json(notes);
    } catch (error) {
        console.error("Error fetching notes", error);
        res.status(500).json({message: "Error fetching notes"});
    }
};

export async function getNoteById(req, res){
    try {
        const note = await Note.findById(req.params.id);
        if(!note) return res.status(404).json({message: "Note not found"});
        res.status(200).json(note);
    } catch (error) {
        console.error("Error fetching note", error);
        res.status(500).json({message: "Error fetching note"});
    }
};

export async function createNotes(req, res){
    try {
        const { title, content } = req.body;
        const note = new Note({title, content});

        const savedNote = await note.save();
        res.status(201).json(savedNote);
    } catch (error) {
           console.error("Error fetching notes", error);
        res.status(500).json({message: "Error fetching notes"});
    }
};

export async function updateNotes(req, res){
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findByIdAndUpdate(req.params.id,{title, content},{
            new: true,
        });
        if(!updatedNote) return res.status(404).json({message: "Note not found"});
        res.status(200).json(updatedNote);
    } catch (error) {
        console.error("Error updating note", error);
        res.status(500).json({message: "Error updating note"});
    }
}

export async function deleteNote(req, res){
   try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if(!deletedNote) return res.status(404).json({message: "Note not found"});
    res.status(200).json({message: "Note deleted"});
   } catch (error) {
    console.error("Error deleting note", error);
    res.status(500).json({message: "Error deleting note"});
   }
}