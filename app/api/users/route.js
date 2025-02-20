import prisma from "@/utils/prisma";

export async function GET() {
   try {
      const users = await prisma.user.findMany();
      return Response.json({ success: true, users });
   } catch (error) {
      return Response.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   }
}

export async function POST(req) {
   try {
      const { name, email } = await req.json();
      const newUser = await prisma.user.create({
         data: { name, email },
      });
      return Response.json({ success: true, user: newUser });
   } catch (error) {
      return Response.json(
         { success: false, error: error.message },
         { status: 500 }
      );
   }
}
