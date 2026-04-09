import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Obtener todos los leads de un proyecto
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Se requiere el ID del proyecto' },
        { status: 400 }
      );
    }

    // Obtener todos los leads del proyecto
    const leads = await db.cRMLead.findMany({
      where: { projectId },
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
        source: lead.source,
        sourceDetails: lead.sourceDetails,
        estimatedValue: lead.estimatedValue,
        notes: lead.notes,
        stage: lead.stage,
        lostReason: lead.lostReason,
        lostNotes: lead.lostNotes,
        lostAt: lead.lostAt,
        imported: lead.imported,
        createdAt: lead.createdAt,
        updatedAt: lead.updatedAt,
      })),
    });
  } catch (error) {
    console.error('Error al obtener leads:', error);
    return NextResponse.json(
      { error: 'Error al obtener leads' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo lead en el CRM
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      projectId,
      firstName,
      lastName,
      email,
      whatsapp,
      phone,
      company,
      description,
      source,
      sourceDetails,
      estimatedValue,
      notes,
      stage,
      lostReason,
      lostNotes,
    } = body;

    // Validaciones
    if (!projectId || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'ID de proyecto, nombre y apellido son requeridos' },
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

    // Crear el lead
    const lead = await db.cRMLead.create({
      data: {
        projectId,
        firstName,
        lastName,
        email: email || null,
        whatsapp: whatsapp || null,
        phone: phone || null,
        company: company || null,
        description: description || null,
        source: source || 'manual',
        sourceDetails: sourceDetails || null,
        estimatedValue: estimatedValue || null,
        notes: notes || null,
        stage: stage || 'LEAD',
        lostReason: lostReason || null,
        lostNotes: lostNotes || null,
        imported: false,
      },
    });

    return NextResponse.json({
      success: true,
      lead: {
        id: lead.id,
        projectId: lead.projectId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        whatsapp: lead.whatsapp,
        company: lead.company,
        description: lead.description,
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
