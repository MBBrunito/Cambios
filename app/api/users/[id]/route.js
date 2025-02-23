import { NextResponse } from "next/server";
import prisma from "@/utils/prisma";

export async function DELETE(req, context) {
   try {
      const { params } = context;
      const id = params?.id;

      console.log("Intentando desactivar usuario con ID:", id);

      if (!id) {
         return NextResponse.json(
            { success: false, error: "ID del usuario es obligatorio" },
            { status: 400 }
         );
      }

      // Buscar si el usuario tiene proyectos asignados
      const userProjects = await prisma.project.findMany({
         where: { userId: id },
      });

      if (userProjects.length > 0) {
         // Buscar usuario "NoUser" o crearlo si no existe
         let noUser = await prisma.user.findFirst({
            where: { email: "nouser@system.com" },
         });

         if (!noUser) {
            noUser = await prisma.user.create({
               data: {
                  name: "NoUser",
                  email: "nouser@system.com",
                  role: "USER",
                  active: false, // No se mostrará en la UI
               },
            });
         }

         // Reasignar proyectos a "NoUser"
         await prisma.project.updateMany({
            where: { userId: id },
            data: { userId: noUser.id },
         });
      }

      // Desactivar usuario en lugar de eliminarlo
      const updatedUser = await prisma.user.update({
         where: { id },
         data: { active: false },
      });

      console.log("Usuario desactivado:", updatedUser);

      return NextResponse.json({
         success: true,
         message: "Usuario desactivado correctamente",
      });
   } catch (error) {
      console.error("Error desactivando usuario:", error);
      return NextResponse.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   }
}
