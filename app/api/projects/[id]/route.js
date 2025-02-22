import prisma from "@/utils/prisma";

export async function GET(req, { params }) {
   try {
      const project = await prisma.project.findUnique({
         where: { id: params.id },
         include: { user: true },
      });

      if (!project) {
         return Response.json(
            { success: false, error: "Proyecto no encontrado" },
            { status: 404 }
         );
      }

      return Response.json({ success: true, project });
   } catch (error) {
      return Response.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   }
}

export async function PUT(req, { params }) {
   try {
      const { title, content, tasks, start_date, end_date, status, userId } =
         await req.json();

      const updatedProject = await prisma.project.update({
         where: { id: params.id },
         data: {
            title,
            content,
            tasks,
            start_date: new Date(start_date),
            end_date: end_date ? new Date(end_date) : null,
            status,
            user: { connect: { id: userId } },
         },
      });

      return Response.json({ success: true, project: updatedProject });
   } catch (error) {
      console.error("Error al actualizar el proyecto:", error);
      return Response.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   }
}

export async function DELETE(req, { params }) {
   try {
      await prisma.project.delete({
         where: { id: params.id },
      });

      return Response.json({
         success: true,
         message: "Proyecto eliminado correctamente",
      });
   } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      return Response.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   }
}
