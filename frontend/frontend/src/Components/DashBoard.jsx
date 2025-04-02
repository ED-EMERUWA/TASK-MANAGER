import { useState, useEffect } from "react"; 
import { useAuth } from "./Authenticate"; // Import useAuth to access user data

export default function Dashboard() {
  const { user } = useAuth(); // Get user from context
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || !user.email) return; // Ensure user is available

      try {
        console.log("Fetching tasks for:", user.email);
        const response = await fetch("http://localhost:2173/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }), // Ensure correct request format
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status}`);
        }

        const data = await response.json();
        console.log(data)
        setTasks(data);
        console.log("Fetched tasks:", data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();

    // Use a timeout to refetch tasks after a delay (optional)
    const refreshTimeout = setTimeout(() => {
      
      fetchTasks();
      console.log("taks fetched again");
    }, 1000); // Refresh tasks every 1 seconds (adjust as needed)

    return () => clearTimeout(refreshTimeout); // Cleanup timeout on unmount
  }, [user]); // Depend on user so it runs when user changes

  return (
    <div>
      <h1>Dashboard</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}> {task.Topic}: {task.Body}</li>
        ))}
      </ul>
    </div>
  );
}
