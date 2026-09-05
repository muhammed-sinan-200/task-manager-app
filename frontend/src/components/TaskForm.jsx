import { useEffect, useState } from "react";
import { createTask, updateTask } from "../api/taskApi";

const formatDueDateForInput = (dueDate) => {
  if (!dueDate) return "";
  const date = new Date(dueDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const TaskForm = ({
  mode = "create",
  task = null,
  onTaskCreated,
  onTaskUpdated,
}) => {
  const isEdit = mode === "edit" && task;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError("");

    if (isEdit) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "medium");
      setDueDate(formatDueDateForInput(task.dueDate));
      return;
    }

    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
  }, [mode, task?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const formData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
    };

    setLoading(true);
    try {
      if (isEdit) {
        await updateTask(task._id, formData);
        if (onTaskUpdated) onTaskUpdated();
      } else {
        await createTask(formData);

        setTitle("");
        setDescription("");
        setPriority("medium");
        setDueDate("");

        if (onTaskCreated) onTaskCreated();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        (isEdit
          ? "Unable to save your task. Please try again."
          : "Unable to create your task. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm outline-none transition duration-200 placeholder:text-stone-400 hover:border-stone-300 focus:border-[#4D7C0F] focus:ring-2 focus:ring-[#4D7C0F]/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-500";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5 dark:border-stone-700 dark:bg-stone-900 dark:shadow-none"
      aria-busy={loading}
    >
      <h2 className="mb-4 text-sm font-medium text-stone-700 dark:text-stone-300">
        {isEdit ? "Edit task" : "Add task"}
      </h2>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
        >
          {error}
        </p>
      )}

      <div className="space-y-3">
        <div>
          <label
            htmlFor="task-title"
            className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Title
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className={inputClass}
            placeholder="Task title"
          />
        </div>

        <div>
          <label
            htmlFor="task-description"
            className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300"
          >
            Description
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            rows={3}
            className={`${inputClass} resize-y`}
            placeholder="Optional description"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="task-priority"
              className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300"
            >
              Priority
            </label>
            <select
              id="task-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
              className={inputClass}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="task-due-date"
              className="mb-1 block text-sm font-medium text-stone-700 dark:text-stone-300"
            >
              Due date
            </label>
            <input
              id="task-due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={loading}
              className={inputClass}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="mt-4 w-full rounded-xl bg-[#4D7C0F] py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#3F680C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-5 dark:focus-visible:ring-offset-stone-900"
      >
        {loading
          ? isEdit
            ? "Saving..."
            : "Creating..."
          : isEdit
            ? "Save changes"
            : "Add task"}
      </button>
    </form>
  );
};

export default TaskForm;
