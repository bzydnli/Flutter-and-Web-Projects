import React, { useEffect, useMemo, useState } from "react";
import { createTodo } from "../interfaces/ITodo";

const STORAGE_KEY = "my-todos";

export const TodoListPage = () => {

  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

 
  const [filter, setFilter] = useState("all"); 


  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);


  const addTodo = () => {
    const v = inputValue.trim();
    if (!v) {
      setError("Boş görev ekleyemezsin.");
      return;
    }
    setError("");
    setTodos((prev) => [createTodo(v), ...prev]);
    setInputValue("");
  };


  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditingValue("");
    }
  };


  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditingValue(todo.todo);
    setError("");
  };

  const saveEdit = () => {
    const v = editingValue.trim();
    if (!v) {
      setError("Görev metni boş olamaz.");
      return;
    }
    setError("");
    setTodos((prev) =>
      prev.map((t) => (t.id === editingId ? { ...t, todo: v } : t))
    );
    setEditingId(null);
    setEditingValue("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue("");
    setError("");
  };

  
  const clearAll = () => {
    setTodos([]);
    cancelEdit();
  };


  const filteredTodos = useMemo(() => {
    return todos.filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "done") return t.completed;
      return true;
    });
  }, [todos, filter]);


  const remainingCount = useMemo(
    () => todos.filter((t) => !t.completed).length,
    [todos]
  );


  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-6">
      <div className="w-full max-w-lg bg-white border rounded-2xl shadow-sm p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              Todo App Zeydanli
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Ekle - Listele - Güncelle - Sil 
            </p>
          </div>

          <button
            onClick={clearAll}
            type="button"
            className="text-sm underline text-gray-600 hover:text-black"
            title="Tüm görevleri sil"
          >
            Hepsini temizle
          </button>
        </div>

        {/* Input */}
        <div className="mt-5">
          <div className="flex gap-2">
            <input
              className="flex-1 p-2.5 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addTodo();
              }}
              placeholder="Yeni görev ekle..."
            />
            <button
              onClick={addTodo}
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition"
              type="button"
            >
              Ekle
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </div>

        {/* Filtre */}
        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex gap-2">
            {[
                { value: "all", label: "Tümü" },
                { value: "active", label: "Aktif" },
                { value: "done", label: "Tamamlandı" },
            ].map((f) => (
            <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}   
            className={`px-3 py-1.5 rounded-full border text-sm transition ${
                filter === f.value ? "bg-black text-white border-black" : "bg-white"
                }`}
                >
                    {f.label}
                    </button>
                ))}
                </div>


          <p className="text-sm text-gray-500">
            Kalan: <span className="font-medium">{remainingCount}</span> /{" "}
            <span className="font-medium">{todos.length}</span>
          </p>
        </div>

        {/* Liste */}
        <ul className="mt-5 space-y-2">
          {filteredTodos.length === 0 ? (
            <li className="text-gray-500 text-sm border rounded-lg p-4 bg-gray-50">
              {todos.length === 0
                ? "Henüz görev yok. Bir gorev ekle ! "
                : "Bu filtrede gösterilecek görev yok."}
            </li>
          ) : (
            filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between gap-3 p-3 border rounded-xl bg-white"
              >
                {editingId === todo.id ? (
                  <div className="flex gap-2 w-full">
                    <input
                      className="flex-1 p-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                    />
                    <button
                      onClick={saveEdit}
                      className="px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-900 transition"
                      type="button"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-3 py-2 rounded-lg border hover:bg-gray-50 transition"
                      type="button"
                    >
                      İptal
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className="text-left flex-1"
                      type="button"
                      title="Tamamlandı durumunu değiştir"
                    >
                      <span
                        className={`${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                      >
                        {todo.todo}
                      </span>
                    </button>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => startEdit(todo)}
                        className="px-3 py-1.5 rounded-lg border text-sm hover:bg-gray-50 transition"
                        type="button"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="px-3 py-1.5 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 transition"
                        type="button"
                      >
                        Sil
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>

        <p className="text-xs text-gray-400 mt-5">
          İpucu: Göreve tıklayınca tamamlandı olur. Düzenle ile metni güncelleyebilirsin.
        </p>
      </div>
    </div>
  );
};
