"use client";
import { useEffect, useState } from "react";

export default function ProjectsPage() {
   const [projects, setProjects] = useState([]);
   const [error, setError] = useState(null);

   useEffect(() => {
      fetch("/api/projects")
         .then((res) => {
            if (!res.ok) {
               throw new Error(`Error HTTP! Status: ${res.status}`);
            }
            return res.json();
         })
         .then((data) => {
            if (data.success) {
               setProjects(data.projects);
            } else {
               setError(data.error);
            }
         })
         .catch((err) => setError(err.message));
   }, []);

   return (
      <div className="p-6">
         <h1 className="text-2xl font-bold mb-4">Lista de Proyectos</h1>
         {error && <p className="text-red-500">Error: {error}</p>}
         <table className="w-full border-collapse border border-gray-300">
            <thead>
               <tr className="bg-gray-200">
                  <th className="border p-2">Título</th>
                  <th className="border p-2">Usuario</th>
                  <th className="border p-2">Estado</th>
                  <th className="border p-2">Inicio</th>
                  <th className="border p-2">Finalización</th>
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
      </div>
   );
}
