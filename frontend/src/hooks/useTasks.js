import { useEffect, useRef, useState } from "react";
import {
  deleteTask as deleteTaskRequest,
  getTasks,
  updateTask,
} from "../api/taskApi";

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [initialLoading, setInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const isInitialLoad = useRef(true);
  const prevSearchRef = useRef(search);
  const fetchRequestIdRef = useRef(0);

  const hasActiveSearch = search.trim().length > 0;
  const hasActiveQuery = hasActiveSearch || Boolean(statusFilter);

  const totalPages = pagination?.totalPages || 0;
  const currentPage = pagination?.page || page;
  const hasPrevPage = pagination?.hasPrevPage ?? currentPage > 1;
  const hasNextPage =
    pagination?.hasNextPage ?? (totalPages > 0 && currentPage < totalPages);

  const fetchTasks = async ({ showLoader = false } = {}) => {
    const requestId = ++fetchRequestIdRef.current;

    if (showLoader || !hasLoaded) {
      setInitialLoading(true);
    } else {
      setIsRefreshing(true);
    }

    try {
      const params = { page };
      if (hasActiveSearch) params.search = search.trim();
      if (statusFilter) params.status = statusFilter;

      const data = await getTasks(params);

      if (requestId !== fetchRequestIdRef.current) return;

      setTasks(data.tasks || []);
      setPagination(data.pagination || null);
      setStats(data.stats || { total: 0, completed: 0, pending: 0 });
      setError("");
      setHasLoaded(true);
    } catch (err) {
      if (requestId !== fetchRequestIdRef.current) return;

      const message =
        err.response?.data?.message || err.message || "Failed to load tasks";

      if (
        page > 1 &&
        typeof message === "string" &&
        message.toLowerCase().includes("exceeds total pages")
      ) {
        setPage((prev) => Math.max(1, prev - 1));
        return;
      }

      if (!hasLoaded) {
        setError(message);
      } else {
        setActionError(message);
      }
    } finally {
      if (requestId !== fetchRequestIdRef.current) return;
      setInitialLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleToggleStatus = async (taskId, status) => {
    if (updatingId) return;

    setActionError("");
    setUpdatingId(taskId);

    try {
      await updateTask(taskId, { status });
      await fetchTasks();
    } catch (err) {
      setActionError(
        err.response?.data?.message || err.message || "Failed to update task"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const removeTask = async (taskId) => {
    if (!taskId || deletingId) return false;

    setActionError("");
    setDeletingId(taskId);

    try {
      await deleteTaskRequest(taskId);
      return true;
    } catch (err) {
      setActionError(
        err.response?.data?.message || err.message || "Failed to delete task"
      );
      return false;
    } finally {
      setDeletingId(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const goToPrevPage = () => {
    if (!hasPrevPage) return;
    setPage((prev) => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    if (!hasNextPage) return;
    setPage((prev) => prev + 1);
  };

  const handleRetry = () => {
    setError("");
    fetchTasks({ showLoader: true });
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPage(1);
  };

  useEffect(() => {
    const searchChanged = prevSearchRef.current !== search;
    prevSearchRef.current = search;
    const delay = searchChanged && hasActiveSearch ? 300 : 0;

    const timer = setTimeout(() => {
      fetchTasks({ showLoader: isInitialLoad.current });
      isInitialLoad.current = false;
    }, delay);

    return () => clearTimeout(timer);
  }, [search, statusFilter, page]);

  return {
    tasks,
    pagination,
    stats,
    search,
    statusFilter,
    page,
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
  };
};

export default useTasks;
