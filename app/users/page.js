"use client";
import { useEffect, useState } from "react";

export default function UsersPage() {
   const [users, setUsers] = useState([]);
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);
   const [editingUser, setEditingUser] = useState(null);
   const [currentUser, setCurrentUser] = useState({ role: "ADMIN" });
   const [role, setRole] = useState("USER"); // USER por defecto

   useEffect(() => {
      fetchUsers();
   }, []);

   const fetchUsers = async () => {
      setLoading(true);
      try {
         const res = await fetch("/api/users");
         const data = await res.json();
         if (data.success) {
            setUsers(data.users.filter((user) => user.active)); // Filtrar solo usuarios activos
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

      const userData = { name, email, role };

      console.log("Enviando usuario:", userData); // Debug para ver qué se envía

      const response = await fetch("/api/users", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (data.success) {
         setUsers([...users, data.user]);
         setName("");
         setEmail("");
         setRole("USER"); // Reiniciar a USER por defecto
      } else {
         setError(data.error);
      }

      setLoading(false);
   };

   const handleDeleteUser = async (id) => {
      if (!confirm("¿Estás seguro de que quieres eliminar este usuario?"))
         return;

      setLoading(true);

      try {
         console.log("Enviando solicitud DELETE con ID:", id); // 🛠 Debug

         const response = await fetch(`/api/users/${id}`, {
            // Enviar ID en la URL
            method: "DELETE",
         });

         if (!response.ok) {
            throw new Error(`Error en la eliminación: ${response.status}`);
         }

         const data = await response.json();

         if (data.success) {
            setUsers(users.filter((user) => user.id !== id));
         } else {
            console.error("Error eliminando usuario:", data.error);
         }
      } catch (err) {
         console.error("Error en la eliminación:", err);
      }

      setLoading(false);
   };

   const handleUpdateUser = async (e) => {
      e.preventDefault();
      setLoading(true);

      const updatedData = { id: editingUser.id, name, email, role };
      console.log("Actualizando usuario:", updatedData); // Debug

      const response = await fetch("/api/users", {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      if (data.success) {
         setUsers(
            users.map((user) => (user.id === editingUser.id ? data.user : user))
         );
         setEditingUser(null);
         setName("");
         setEmail("");
         setRole("USER"); // Reiniciar el rol a USER por defecto
      } else {
         setError(data.error);
      }

      setLoading(false);
   };

   const handleEditUser = (user) => {
      setEditingUser(user);
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
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
            <div>
               <label className="block">Rol:</label>
               <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="border p-2 w-full"
                  required
               >
                  <option value="USER">Usuario</option>
                  <option value="ADMIN">Administrador</option>
               </select>
            </div>

            {currentUser.role === "ADMIN" && (
               <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  disabled={loading}
               >
                  {loading
                     ? "Guardando..."
                     : editingUser
                     ? "Actualizar Usuario"
                     : "Agregar Usuario"}
               </button>
            )}

            {/* {editingUser && (
               <div>
                  <label className="block">Rol:</label>
                  <select
                     value={role}
                     onChange={(e) => setRole(e.target.value)}
                     className="border p-2 w-full"
                  >
                     <option value="USER">Usuario</option>
                     <option value="ADMIN">Administrador</option>
                  </select>
               </div>
            )} */}
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
                     <th className="border p-2">Rol</th>
                     <th className="border p-2">Acciones</th>
                  </tr>
               </thead>
               <tbody>
                  {users.length > 0 ? (
                     users.map((user) => (
                        <tr key={user.id} className="border">
                           <td className="p-2">{user.name}</td>
                           <td className="p-2">{user.email}</td>
                           <td className="p-2">{user.role}</td>
                           <td className="p-2 flex gap-2">
                              <button
                                 onClick={() => handleEditUser(user)}
                                 className="bg-yellow-500 text-white px-2 py-1 rounded"
                              >
                                 Editar
                              </button>
                              {user.role !== "ADMIN" && (
                                 <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                 >
                                    Eliminar
                                 </button>
                              )}
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan="4" className="text-center p-4">
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
