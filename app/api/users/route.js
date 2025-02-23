import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

// Obtener todos los usuarios
export async function GET() {
   try {
      const users = await prisma.user.findMany({
         where: { active: true }, // Solo usuarios activos
         select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
         }, // Incluir `active`
      });

      console.log("Usuarios enviados desde la API:", users); // 🛠 Debug

      return NextResponse.json({ success: true, users });
   } catch (error) {
      console.error("Error obteniendo usuarios:", error);
      return NextResponse.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   }
}

// Crear un nuevo usuario
export async function POST(req) {
   try {
      const { name, email, role } = await req.json();

      console.log("Datos recibidos en API:", { name, email, role }); // Debug

      if (!name || !email || !role) {
         return NextResponse.json(
            { success: false, error: "Todos los campos son obligatorios" },
            { status: 400 }
         );
      }

      // Convertir el role a tipo Prisma Enum
      const formattedRole = role.toUpperCase(); // Convertir "admin" o "user" a "ADMIN" o "USER"

      if (!["ADMIN", "USER"].includes(formattedRole)) {
         return NextResponse.json(
            { success: false, error: "Rol no válido" },
            { status: 400 }
         );
      }

      const newUser = await prisma.user.create({
         data: { name, email, role: formattedRole },
      });

      return NextResponse.json({ success: true, user: newUser });
   } catch (error) {
      console.error("Error creando usuario:", error);
      return NextResponse.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   }
}

// Eliminar usuario por ID
export async function DELETE(req) {
   try {
      const body = await req.json(); // Intentar leer el cuerpo correctamente
      const { id } = body;

      console.log("Intentando eliminar usuario con ID:", id); // 🛠 Debug

      if (!id) {
         console.log("Error: ID no proporcionado");
         return NextResponse.json(
            { success: false, error: "ID del usuario es obligatorio" },
            { status: 400 }
         );
      }

      const deletedUser = await prisma.user.delete({
         where: { id },
      });

      console.log("Usuario eliminado:", deletedUser); // 🛠 Confirmación

      return NextResponse.json({
         success: true,
         message: "Usuario eliminado correctamente",
      });
   } catch (error) {
      console.error("Error eliminando usuario:", error);
      return new Response(
         JSON.stringify({ success: false, error: error.message }),
         { status: 500, headers: { "Content-Type": "application/json" } }
      );
   }
}

// Actualizar un usuario por ID
export async function PUT(req) {
   try {
      const { id, name, email, role } = await req.json();

      console.log("Datos recibidos en actualización:", {
         id,
         name,
         email,
         role,
      }); // Debug

      if (!id || !name || !email || !role) {
         return NextResponse.json(
            { success: false, error: "Todos los campos son obligatorios" },
            { status: 400 }
         );
      }

      // Convertir `role` a Enum si es necesario
      const formattedRole = role.toUpperCase();

      if (!["ADMIN", "USER"].includes(formattedRole)) {
         return NextResponse.json(
            { success: false, error: "Rol no válido" },
            { status: 400 }
         );
      }

      const updatedUser = await prisma.user.update({
         where: { id },
         data: { name, email, role: formattedRole },
      });

      return NextResponse.json({ success: true, user: updatedUser });
   } catch (error) {
      console.error("Error actualizando usuario:", error);
      return NextResponse.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   }
}
