"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Sparkles,
  LayoutDashboard,
  Search,
  Plus,
  Trash2,
  BookOpenText,
  Wand2,
  Hash,
  Loader2,
  X,
  LogOut,
  Pencil,
} from "lucide-react";

export default function Dashboard() {
  const [notes, setNotes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [aiResult, setAiResult] = useState<any>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    if (!title || !content) return alert("Empty fields!");

    try {
      if (editingNote) {
        await api.put(`/notes/${editingNote.id}`, { title, content });
      } else {
        await api.post("/notes", { title, content });
      }
      closeModal();
      fetchNotes();
    } catch (e) {
      alert("Error saving note");
    }
  };

  const deleteNote = async (id: string) => {
    if (!confirm("Delete note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (e) {
      alert("Delete failed");
    }
  };

  const handleAi = async (note: any, action: string) => {
    setProcessingId(`${note.id}-${action}`);

    try {
      const res = await api.post("/ai/process", {
        content: note.content,
        action,
      });

      if (action === "tags") {
        fetchNotes();
      } else {
        setAiResult({
          title: action.toUpperCase(),
          text: res.data.result,
        });
      }
    } catch (e) {
      console.error(e);
      alert("AI failed");
    } finally {
      setProcessingId(null);
    }
  };

  const openEditModal = (note: any) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
    setTitle("");
    setContent("");
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0B1E] text-white flex">
      <aside className="w-64 border-r border-white/5 bg-white/[0.02] p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10 text-xl font-bold italic">
          <Sparkles className="text-blue-500" /> AI Notes
        </div>

        <button className="flex items-center gap-3 p-3 bg-blue-600/10 text-blue-400 rounded-xl mb-auto">
          <LayoutDashboard /> Dashboard
        </button>

        <button className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/5 rounded-xl">
          <LogOut /> Logout
        </button>
      </aside>

      <main className="flex-1 p-10">
        <header className="flex gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 text-gray-500" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 pl-12 outline-none"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 px-6 py-3 rounded-2xl font-bold flex gap-2"
          >
            <Plus /> New Note
          </button>
        </header>

        {loading ? (
          <Loader2 className="animate-spin mx-auto mt-20" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredNotes.map((n) => (
              <div
                key={n.id}
                className="bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] flex flex-col h-72 relative"
              >
                <h3 className="font-bold text-lg mb-2">{n.title}</h3>

                <p className="text-gray-400 text-sm flex-1 overflow-hidden line-clamp-3">
                  {n.content}
                </p>

                <div className="flex flex-wrap gap-2 my-2">
                  {n.tags?.map((t: string) => (
                    <span
                      key={t}
                      className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-white/5 mt-auto">
                  <div className="flex gap-2">
                    <button onClick={() => handleAi(n, "summarize")}>
                      <BookOpenText size={16} />
                    </button>
                    <button onClick={() => handleAi(n, "improve")}>
                      <Wand2 size={16} />
                    </button>
                    <button onClick={() => handleAi(n, "tags")}>
                      <Hash size={16} />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(n)}>
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => deleteNote(n.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {processingId === `${n.id}-summarize` ||
                processingId === `${n.id}-improve` ||
                processingId === `${n.id}-tags` ? (
                  <Loader2 className="animate-spin absolute top-4 right-4 text-blue-500" />
                ) : null}
              </div>
            ))}
          </div>
        )}
      </main>

      {aiResult && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6">
          <div className="bg-[#161B33] p-10 rounded-[2rem] max-w-xl w-full relative">
            <button
              onClick={() => setAiResult(null)}
              className="absolute top-5 right-5"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4 text-blue-400">
              {aiResult.title} Result
            </h2>

            <p className="bg-white/5 p-4 rounded-xl text-gray-300">
              {aiResult.text}
            </p>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6">
          <div className="bg-[#161B33] p-8 rounded-[2rem] w-full max-w-md">
            <h2 className="text-xl font-bold mb-6">
              {editingNote ? "Edit Note" : "New Note"}
            </h2>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-white/5 p-3 rounded-xl mb-4"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content..."
              className="w-full bg-white/5 p-3 rounded-xl h-40 mb-6"
            />

            <div className="flex gap-3">
              <button onClick={closeModal} className="flex-1 p-3 bg-white/5">
                Cancel
              </button>

              <button
                onClick={saveNote}
                className="flex-[2] p-3 bg-blue-600 font-bold"
              >
                {editingNote ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}