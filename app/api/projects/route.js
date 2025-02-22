import prisma from "@/utils/prisma";

export async function GET(req) {
   try {
      const { searchParams } = new URL(req.url);
      const search = searchParams.get("search") || "";
      const status = searchParams.get("status") || "";
      const userId = searchParams.get("userId") || "";
      const orderBy = searchParams.get("orderBy") || "start_date";
      const orderDirection = searchParams.get("orderDirection") || "asc";
      const page = parseInt(searchParams.get("page")) || 1;
      const limit = parseInt(searchParams.get("limit")) || 5;

      const skip = (page - 1) * limit;

      // Contar solo los proyectos que cumplen los filtros
      const totalProjects = await prisma.project.count({
         where: {
            AND: [
               search
                  ? { title: { contains: search, mode: "insensitive" } }
                  : {},
               status ? { status } : {},
               userId ? { userId } : {},
            ],
         },
      });

      const projects = await prisma.project.findMany({
         where: {
            AND: [
               search
                  ? { title: { contains: search, mode: "insensitive" } }
                  : {},
               status ? { status } : {},
               userId ? { userId } : {},
            ],
         },
         orderBy: { [orderBy]: orderDirection },
         skip,
         take: limit,
         include: { user: true },
      });

      const totalPages = Math.ceil(totalProjects / limit);

      return Response.json({ success: true, projects, totalPages });
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
