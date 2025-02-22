"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
   const [users, setUsers] = useState([]);
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [editingUser, setEditingUser] = useState(null);

   useEffect(() => {
      fetchUsers();
   }, []);

   const fetchUsers = async () => {
      setLoading(true);
      try {
         const res = await fetch("/api/users");
         const data = await res.json();
         if (data.success) {
            setUsers(data.users);
         } else {
            setError(data.error);
         }
      } catch (err) {
         setError(err.message);
      }
      setLoading(false);
   };

   const handleAddUser = async (e) => {
      e.preventDefault();
      setLoading(true);

      const response = await fetch("/api/users", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ name, email }),
      });

      const data = await response.json();
      if (data.success) {
         setUsers([...users, data.user]);
         setName("");
         setEmail("");
      } else {
         setError(data.error);
      }

      setLoading(false);
   };

   const handleEditUser = (user) => {
      setEditingUser(user);
      setName(user.name);
      setEmail(user.email);
   };

   const handleDeleteUser = async (id) => {
      if (!confirm("¿Estás seguro de que quieres eliminar este usuario?"))
         return;

      setLoading(true);
      const response = await fetch("/api/users", {
         method: "DELETE",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ id }),
      });

      if (response.ok) {
         setUsers(users.filter((user) => user.id !== id));
      } else {
         console.error("Error eliminando usuario:", await response.json());
      }

      setLoading(false);
   };

   const handleUpdateUser = async (e) => {
      e.preventDefault();
      setLoading(true);

      const response = await fetch("/api/users", {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ id: editingUser.id, name, email }),
      });

      const data = await response.json();
      if (data.success) {
         setUsers(
            users.map((user) => (user.id === editingUser.id ? data.user : user))
         );
         setEditingUser(null);
         setName("");
         setEmail("");
      } else {
         setError(data.error);
      }

      setLoading(false);
   };

   const handleCancelEdit = () => {
      setEditingUser(null);
      setName(""); // Limpiar nombre
      setEmail(""); // Limpiar email
   };

   return (
      <div className="p-6">
         <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

         {/* Formulario para agregar usuario */}
         <form
            onSubmit={editingUser ? handleUpdateUser : handleAddUser}
            className="mb-4 space-y-2"
         >
            <input
               type="text"
               placeholder="Nombre"
               value={name}
               onChange={(e) => setName(e.target.value)}
               className="border p-2 w-full"
               required
            />
            <input
               type="email"
               placeholder="Correo Electrónico"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="border p-2 w-full"
               required
            />
            <button
               type="submit"
               className={`px-4 py-2 rounded ${
                  loading
                     ? "bg-gray-400 cursor-not-allowed"
                     : "bg-blue-500 text-white"
               }`}
               disabled={loading}
            >
               {loading
                  ? "Guardando..."
                  : editingUser
                  ? "Actualizar Usuario"
                  : "Agregar Usuario"}
            </button>
            {editingUser && (
               <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
               >
                  Cancelar
               </button>
            )}
         </form>

         {/* Tabla de Usuarios */}
         {loading ? (
            <p className="text-blue-500">Cargando usuarios...</p>
         ) : error ? (
            <p className="text-red-500">{error}</p>
         ) : (
            <table className="w-full border-collapse border border-gray-300">
               <thead>
                  <tr className="bg-gray-200">
                     <th className="border p-2">Nombre</th>
                     <th className="border p-2">Email</th>
                     <th className="border p-2">Acciones</th>
                  </tr>
               </thead>
               <tbody>
                  {users.length > 0 ? (
                     users.map((user) => (
                        <tr key={user.id} className="border">
                           <td className="p-2">{user.name}</td>
                           <td className="p-2">{user.email}</td>
                           <td className="p-2 flex gap-2">
                              <button
                                 onClick={() => handleEditUser(user)}
                                 className="bg-yellow-500 text-white px-2 py-1 rounded"
                              >
                                 Editar
                              </button>
                              <button
                                 onClick={() => handleDeleteUser(user.id)}
                                 className="bg-red-500 text-white px-2 py-1 rounded"
                              >
                                 Eliminar
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan="3" className="text-center p-4">
                           No hay usuarios registrados.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         )}
      </div>
   );
}
