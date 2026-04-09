import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Obtener leads públicos no importados
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('p');
    const imported = searchParams.get('imported');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del proyecto' },
        { status: 400 }
      );
    }

    // Verificar que el proyecto existe
    const project = await db.cRMProject.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Construir filtro
    const where: any = {
      projectId,
    };

    if (imported === 'false') {
      where.imported = false;
    } else if (imported === 'true') {
      where.imported = true;
    }

    // Obtener leads
    const leads = await db.cRMLead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      leads: leads.map((lead) => ({
        id: lead.id,
        projectId: lead.projectId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        company: lead.company,
        email: lead.email,
        whatsapp: lead.whatsapp,
        phone: lead.phone,
        description: lead.description,
        message: lead.description, // Para compatibilidad
        source: lead.source,
        stage: lead.stage,
        imported: lead.imported,
        createdAt: lead.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error al obtener leads públicos:', error);
    return NextResponse.json(
      { error: 'Error al obtener leads' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo lead desde el formulario público
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId, firstName, lastName, email, whatsapp, phone, company, message } = body;

    // Validaciones
    if (!projectId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del proyecto' },
        { status: 400 }
      );
    }

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: 'Nombre y apellido son requeridos' },
        { status: 400 }
      );
    }

    // Verificar que el proyecto existe
    const project = await db.cRMProject.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }

    // Crear el lead directamente en la PRIMERA fase (LEAD)
    const lead = await db.cRMLead.create({
      data: {
        projectId,
        firstName,
        lastName,
        email: email || null,
        whatsapp: whatsapp || null,
        phone: phone || null,
        company: company || null,
        description: message || null,
        source: 'formulario',
        stage: 'LEAD', // SIEMPRE cae a la primera fase
        imported: false,
      },
    });

    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        whatsapp: lead.whatsapp,
        company: lead.company,
        stage: lead.stage,
        createdAt: lead.createdAt,
      },
    });
  } catch (error) {
    console.error('Error al crear lead:', error);
    return NextResponse.json(
      { error: 'Error al crear lead' },
      { status: 500 }
    );
  }
}
