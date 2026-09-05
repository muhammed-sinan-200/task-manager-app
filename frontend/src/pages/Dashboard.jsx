import { useState } from "react";
import { FiPlus, FiSearch, FiX } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import useTasks from "../hooks/useTasks";
import TaskCard from "../components/TaskCard";
import TaskModals from "../components/TaskModals";

const Dashboard = () => {
  const { user } = useAuth();
  const {
    tasks,
    pagination,
    stats,
    search,
    statusFilter,
    initialLoading,
    isRefreshing,
    hasLoaded,
    error,
    actionError,
    deletingId,
    updatingId,
    hasActiveSearch,
    hasActiveQuery,
    totalPages,
    currentPage,
    hasPrevPage,
    hasNextPage,
    fetchTasks,
    handleToggleStatus,
    removeTask,
    handleSearchChange,
    handleStatusFilterChange,
    goToPrevPage,
    goToNextPage,
    handleRetry,
    clearFilters,
    setSearch,
    setPage,
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const isEditMode = Boolean(selectedTask);

  const openCreateModal = () => {
    setSelectedTask(null);
    setModalOpen(true);
    requestAnimationFrame(() => setModalVisible(true));
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
    requestAnimationFrame(() => setModalVisible(true));
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      setModalOpen(false);
      setSelectedTask(null);
    }, 200);
  };

  const handleTaskCreated = async () => {
    closeModal();
    await fetchTasks();
  };

  const handleTaskUpdated = async () => {
    closeModal();
    await fetchTasks();
  };

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setDeleteModalOpen(true);
    requestAnimationFrame(() => setDeleteModalVisible(true));
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setTimeout(() => {
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    }, 200);
  };

  const confirmDelete = async () => {
    if (!taskToDelete) return;

    const success = await removeTask(taskToDelete._id);
    if (success) {
      closeDeleteModal();
      await fetchTasks();
    }
  };

  const completionPercent =
    stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="relative min-h-screen bg-[#F7F8F4] px-4 py-8 sm:py-10 dark:bg-stone-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#d9f99d] dark:bg-[#4D7C0F]/15"
      />

      <div className="relative mx-auto max-w-3xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-wide text-[#4D7C0F]">
              Task Manager
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              My Tasks
            </h1>
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              {user?.name
                ? `Stay on top of your work, ${user.name}.`
                : "Stay on top of your work."}
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#4D7C0F] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#3F680C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/40 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-stone-950"
          >
            <FiPlus size={16} aria-hidden="true" />
            Add Task
          </button>
        </header>

        {actionError && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/50 dark:text-red-400"
          >
            {actionError}
          </p>
        )}

        {initialLoading && (
          <div
            className="mt-8 rounded-2xl border border-stone-200/80 bg-white px-5 py-16 text-center shadow-[0_12px_40px_-24px_rgba(28,25,23,0.35)] dark:border-stone-700 dark:bg-stone-900 dark:shadow-black/40"
            aria-busy="true"
            aria-live="polite"
          >
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#d9f99d] border-t-[#4D7C0F]"
              aria-hidden="true"
            />
            <p className="mt-4 text-sm font-medium text-stone-800 dark:text-stone-100">
              Loading your tasks
            </p>
            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
              Fetching your latest work…
            </p>
          </div>
        )}

        {!initialLoading && error && !hasLoaded && (
          <div
            role="alert"
            className="mt-8 rounded-2xl border border-red-100 bg-white px-5 py-12 text-center shadow-[0_12px_40px_-24px_rgba(28,25,23,0.35)] dark:border-red-900 dark:bg-stone-900 dark:shadow-black/40"
          >
            <p className="text-sm font-medium text-stone-800 dark:text-stone-100">
              Couldn&apos;t load tasks
            </p>
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#4D7C0F] px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[#3F680C]"
            >
              Try again
            </button>
          </div>
        )}

        {!initialLoading && hasLoaded && (
          <>
            <div className="mt-8 rounded-2xl border border-stone-200/80 bg-white px-5 py-4 shadow-[0_12px_40px_-24px_rgba(28,25,23,0.35)] dark:border-stone-700 dark:bg-stone-900 dark:shadow-black/40">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Progress
                </p>
                <p className="text-sm font-semibold text-[#4D7C0F]">
                  {completionPercent}% complete
                </p>
              </div>
              <div
                className="mt-3 h-2 overflow-hidden rounded-full bg-[#d9f99d]/70 dark:bg-[#4D7C0F]/30"
                role="progressbar"
                aria-valuenow={completionPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Task completion"
              >
                <div
                  className="h-full rounded-full bg-[#4D7C0F] transition-all duration-300 ease-out"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-stone-500 dark:text-stone-400">
                {stats.completed} of {stats.total} tasks completed
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="task-search" className="sr-only">
                  Search tasks by title
                </label>
                <div className="relative">
                  <FiSearch
                    className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-stone-400 dark:text-stone-500"
                    size={16}
                    aria-hidden="true"
                  />
                  <input
                    id="task-search"
                    type="search"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search tasks by title..."
                    className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pr-10 pl-10 text-sm text-stone-900 shadow-sm outline-none transition duration-200 placeholder:text-stone-400 hover:border-stone-300 focus:border-[#4D7C0F] focus:ring-2 focus:ring-[#4D7C0F]/20 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 dark:hover:border-stone-500"
                  />
                  {hasActiveSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setPage(1);
                      }}
                      className="absolute top-1/2 right-3 -translate-y-1/2 rounded-md p-1 text-stone-400 transition duration-200 hover:text-stone-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/30 dark:hover:text-stone-200"
                      aria-label="Clear search"
                    >
                      <FiX size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>

              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Filter tasks by status"
              >
                {[
                  { value: "", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "completed", label: "Completed" },
                ].map((filter) => {
                  const isActive = statusFilter === filter.value;

                  return (
                    <button
                      key={filter.label}
                      type="button"
                      onClick={() => handleStatusFilterChange(filter.value)}
                      aria-pressed={isActive}
                      className={`rounded-xl px-3.5 py-2 text-sm font-medium transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/40 ${isActive
                          ? "bg-[#4D7C0F] text-white shadow-sm"
                          : "border border-stone-200 bg-white text-stone-600 hover:border-stone-300 hover:bg-[#f7fee7] dark:border-stone-600 dark:bg-stone-900 dark:text-stone-300 dark:hover:border-stone-500 dark:hover:bg-stone-800"
                        }`}
                    >
                      {filter.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <section className="mt-4 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[0_12px_40px_-24px_rgba(28,25,23,0.35)] dark:border-stone-700 dark:bg-stone-900 dark:shadow-black/40">
              <div className="flex items-center justify-between gap-3 border-b border-stone-100 px-5 py-4 dark:border-stone-700">
                <h2 className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  {pagination
                    ? `${pagination.total} task${pagination.total === 1 ? "" : "s"}`
                    : "Tasks"}
                  {hasActiveQuery ? " found" : ""}
                </h2>
                {isRefreshing && (
                  <p className="text-xs font-medium text-[#4D7C0F]" aria-live="polite">
                    Updating…
                  </p>
                )}
              </div>

              <div
                className={`transition-opacity duration-200 ${isRefreshing ? "opacity-60" : "opacity-100"
                  }`}
              >
                {tasks.length === 0 ? (
                  <div className="px-5 py-14 text-center">
                    {hasActiveQuery ? (
                      <>
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f7fee7] text-[#4D7C0F] dark:bg-[#4D7C0F]/25">
                          <FiSearch size={18} aria-hidden="true" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-stone-800 dark:text-stone-100">
                          No matching tasks
                        </p>
                        <p className="mx-auto mt-1 max-w-sm text-sm text-stone-500 dark:text-stone-400">
                          {hasActiveSearch
                            ? `Nothing matched "${search.trim()}"${statusFilter ? ` in ${statusFilter}` : ""
                            }. Try another keyword or clear filters.`
                            : `You don't have any ${statusFilter} tasks right now.`}
                        </p>
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="mt-5 inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-700 transition duration-200 hover:bg-stone-50 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                        >
                          Clear filters
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#f7fee7] text-[#4D7C0F] dark:bg-[#4D7C0F]/25">
                          <FiPlus size={18} aria-hidden="true" />
                        </div>
                        <p className="mt-4 text-sm font-medium text-stone-800 dark:text-stone-100">
                          No tasks yet
                        </p>
                        <p className="mx-auto mt-1 max-w-sm text-sm text-stone-500 dark:text-stone-400">
                          Create your first task to start tracking your work.
                        </p>
                        <button
                          type="button"
                          onClick={openCreateModal}
                          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#4D7C0F] px-4 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-[#3F680C]"
                        >
                          <FiPlus size={16} aria-hidden="true" />
                          Add Task
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <ul className="space-y-2 px-3 py-3 sm:px-4 sm:py-4">
                    {tasks.map((task) => (
                      <TaskCard
                        key={task._id}
                        task={task}
                        onDelete={openDeleteModal}
                        isDeleting={deletingId === task._id}
                        onToggleStatus={handleToggleStatus}
                        isUpdating={updatingId === task._id}
                        onEdit={openEditModal}
                      />
                    ))}
                  </ul>
                )}
              </div>
            </section>

            {pagination && totalPages > 1 && (
              <nav
                className="mt-4 flex flex-col items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-white px-4 py-3 shadow-[0_12px_40px_-24px_rgba(28,25,23,0.35)] sm:flex-row sm:px-5 dark:border-stone-700 dark:bg-stone-900 dark:shadow-black/40"
                aria-label="Task list pagination"
              >
                <p className="text-sm text-stone-500 dark:text-stone-400" aria-live="polite">
                  Page {currentPage} of {totalPages}
                </p>

                <div className="flex w-full items-center gap-2 sm:w-auto">
                  <button
                    type="button"
                    onClick={goToPrevPage}
                    disabled={!hasPrevPage || isRefreshing}
                    className="flex-1 rounded-xl border border-stone-200 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition duration-200 hover:bg-[#f7fee7] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/40 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none dark:border-stone-600 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={goToNextPage}
                    disabled={!hasNextPage || isRefreshing}
                    className="flex-1 rounded-xl bg-[#4D7C0F] px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-[#3F680C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4D7C0F]/40 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                  >
                    Next
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </div>

      <TaskModals
        modalOpen={modalOpen}
        modalVisible={modalVisible}
        selectedTask={selectedTask}
        isEditMode={isEditMode}
        onCloseModal={closeModal}
        onTaskCreated={handleTaskCreated}
        onTaskUpdated={handleTaskUpdated}
        deleteModalOpen={deleteModalOpen}
        deleteModalVisible={deleteModalVisible}
        taskToDelete={taskToDelete}
        deletingId={deletingId}
        onCloseDeleteModal={closeDeleteModal}
        onConfirmDelete={confirmDelete}
      />
    </div>
  );
};

export default Dashboard;
