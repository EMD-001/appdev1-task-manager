import { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { db } from '../firebase.js';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const TaskLists = () => {
    const [loading, setLoading] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState(""); 
    const [description, setDescription] = useState(""); 
    const [error, setError] = useState(""); 

    const fetchTask = async () => {
        setLoading(true);
        try {
            const collectionRef = collection(db, 'tasks');
            const querySnapshot = await getDocs(collectionRef);
            const taskList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
            setTasks(taskList);
            setLoading(false);
        } catch (error) {
            console.error(error.message);
            setLoading(false);
        }
    };

    const TaskItem = ({ task }) => {
        const { id, title, description, status } = task;

        const handleStatusChange = async () => {
            const taskRef = doc(db, "tasks", id);
            try {
                await updateDoc(taskRef, {
                    status: status === "pending" ? "completed" : "pending",
                });
                setTasks(prevTasks => 
                    prevTasks.map(t => 
                        t.id === id ? { ...t, status: status === "pending" ? "completed" : "pending" } : t
                    )
                );
            } catch (error) {
                console.error("Error updating status: ", error);
            }
        };

        const handleDelete = async () => {
            const taskRef = doc(db, "tasks", id);
            try {
                await deleteDoc(taskRef);
                setTasks(prevTasks => prevTasks.filter(task => task.id !== id)); 
            } catch (error) {
                console.error("Error deleting task: ", error);
            }
        };

        return (
            <li className={status === "completed" ? "completed" : ""}> 
                <p><strong>Title:</strong> {title}</p>
                <p><strong>Description:</strong> {description}</p>
                <p><strong>Status:</strong> {status}</p> 
                <button onClick={handleStatusChange}>
                    {status === "pending" ? "Mark as Completed" : "Mark as Pending"} 
                </button>
                <button onClick={handleDelete} className="delete">
                    <MdDelete /> Delete
                </button>
            </li>
        );
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!title || !description) {
            setError("Both fields are required.");
            return;
        }
        try {
            await addDoc(collection(db, "tasks"), {
                title,
                description,
                status: "pending",
            });
            setTitle("");
            setDescription("");
            setError(""); // Clear error message after successful addition
            fetchTask(); 
        } catch (error) {
            console.error("Error adding task: ", error);
        }
    };

    useEffect(() => {
        fetchTask();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <h2>Task List</h2>
            
            {/* Show error message if any */}
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleAddTask}>
                <input
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Task Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <button type="submit"><MdAdd /> Add Task</button>
            </form>

            <ul>
                {tasks.map(task => (
                    <TaskItem key={task.id} task={task} />
                ))}
            </ul>
        </div>
    );
};

export default TaskLists;
