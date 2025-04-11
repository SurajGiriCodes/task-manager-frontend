import React, { useState, useEffect } from "react";
import api from "../api";
import Swal from "sweetalert2";

const TasksList = ({ refreshTrigger }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [refreshTrigger]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get("/tasks");
      setTasks(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      console.error("Error fetching tasks:", err);
    }
  };

  const handleDelete = async (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/tasks/${taskId}`);
          setTasks(tasks.filter((task) => task.id !== taskId));
          Swal.fire("Deleted!", "Your task has been deleted.", "success");
        } catch (err) {
          Swal.fire("Error!", "Failed to delete task.", "error");
        }
      }
    });
  };

  if (loading) return <div className="text-center py-4">Loading tasks...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Your Tasks</h2>
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          {successMessage}
        </div>
      )}

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks found. Create your first task!</p>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{task.title}</h3>
              <button
                onClick={() => handleDelete(task.id)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
                aria-label="Delete task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div
              className="prose prose-sm mt-2"
              dangerouslySetInnerHTML={{ __html: task.description }}
            />
            <p className="text-sm text-gray-500 mt-2">
              Due: {new Date(task.due_date).toLocaleDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default TasksList;
