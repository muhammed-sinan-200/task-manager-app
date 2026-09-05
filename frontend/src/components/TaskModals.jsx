import { useEffect } from "react";
import { FiX } from "react-icons/fi";
import TaskForm from "./TaskForm";

const TaskModals = ({
  modalOpen,
  modalVisible,
  selectedTask,
  isEditMode,
  onCloseModal,
  onTaskCreated,
  onTaskUpdated,
  deleteModalOpen,
  deleteModalVisible,
  taskToDelete,
  deletingId,
  onCloseDeleteModal,
  onConfirmDelete,
}) => {
  useEffect(() => {
    if (!modalOpen && !deleteModalOpen) return;

    const onKeyDown = (e) => {
      if (e.key !== "Escape") return;
      if (deleteModalOpen) {
        if (deletingId) return;
        onCloseDeleteModal();
        return;
      }
      if (modalOpen) onCloseModal();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modalOpen, deleteModalOpen, deletingId, onCloseModal, onCloseDeleteModal]);

  useEffect(() => {
    if (!modalOpen && !deleteModalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen, deleteModalOpen]);

  return (
    <>
      {modalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${modalVisible ? "opacity-100" : "opacity-0"
            } transition-opacity duration-200`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="task-modal-title"
        >
          <button
            type="button"
            aria-label="Close modal"
            onClick={onCloseModal}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] transition-opacity duration-200 dark:bg-black/60"
          />

          <div
            className={`relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-stone-200/80 bg-[#f7fee7] p-5 shadow-[0_20px_50px_-24px_rgba(28,25,23,0.45)] transition duration-200 ease-out sm:p-6 dark:border-stone-600 dark:bg-stone-900 dark:shadow-black/50 ${modalVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-2 scale-95 opacity-0"
              }`}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2
                  id="task-modal-title"
                  className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100"
                >
                  {isEditMode ? "Edit Task" : "Create Task"}
                </h2>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                  {isEditMode
                    ? "Update the details of this task."
                    : "Add a new task to your list."}
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseModal}
                className="shrink-0 rounded-lg p-1.5 text-[#4D7C0F] transition duration-200 hover:bg-[#d9f99d] hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/30 dark:hover:bg-stone-800 dark:hover:text-[#d9f99d]"
                aria-label="Close"
              >
                <FiX size={18} aria-hidden="true" />
              </button>
            </div>

            {isEditMode ? (
              <TaskForm
                mode="edit"
                task={selectedTask}
                onTaskUpdated={onTaskUpdated}
              />
            ) : (
              <TaskForm onTaskCreated={onTaskCreated} />
            )}
          </div>
        </div>
      )}

      {deleteModalOpen && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${deleteModalVisible ? "opacity-100" : "opacity-0"
            } transition-opacity duration-200`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-task-title"
        >
          <button
            type="button"
            aria-label="Close delete confirmation"
            onClick={onCloseDeleteModal}
            disabled={Boolean(deletingId)}
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] transition-opacity duration-200 disabled:cursor-not-allowed dark:bg-black/60"
          />

          <div
            className={`relative z-10 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-stone-200/80 bg-[#f7fee7] p-5 shadow-[0_20px_50px_-24px_rgba(28,25,23,0.45)] transition duration-200 ease-out sm:p-6 dark:border-stone-600 dark:bg-stone-900 dark:shadow-black/50 ${deleteModalVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-2 scale-95 opacity-0"
              }`}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2
                  id="delete-task-title"
                  className="text-lg font-semibold tracking-tight text-stone-900 dark:text-stone-100"
                >
                  Delete task?
                </h2>
                <p className="mt-1 text-sm break-words text-stone-500 dark:text-stone-400">
                  Are you sure you want to delete{" "}
                  <span className="font-medium text-stone-700 dark:text-stone-200">
                    &ldquo;{taskToDelete?.title}&rdquo;
                  </span>
                  ? This cannot be undone.
                </p>
              </div>
              <button
                type="button"
                onClick={onCloseDeleteModal}
                disabled={Boolean(deletingId)}
                className="shrink-0 rounded-lg p-1.5 text-[#4D7C0F] transition duration-200 hover:bg-[#d9f99d] hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/30 disabled:cursor-not-allowed disabled:opacity-60 dark:hover:bg-stone-800 dark:hover:text-[#d9f99d]"
                aria-label="Close"
              >
                <FiX size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCloseDeleteModal}
                disabled={Boolean(deletingId)}
                className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition duration-200 hover:bg-stone-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/30 disabled:cursor-not-allowed disabled:opacity-60 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                disabled={Boolean(deletingId)}
                aria-busy={Boolean(deletingId)}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deletingId ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TaskModals;
