// Tipos para el sistema CRM

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export type UserRole = 'admin' | 'vendedor' | 'viewer';

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  id: string;
  projectId: string;
  firstName: string;
  lastName: string;
  company?: string;
  email?: string;
  whatsapp?: string;
  phone?: string;
  description?: string;
  notes?: string;
  source: string;
  sourceDetails?: string;
  estimatedValue?: number;
  stage: string;
  lostReason?: string;
  lostNotes?: string;
  lostAt?: string;
  files?: LeadFile[];
  createdAt: string;
  updatedAt: string;
}

export interface LeadFile {
  id: string;
  name: string;
  type: string;
  data: string;
  uploadedAt: string;
}

export interface CustomField {
  id: string;
  projectId: string;
  name: string;
  fieldType: 'text' | 'number' | 'date' | 'select' | 'textarea' | 'file';
  options?: string;
  required: boolean;
  order: number;
}

export interface PipelineStageConfig {
  key: string;
  label: string;
  color: string;
  order: number;
}

// Configuraciones por defecto
export const DEFAULT_PIPELINE_STAGES: Array<{ key: string; label: string; color: string }> = [
  { key: 'LEAD', label: 'Nuevo Lead', color: '#3b82f6' },
  { key: 'CONTACTADO', label: 'Contactado', color: '#8b5cf6' },
  { key: 'REUNION', label: 'Reunión', color: '#f59e0b' },
  { key: 'PROPUESTA', label: 'Propuesta', color: '#06b6d4' },
  { key: 'NEGOCIACION', label: 'Negociación', color: '#ec4899' },
  { key: 'CONTRATO', label: 'Contrato', color: '#10b981' },
  { key: 'PERDIDA', label: 'Perdido', color: '#ef4444' },
];

export const STAGE_COLORS = [
  '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899', '#10b981', '#ef4444',
  '#6366f1', '#14b8a6', '#f97316', '#84cc16', '#a855f7', '#0ea5e9',
];

export const LOST_REASONS = [
  { key: 'precio', label: 'Precio muy alto', description: 'El prospecto considera que el precio excede su presupuesto' },
  { key: 'competencia', label: 'Competencia', description: 'El prospecto eligió a un competidor' },
  { key: 'tiempo', label: 'Tiempo', description: 'El prospecto decidió posponer la decisión' },
  { key: 'necesidad', label: 'Sin necesidad', description: 'El prospecto ya no necesita el producto/servicio' },
  { key: 'contacto', label: 'Sin contacto', description: 'No se pudo contactar al prospecto' },
  { key: 'otro', label: 'Otro', description: 'Otra razón no especificada' },
];

export const LEAD_SOURCES = [
  { key: 'manual', label: 'Manual', icon: '📝' },
  { key: 'formulario', label: 'Formulario Web', icon: '🌐' },
  { key: 'facebook_ads', label: 'Facebook Ads', icon: '📘' },
  { key: 'instagram_ads', label: 'Instagram Ads', icon: '📷' },
  { key: 'google_ads', label: 'Google Ads', icon: '🔍' },
  { key: 'referral', label: 'Referido', icon: '👥' },
  { key: 'whatsapp', label: 'WhatsApp', icon: '💬' },
  { key: 'other', label: 'Otro', icon: '📌' },
];

export const DEFAULT_USERS: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin',
    name: 'Administrador',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'vendedor',
    password: 'vendedor',
    name: 'Vendedor',
    role: 'vendedor',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'viewer',
    password: 'viewer',
    name: 'Solo Lectura',
    role: 'viewer',
    createdAt: new Date().toISOString(),
  },
];

export const ROLE_PERMISSIONS: Record<UserRole, { label: string; description: string; canCreateLead: boolean; canEditLead: boolean; canDeleteLead: boolean; canImport: boolean; canExport: boolean; canManageUsers: boolean; canManageProjects: boolean; canManagePipeline: boolean }> = {
  admin: {
    label: 'Administrador',
    description: 'Acceso total a todas las funciones',
    canCreateLead: true,
    canEditLead: true,
    canDeleteLead: true,
    canImport: true,
    canExport: true,
    canManageUsers: true,
    canManageProjects: true,
    canManagePipeline: true,
  },
  vendedor: {
    label: 'Vendedor',
    description: 'Puede gestionar leads pero no configurar el sistema',
    canCreateLead: true,
    canEditLead: true,
    canDeleteLead: true,
    canImport: true,
    canExport: true,
    canManageUsers: false,
    canManageProjects: false,
    canManagePipeline: false,
  },
  viewer: {
    label: 'Solo Lectura',
    description: 'Solo puede ver la información',
    canCreateLead: false,
    canEditLead: false,
    canDeleteLead: false,
    canImport: false,
    canExport: true,
    canManageUsers: false,
    canManageProjects: false,
    canManagePipeline: false,
  },
};
