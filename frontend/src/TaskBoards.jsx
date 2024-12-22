import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

// Modal for adding a new task
const TaskModal = ({ isOpen, onClose, onAddTask, projectIndex }) => {
  const [taskName, setTaskName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [taskStatus, setTaskStatus] = useState('todo');

  const handleSubmit = () => {
    if (taskName) {
      onAddTask({ taskName, startDate, deadline, taskStatus }, projectIndex);
      setTaskName('');
      setStartDate('');
      setDeadline('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2>Add Task</h2>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task Name"
          className="border border-gray-300 rounded p-1 w-full"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded p-1 w-full"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border border-gray-300 rounded p-1 w-full"
        />
        <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)} className="border border-gray-300 rounded p-1 w-full">
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="inReview">In Review</option>
          <option value="completed">Completed</option>
        </select>
        <div className="flex justify-end mt-2">
          <button onClick={handleSubmit} className="bg-green-500 text-white rounded px-2">Add Task</button>
          <button onClick={onClose} className="bg-red-500 text-white rounded px-2 ml-2">Cancel</button>
        </div>
      </div>
    </div>
  );
};

// Modal for editing an existing task
const EditTaskModal = ({ isOpen, onClose, onEditTask, task, projectIndex }) => {
  const [taskName, setTaskName] = useState(task ? task.taskName : '');
  const [startDate, setStartDate] = useState(task ? task.startDate : '');
  const [deadline, setDeadline] = useState(task ? task.deadline : '');
  const [taskStatus, setTaskStatus] = useState(task ? task.taskStatus : 'todo');

  const handleSubmit = () => {
    if (taskName) {
      onEditTask({ taskName, startDate, deadline, taskStatus }, projectIndex);
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg">
        <h2>Edit Task</h2>
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Task Name"
          className="border border-gray-300 rounded p-1 w-full"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded p-1 w-full"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="border border-gray-300 rounded p-1 w-full"
        />
        <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)} className="border border-gray-300 rounded p-1 w-full">
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="inReview">In Review</option>
          <option value="completed"> Completed</option>
        </select>
        <div className="flex justify-end mt-2">
          <button onClick={handleSubmit} className="bg-green-500 text-white rounded px-2">Save Changes</button>
          <button onClick={onClose} className="bg-red-500 text-white rounded px-2 ml-2">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const TaskBoards = () => {
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://to-do-interview-buddy-t2hp.vercel.app/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  const handleAddProject = async () => {
    if (newProjectName) {
      try {
        const response = await axios.post('https://to-do-interview-buddy-t2hp.vercel.app/api/projects', { name: newProjectName });
        setProjects((prevProjects) => [...prevProjects, response.data]);
        setNewProjectName('');
      } catch (error) {
        console.error('Error adding project:', error);
      }
    }
  };

  const handleAddTask = async (task, projectIndex) => {
    try {
      const projectId = projects[projectIndex]._id; // Get the project ID
      await axios.post(`https://to-do-interview-buddy-t2hp.vercel.app/api/projects/${projectId}/tasks`, task);
      const updatedProjects = [...projects];
      updatedProjects[projectIndex].tasks[task.taskStatus].push(task);
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async (updatedTask, projectIndex) => {
    const projectId = projects[projectIndex]._id; // Get the project ID
    const taskId = selectedTask._id; // Get the task ID

    try {
      await axios.put(`https://to-do-interview-buddy-t2hp.vercel.app/api/projects/${projectId}/tasks/${taskId}`, updatedTask);
      const updatedProjects = [...projects];
      const currentStatus = selectedTask.taskStatus; // Assuming selectedTask has the status
      const taskIndex = updatedProjects[projectIndex].tasks[currentStatus].findIndex(
        (task) => task._id === taskId
      );

      if (taskIndex !== -1) {
        updatedProjects[projectIndex].tasks[currentStatus][taskIndex] = {
          ...updatedTask,
          taskStatus: currentStatus // Keep the same status
        };
      }

      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (taskId, projectIndex) => {
    const projectId = projects[projectIndex]._id; // Get the project ID

    try {
      await axios.delete(`https://to-do-interview-buddy-t2hp.vercel.app/api/projects/${projectId}/tasks/${taskId}`);
      const updatedProjects = [...projects];
      for (const status in updatedProjects[projectIndex].tasks) {
        updatedProjects[projectIndex].tasks[status] = updatedProjects[projectIndex].tasks[status].filter(task => task._id !== taskId);
      }
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleSelectProject = (index) => {
    setSelectedProjectIndex(index);
  };

  const handleEditButtonClick = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  return (
    <div className="relative bg-white w-full h-[1024px] overflow-hidden text-left text-xs text-foundation-brand-brand-500 font-typography-styles-heading-6-bold">
      <div className="absolute top-[0px] left-[0px] flex flex-col items-start justify-start gap-[24px] text-lg text-foundation-text-colors-primary-text-color">
        <div className="flex flex-row items-center justify-between gap-[24px]">
          <div className="box-border w-60 shrink-0 flex flex-row items-center justify-start py-4 px-6 gap-[10px] border-b-[1px] border-solid border-foundation-brand-brand-50">
            <img className="navheadericon" src="https://i.ibb.co/LrcspRq/task-boards-icon.png" alt="icon"/>
            <b className="relative leading-[28px]">Task boards</b>
          </div>
        </div>
        <div className="w-60 flex flex-col items-start justify-start py-0 px-2.5 box-border gap-[10px] text-base">
          {projects.map((project, index) => (
            <div key={index} className="self-stretch rounded-lg bg-foundation-brand-brand-50 flex flex-row items-center justify-start py-2.5 px-6" onClick={() => handleSelectProject(index)}>
              <div className="relative leading-[24px]">{project.name}</div>
            </div>
          ))}
        </div>
        <div className="self-stretch bg-white box-border h-8 flex flex-col items-center justify-start py-2.5 px-6 gap-[10px] text-xs text-foundation-brand-brand-500 border-t-[1px] border-solid border-foundation-brand-brand-50">
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="New Project Name"
            className="border border-gray-300 rounded p-1"
          />
          <button onClick={handleAddProject} className="bg-blue-500 text-white rounded px-2">Add Project</button>
        </div>
      </div>
      
      {selectedProjectIndex !== null && (
        <div className="absolute top-[0px] left-[240px] w-[1200px] h-[1024px] overflow-hidden">
          <div className="absolute left-[24px] shrink-0 flex flex-col items-start justify-start gap-[20px] right-[0px] w-full">
            <div style={{
              fontSize: '30px',
              border: '1px solid rgb(244, 235, 235)',
              padding: '15px',
              fontWeight: '600',
              color: "black",
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
              backgroundColor: 'white',
              width: '100%'
            }}>
              {projects[selectedProjectIndex].name}
            </div>

            <div className="flex gap-4 mt-4 w-full">
              {['todo', 'inProgress', 'inReview', 'completed'].map((status) => (
                <div key={status} style={{
                  border: '1px solid rgb(244, 235, 235)',
                  padding: '15px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                }} className="flex flex-col item-center w-full items-center justify-start gap-[4px]">
                  <div 
                    className={`rounded-xl h-8 flex flex-row items-center justify-center py-1 px-3 box-border 
                                ${status === 'todo' ? 'bg-blue-200' : ''}
                                ${status === 'inProgress' ? 'bg-pink-200' : ''}
                                ${status === 'inReview' ? 'bg-orange-200' : ''}
                                ${status === 'completed' ? 'bg-green-200' : ''}`}
                  >
                    <div className="flex justify-center" style={{ fontSize: '18px', width: '150px' }}>{status.charAt(0).toUpperCase() + status.slice(1)}</div>
                  </div>
                  
                  <button 
                    onClick={() => { setIsModalOpen(true); handleSelectProject(selectedProjectIndex); }} style={{
                      border: "none"
                    }}
                    className="mt-2 bg-blue-500 text-white rounded "
                  >
                    Add Task
                  </button>
                  
                  {projects[selectedProjectIndex].tasks[status].map((task, index) => (
                    <div 
                      key={index} 
                      onClick={() => handleEditButtonClick(task)} 
                      className="flex flex-col justify-center rounded-lg bg-white shadow-[0px_0px_8px_rgba(54,_89,_226,_0.16)] p-2 mb-2"
                    >
                      <div className="flex justify-center w-full"
                        style={{ fontSize: '20px', color: "black", marginTop: '6px', marginBottom: '4px', fontWeight: '600' }}
 >{task.taskName}</div>
                      <div style={{
                        padding: '20px',
                        color: 'black',
                        fontWeight: '300'
                      }} className="flex flex-row gap-[20px]">
                        <div className="flex flex-col gap-[3px]">
                          <div className="flex justify-center">Start Date </div>
                          <div className={`rounded-xl h-6 flex flex-row items-center justify-center py-1 px-3 box-border 
                                ${status === 'todo' ? 'bg-blue-200' : ''}
                                ${status === 'inProgress' ? 'bg-pink-200' : ''}
                                ${status === 'inReview' ? 'bg-orange-200' : ''}
                                ${status === 'completed' ? 'bg-green-200' : ''}`}>{task.startDate}</div>
                        </div>

                        <div className="flex flex-col gap-[3px] ">
                          <div className="flex justify-center">Deadline </div>
                          <div className={`rounded-xl h-6 flex flex-row items-center justify-center py-1 px-3 box-border 
                                ${status === 'todo' ? 'bg-blue-200' : ''}
                                ${status === 'inProgress' ? 'bg-pink-200' : ''}
                                ${status === 'inReview' ? 'bg-orange-200' : ''}
                                ${status === 'completed' ? 'bg-green-200' : ''}`}>{task.deadline}</div>
                        </div>
                      </div>
                      {/* <button onClick={() => handleDeleteTask(task._id, selectedProjectIndex)} className="mt-2 bg-red-500 text-white rounded">Delete Task</button> */}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddTask={handleAddTask} 
        projectIndex={selectedProjectIndex} 
      />
      <EditTaskModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onEditTask={handleEditTask} 
        task={selectedTask} 
        projectIndex={selectedProjectIndex} 
      />
    </div>
  );
};

export default TaskBoards;
