"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");
   const [tasks, setTasks] = useState([]);
   const [startDate, setStartDate] = useState("");
   const [userId, setUserId] = useState("");
   const [users, setUsers] = useState([]);
   const [loading, setLoading] = useState(false);

   const router = useRouter();

   useEffect(() => {
      fetch("/api/users")
         .then((res) => res.json())
         .then((data) => {
            if (data.success) {
               setUsers(data.users);
            }
         });
   }, []);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      const response = await fetch("/api/projects", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            title,
            content,
            tasks,
            start_date: startDate,
            end_date: null,
            status: "No iniciado",
            userId,
         }),
      });

      if (response.ok) {
         const result = await response.json(); // Espera la respuesta antes de redirigir
         console.log("Proyecto creado:", result);
         router.push("/projects");
      } else {
         console.error("Error creando proyecto:", await response.json());
      }

      setLoading(false);
   };

   return (
      <div className="p-6">
         <h1 className="text-2xl font-bold mb-4">Crear Proyecto</h1>
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

            {loading ? (
               <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
                  disabled
               >
                  Creando...
               </button>
            ) : (
               <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
               >
                  Crear Proyecto
               </button>
            )}
         </form>

         {loading && (
            <p className="text-blue-500 mt-2">
               Por favor, espera mientras se crea el proyecto...
            </p>
         )}
      </div>
   );
}
