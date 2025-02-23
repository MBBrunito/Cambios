"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProjectsPage() {
   const [projects, setProjects] = useState([]);
   const [error, setError] = useState(null);
   const [search, setSearch] = useState("");
   const [status, setStatus] = useState("");
   const [userId, setUserId] = useState("");
   const [users, setUsers] = useState([]);
   const [orderBy, setOrderBy] = useState("start_date");
   const [orderDirection, setOrderDirection] = useState("asc");
   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);

   useEffect(() => {
      // Obtener usuarios para el filtro
      fetch("/api/users")
         .then((res) => res.json())
         .then((data) => {
            if (data.success) {
               setUsers(data.users);
            }
         });

      fetchProjects(); // Llamar a la función para obtener proyectos con filtros
   }, []);

   useEffect(() => {
      const fetchProjects = async () => {
         const params = new URLSearchParams();
         if (search) params.append("search", search);
         if (status) params.append("status", status);
         if (userId) params.append("userId", userId);
         params.append("orderBy", orderBy);
         params.append("orderDirection", orderDirection);
         params.append("page", page);
         params.append("limit", 5); // Cantidad de proyectos por página

         try {
            const res = await fetch(`/api/projects?${params.toString()}`);
            if (!res.ok) {
               throw new Error(`Error HTTP! Status: ${res.status}`);
            }
            const data = await res.json();

            if (data.success) {
               setProjects(data.projects);
               setTotalPages(data.totalPages);
            } else {
               setError(data.error);
            }
         } catch (err) {
            setError(err.message);
         }
      };

      fetchProjects();
   }, [page, search, status, userId, orderBy, orderDirection]); // Se ejecuta cuando cambia la página o un filtro

   const [loadingId, setLoadingId] = useState(null); // Estado de carga para cada proyecto

   const fetchProjects = async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (status) params.append("status", status);
      if (userId) params.append("userId", userId);
      params.append("orderBy", orderBy);
      params.append("orderDirection", orderDirection);
      params.append("page", page);
      params.append("limit", 5);

      const response = await fetch(`/api/projects?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
         setProjects(data.projects);
      }
   };

   const handleSearch = (e) => {
      e.preventDefault();
      fetchProjects();
   };

   const handleDelete = async (id) => {
      if (!confirm("¿Estás seguro de que quieres eliminar este proyecto?"))
         return;

      setLoadingId(id); // Activar loading para este proyecto

      const response = await fetch(`/api/projects/${id}`, {
         method: "DELETE",
      });

      if (response.ok) {
         setProjects((prevProjects) =>
            prevProjects.filter((project) => project.id !== id)
         );
      } else {
         console.error("Error eliminando proyecto:", await response.json());
      }

      setLoadingId(null); // Desactivar loading
   };

   return (
      <div className="p-6">
         <h1 className="text-2xl font-bold mb-4">Lista de Proyectos</h1>
         {error && <p className="text-red-500">Error: {error}</p>}
         {/* Formulario de Filtros */}
         <form onSubmit={handleSearch} className="mb-4 flex flex-wrap gap-2">
            <select
               value={orderBy}
               onChange={(e) => setOrderBy(e.target.value)}
               className="border p-2 w-48"
            >
               <option value="title">Título</option>
               <option value="status">Estado</option>
               <option value="start_date">Fecha de Inicio</option>
               <option value="end_date">Fecha de Finalización</option>
            </select>
            <select
               value={orderDirection}
               onChange={(e) => setOrderDirection(e.target.value)}
               className="border p-2 w-32"
            >
               <option value="asc">Ascendente</option>
               <option value="desc">Descendente</option>
            </select>
            <input
               type="text"
               placeholder="Buscar por título..."
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="border p-2 w-64"
            />
            <select
               value={status}
               onChange={(e) => setStatus(e.target.value)}
               className="border p-2 w-48"
            >
               <option value="">Todos los estados</option>
               <option value="No iniciado">No iniciado</option>
               <option value="En proceso">En proceso</option>
               <option value="Finalizado">Finalizado</option>
            </select>
            <select
               value={userId}
               onChange={(e) => setUserId(e.target.value)}
               className="border p-2 w-48"
            >
               <option value="">Todos los usuarios</option>
               {users.map((user) => (
                  <option key={user.id} value={user.id}>
                     {user.name}
                  </option>
               ))}
            </select>
            <button
               type="submit"
               className="bg-blue-500 text-white px-4 py-2 rounded"
            >
               Filtrar
            </button>
         </form>

         <div className="p-6">
            <div className="flex justify-between items-center mb-4">
               <Link href="/projects/new">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded">
                     + Nuevo Proyecto
                  </button>
               </Link>
            </div>
         </div>

         <table className="w-full border-collapse border border-gray-300">
            <thead>
               <tr className="bg-gray-200">
                  <th className="border p-2">Título</th>
                  <th className="border p-2">Usuario</th>
                  <th className="border p-2">Estado</th>
                  <th className="border p-2">Inicio</th>
                  <th className="border p-2">Finalización</th>
                  <th className="border p-2">Tareas</th>
                  <th className="border p-2">Acciones</th>
               </tr>
            </thead>
            <tbody>
               {projects.length > 0 ? (
                  projects.map((project) => (
                     <tr key={project.id} className="border">
                        <td className="p-2">{project.title}</td>
                        <td className="p-2">
                           {project.user ? project.user.name : "Sin asignar"}
                        </td>
                        <td className="p-2">{project.status}</td>
                        <td className="p-2">
                           {new Date(project.start_date).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                           {project.end_date
                              ? new Date(project.end_date).toLocaleDateString()
                              : "Pendiente"}
                        </td>
                        <td className="p-2">
                           {project.tasks && project.tasks.length > 0 ? (
                              <ul className="list-disc pl-4">
                                 {project.tasks.map((task, index) => (
                                    <li key={index}>{task}</li>
                                 ))}
                              </ul>
                           ) : (
                              <span className="text-gray-500">Sin tareas</span>
                           )}
                        </td>
                        <td className="p-2 flex gap-2">
                           <Link
                              href={`/projects/${project.id}/edit`}
                              className="bg-yellow-500 text-white px-2 py-1 rounded"
                           >
                              Editar
                           </Link>
                           <button
                              onClick={() => handleDelete(project.id)}
                              className={`px-2 py-1 rounded ${
                                 loadingId === project.id
                                    ? "bg-gray-500 cursor-not-allowed"
                                    : "bg-red-500"
                              }`}
                              disabled={loadingId === project.id}
                           >
                              {loadingId === project.id
                                 ? "Eliminando..."
                                 : "Eliminar"}
                           </button>
                        </td>
                     </tr>
                  ))
               ) : (
                  <tr>
                     <td colSpan="5" className="text-center p-4">
                        No hay proyectos aún.
                     </td>
                  </tr>
               )}
            </tbody>
         </table>
         <div className="flex justify-center gap-2 mt-4">
            <button
               className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
               disabled={page <= 1}
               onClick={() => setPage(page - 1)}
            >
               ⬅️ Anterior
            </button>
            <span className="px-4 py-2">
               {page} de {totalPages}
            </span>
            <button
               className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
               disabled={page >= totalPages} // Se deshabilita cuando estamos en la última página con proyectos
               onClick={() => setPage(page + 1)}
            >
               Siguiente ➡️
            </button>
         </div>
      </div>
   );
}
