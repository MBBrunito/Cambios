import prisma from "@/utils/prisma";

export async function GET() {
   try {
      const projects = await prisma.project.findMany({
         include: { user: true },
      });
      return Response.json({ success: true, projects });
   } catch (error) {
      console.error("Error obteniendo proyectos:", error);
      return Response.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   }
}

export async function POST(req) {
   try {
      const { title, content, tasks, start_date, end_date, status, userId } =
         await req.json();

      if (!title || !content || !tasks || !start_date || !userId) {
         return Response.json(
            { success: false, error: "Todos los campos son obligatorios" },
            { status: 400 }
         );
      }

      const newProject = await prisma.project.create({
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

      return Response.json({ success: true, project: newProject });
   } catch (error) {
      console.error("Error creando proyecto:", error);
      return Response.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   }
}
