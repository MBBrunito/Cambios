import prisma from "@/utils/prisma";

export async function GET() {
   try {
      const projects = await prisma.project.findMany();
      return Response.json({ success: true, projects });
   } catch (error) {
      return Response.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   }
}
