import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// PATCH - Marcar un lead como importado
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { imported } = body;

    // Verificar que el lead existe
    const lead = await db.cRMLead.findUnique({
      where: { id: params.id },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el lead
    const updatedLead = await db.cRMLead.update({
      where: { id: params.id },
      data: {
        imported: imported !== undefined ? imported : true,
      },
    });

    return NextResponse.json({
      success: true,
      lead: {
        id: updatedLead.id,
        imported: updatedLead.imported,
      },
    });
  } catch (error) {
    console.error('Error al actualizar lead:', error);
    return NextResponse.json(
      { error: 'Error al actualizar lead' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un lead
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar que el lead existe
    const lead = await db.cRMLead.findUnique({
      where: { id: params.id },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead no encontrado' },
        { status: 404 }
      );
    }

    // Eliminar el lead
    await db.cRMLead.delete({
      where: { id: params.id },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead eliminado correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar lead:', error);
    return NextResponse.json(
      { error: 'Error al eliminar lead' },
      { status: 500 }
    );
  }
}
