import { FiCheck, FiCircle } from "react-icons/fi";

const priorityStyles = {
  low: "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300",
  medium: "bg-[#f7fee7] text-[#4D7C0F] dark:bg-[#4D7C0F]/25 dark:text-[#d9f99d]",
  high: "bg-red-50 text-red-600 dark:bg-red-950/60 dark:text-red-400",
};

const formatDueDate = (dueDate) => {
  if (!dueDate) return null;
  return new Date(dueDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const TaskCard = ({
  task,
  onDelete,
  isDeleting,
  onToggleStatus,
  isUpdating,
  onEdit,
}) => {
  const isCompleted = task.status === "completed";
  const dueDateLabel = formatDueDate(task.dueDate);
  const nextStatus = isCompleted ? "pending" : "completed";

  return (
    <li
      className={`relative rounded-xl border border-stone-100 px-5 py-5 transition duration-200 hover:bg-[#f7fee7]/40 dark:border-stone-700 dark:hover:bg-stone-800/60 ${isCompleted
          ? "bg-stone-50/70 dark:bg-stone-800/40"
          : "bg-white dark:bg-stone-900"
        }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1 pr-14 sm:pr-0">
          <p
            className={`text-sm font-semibold ${isCompleted
                ? "text-stone-500 line-through dark:text-stone-500"
                : "text-stone-900 dark:text-stone-100"
              }`}
          >
            {task.title}
          </p>

          {task.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-stone-500 dark:text-stone-400">
              {task.description}
            </p>
          ) : null}

          {dueDateLabel ? (
            <p className="mt-2 hidden text-xs text-stone-400 dark:text-stone-500 sm:block">
              Due: {dueDateLabel}
            </p>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end sm:gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onToggleStatus(task._id, nextStatus)}
              disabled={isUpdating}
              aria-busy={isUpdating}
              aria-label={
                isCompleted ? "Mark task as pending" : "Mark task as completed"
              }
              className={`inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium capitalize transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/40 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100 ${isCompleted
                  ? "border-[#c8ef7a] bg-[#d9f99d] text-[#3F680C] hover:border-[#b6e060] hover:bg-[#c8ef7a] dark:border-[#4D7C0F]/50 dark:bg-[#4D7C0F]/40 dark:text-[#d9f99d] dark:hover:border-[#4D7C0F]/70 dark:hover:bg-[#4D7C0F]/55"
                  : "border-stone-200 bg-stone-100 text-stone-600 hover:border-stone-300 hover:bg-stone-200 dark:border-stone-600 dark:bg-stone-700 dark:text-stone-300 dark:hover:border-stone-500 dark:hover:bg-stone-600"
                }`}
            >
              {isUpdating ? (
                "Updating..."
              ) : (
                <>
                  {isCompleted ? (
                    <FiCheck size={14} aria-hidden="true" strokeWidth={2.5} />
                  ) : (
                    <FiCircle size={14} aria-hidden="true" />
                  )}
                  {task.status}
                </>
              )}
            </button>

            <span
              className={`inline-flex w-[4.5rem] items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${priorityStyles[task.priority] || priorityStyles.medium
                }`}
            >
              {task.priority}
            </span>

            {dueDateLabel ? (
              <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-600 sm:hidden dark:bg-stone-700 dark:text-stone-300">
                Due {dueDateLabel}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit task ${task.title}`}
            className="absolute top-5 right-5 text-xs font-medium text-[#4D7C0F] transition duration-200 hover:text-[#3F680C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/40 sm:static"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            disabled={isDeleting}
            aria-busy={isDeleting}
            aria-label={`Delete task ${task.title}`}
            className="self-end text-xs font-medium text-red-600 transition duration-200 hover:text-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200 disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto dark:text-red-400 dark:hover:text-red-300"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </li>
  );
};

export default TaskCard;
