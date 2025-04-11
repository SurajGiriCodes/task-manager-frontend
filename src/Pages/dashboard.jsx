import React, { useState } from "react";
import TiptapEditor from "../component/TiptapEditor";
import "../App.css";
import api from "../api";
import TasksList from "../component/Tasks";

function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [due_date, setDueDate] = useState("");
  const [editorKey, setEditorKey] = useState(Date.now());
  const [refreshTasks, setRefreshTasks] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !due_date) {
      alert("Please fill all fields");
      return;
    }
    const newTask = { title, description, due_date };
    console.log("Before create task", newTask);

    try {
      const res = await api.post("/tasks", newTask);
      console.log("Task Created:", res.data);

      // Reset Form
      setTitle("");
      setDescription("");
      setDueDate("");
      setEditorKey(Date.now());
      setRefreshTasks((prev) => prev + 1);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error creating task:", error);
      alert("Something went wrong while creating the task");
    }

    setTitle("");
    setDescription("");
    setDueDate("");
    setEditorKey(Date.now());
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 p-4 max-w-6xl mx-auto min-h-[calc(100vh-8rem)]">
        <div className="md:w-2/3 h-full">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6  w-full  mx-auto space-y-4"
          >
            <h2 className="text-2xl font-bold text-center text-Black-700 mb-4">
              Add new Task
            </h2>
            {showSuccess && (
              <div
                className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <strong className="font-bold">Success!</strong>
                <span className="block sm:inline">
                  {" "}
                  Task added successfully.
                </span>
                <button
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setShowSuccess(false)}
                >
                  <span className="text-green-500">×</span>
                </button>
              </div>
            )}
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Task Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter task title"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <div className="prose prose-sm max-w-none border border-gray-300 rounded-lg">
                  <TiptapEditor
                    key={editorKey}
                    id="description"
                    value={description}
                    onChange={(html) => setDescription(html)}
                    className="w-full border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500"
                    editorProps={{
                      attributes: {
                        class: "prose-sm p-3 min-h-[200px] focus:outline-none",
                      },
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Due Date
                </label>
                <input
                  id="due_date"
                  type="date"
                  className="w-50 border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  value={due_date}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="hidden md:block w-px bg-gray-300 mx-4"></div>
        <div className="md:w-1/2 h-full">
          <TasksList refreshTrigger={refreshTasks} />
        </div>
      </div>
    </>
  );
}

export default TaskForm;
