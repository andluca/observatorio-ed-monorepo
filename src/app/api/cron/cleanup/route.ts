import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deleted = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return NextResponse.json({ 
      success: true, 
      deletedCount: deleted.count,
      message: `Limpeza concluída. ${deleted.count} sessões expiradas removidas.`
    });

  } catch (error) {
    console.error("Erro no cron de limpeza:", error);
    return NextResponse.json({ error: "Falha na limpeza" }, { status: 500 });
  }
}