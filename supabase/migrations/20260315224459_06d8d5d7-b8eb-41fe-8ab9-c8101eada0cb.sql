
ALTER TABLE vehicles ADD COLUMN ubicacion text NOT NULL DEFAULT 'sala';
ALTER TABLE vehicles ADD COLUMN tipo_propiedad text NOT NULL DEFAULT 'propio';
ALTER TABLE vehicles ADD COLUMN propietario_nombre text;
ALTER TABLE vehicles ADD COLUMN propietario_telefono text;
ALTER TABLE vehicles ADD COLUMN propietario_cedula text;
ALTER TABLE vehicles ADD COLUMN propietario_notas text;
