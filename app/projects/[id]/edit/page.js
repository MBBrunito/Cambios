"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditProjectPage() {
   const router = useRouter();
   const { id } = useParams();

   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const [tasks, setTasks] = useState([""]);
   const [startDate, setStartDate] = useState("");
   const [endDate, setEndDate] = useState("");
   const [status, setStatus] = useState("No iniciado");
   const [userId, setUserId] = useState("");
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(true); // Estado de carga

   useEffect(() => {
      async function fetchData() {
         try {
            const [projectRes, usersRes] = await Promise.all([
               fetch(`/api/projects/${id}`),
               fetch("/api/users"),
            ]);

            const projectData = await projectRes.json();
            const usersData = await usersRes.json();

            if (projectData.success) {
               const project = projectData.project;
               setTitle(project.title);
               setContent(project.content);
               setTasks(project.tasks || [""]);
               setStartDate(project.start_date.split("T")[0]);
               setEndDate(
                  project.end_date ? project.end_date.split("T")[0] : ""
               );
               setStatus(project.status);
               setUserId(project.user?.id || "");
            }

            if (usersData.success) {
               setUsers(usersData.users);
            }

            setLoading(false); // Desactivar carga cuando todo está listo
         } catch (error) {
            console.error("Error al cargar datos:", error);
            setLoading(false);
         }
      }

      fetchData();
   }, [id]);

   // Función para agregar una nueva tarea
   const addTask = () => {
      setTasks([...tasks, ""]); // Agregar una tarea vacía
   };

   // Función para actualizar una tarea específica
   const updateTask = (index, value) => {
      const newTasks = [...tasks];
      newTasks[index] = value;
      setTasks(newTasks);
   };

   // Función para eliminar una tarea
   const removeTask = (index) => {
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true); // Activar loading al guardar

      const response = await fetch(`/api/projects/${id}`, {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            title,
            content,
            tasks,
            start_date: startDate,
            end_date: endDate || null,
            status,
            userId,
         }),
      });

      if (response.ok) {
         router.push("/projects");
      } else {
         console.error("Error actualizando proyecto:", await response.json());
      }

      setLoading(false);
   };

   return (
      <div className="p-6">
         <h1 className="text-2xl font-bold mb-4">Editar Proyecto</h1>

         {loading ? (
            <p className="text-blue-500">Cargando datos del proyecto...</p>
         ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label className="block">Título:</label>
                  <input
                     type="text"
                     value={title}
                     onChange={(e) => setTitle(e.target.value)}
                     className="border p-2 w-full"
                     required
                  />
               </div>
               <div>
                  <label className="block">Descripción:</label>
                  <textarea
                     value={content}
                     onChange={(e) => setContent(e.target.value)}
                     className="border p-2 w-full"
                     required
                  />
               </div>
               <div>
                  <label className="block">Fecha de inicio:</label>
                  <input
                     type="date"
                     value={startDate}
                     onChange={(e) => setStartDate(e.target.value)}
                     className="border p-2 w-full"
                     required
                  />
               </div>
               <div>
                  <label className="block">Fecha de finalización:</label>
                  <input
                     type="date"
                     value={endDate}
                     onChange={(e) => setEndDate(e.target.value)}
                     className="border p-2 w-full"
                  />
               </div>
               <div>
                  <label className="block">Estado:</label>
                  <select
                     value={status}
                     onChange={(e) => setStatus(e.target.value)}
                     className="border p-2 w-full"
                  >
                     <option value="No iniciado">No iniciado</option>
                     <option value="En proceso">En proceso</option>
                     <option value="Finalizado">Finalizado</option>
                  </select>
               </div>
               <div>
                  <label className="block">Usuario Asignado:</label>
                  <select
                     value={userId}
                     onChange={(e) => setUserId(e.target.value)}
                     className="border p-2 w-full"
                     required
                  >
                     <option value="">Seleccionar usuario</option>
                     {users.map((user) => (
                        <option key={user.id} value={user.id}>
                           {user.name}
                        </option>
                     ))}
                  </select>
               </div>
               <div>
                  <label className="block">Tareas:</label>
                  {tasks.map((task, index) => (
                     <div key={index} className="flex gap-2 mb-2">
                        <input
                           type="text"
                           value={task}
                           onChange={(e) => updateTask(index, e.target.value)}
                           className="border p-2 w-full"
                           placeholder={`Tarea ${index + 1}`}
                           required
                        />
                        <button
                           type="button"
                           onClick={() => removeTask(index)}
                           className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                           ✖
                        </button>
                     </div>
                  ))}
                  <button
                     type="button"
                     onClick={addTask}
                     className="bg-green-500 text-white px-4 py-2 rounded"
                  >
                     + Agregar Tarea
                  </button>
               </div>

               {loading ? (
                  <button
                     type="button"
                     className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                     disabled
                  >
                     Guardando...
                  </button>
               ) : (
                  <button
                     type="submit"
                     className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                     Guardar Cambios
                  </button>
               )}
            </form>
         )}
      </div>
   );
}
