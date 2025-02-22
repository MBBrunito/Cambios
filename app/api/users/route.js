import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

// Obtener todos los usuarios
export async function GET() {
   try {
      const users = await prisma.user.findMany();
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
      const { name, email } = await req.json();

      if (!name || !email) {
         return NextResponse.json(
            { success: false, error: "Todos los campos son obligatorios" },
            { status: 400 }
         );
      }

      const newUser = await prisma.user.create({
         data: { name, email },
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
      const { id } = await req.json();

      await prisma.user.delete({
         where: { id },
      });

      return NextResponse.json({
         success: true,
         message: "Usuario eliminado correctamente",
      });
   } catch (error) {
      console.error("Error eliminando usuario:", error);
      return NextResponse.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   }
}

// Actualizar un usuario por ID
export async function PUT(req) {
   try {
      const { id, name, email } = await req.json();

      if (!id || !name || !email) {
         return NextResponse.json(
            { success: false, error: "Todos los campos son obligatorios" },
            { status: 400 }
         );
      }

      const updatedUser = await prisma.user.update({
         where: { id },
         data: { name, email },
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
