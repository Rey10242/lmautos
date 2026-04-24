-- ============================================================
-- 1) Sistema de roles
-- ============================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'super_admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Función security definer para evitar recursión
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

CREATE POLICY "Usuarios ven sus propios roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Super admins ven todos los roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins gestionan roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'super_admin'));

-- Actualizar is_admin() para que use la tabla de roles (cualquier rol = admin del backoffice)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = auth.uid()
  );
$$;

-- Sembrar super_admin: el primer (y único) usuario existente
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'super_admin'::public.app_role
FROM auth.users
ORDER BY created_at ASC
LIMIT 1
ON CONFLICT (user_id, role) DO NOTHING;

-- También otórgale rol admin para mantener acceso al resto del backoffice
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
ORDER BY created_at ASC
LIMIT 1
ON CONFLICT (user_id, role) DO NOTHING;

-- ============================================================
-- 2) Tabla de auditoría
-- ============================================================
CREATE TABLE public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_id uuid,                    -- auth.uid() del que ejecutó
  actor_email text,                 -- snapshot del email
  table_name text NOT NULL,
  record_id uuid,
  action text NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  old_data jsonb,
  new_data jsonb,
  changed_fields text[]
);

CREATE INDEX idx_audit_logs_occurred_at ON public.audit_logs (occurred_at DESC);
CREATE INDEX idx_audit_logs_actor ON public.audit_logs (actor_id);
CREATE INDEX idx_audit_logs_table_record ON public.audit_logs (table_name, record_id);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Solo super admins pueden ver la bitácora
CREATE POLICY "Super admins ven la auditoría"
  ON public.audit_logs FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'super_admin'));

-- Nadie puede editar/eliminar logs (solo escritos por triggers SECURITY DEFINER)
-- Sin policies de INSERT/UPDATE/DELETE => bloqueado para clientes.

-- ============================================================
-- 3) Función trigger genérica para auditar
-- ============================================================
CREATE OR REPLACE FUNCTION public.audit_trigger_fn()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_actor uuid := auth.uid();
  v_email text;
  v_old jsonb;
  v_new jsonb;
  v_changed text[] := ARRAY[]::text[];
  v_record_id uuid;
  k text;
BEGIN
  -- Email del actor (puede ser null si la acción fue del service_role)
  IF v_actor IS NOT NULL THEN
    SELECT email INTO v_email FROM auth.users WHERE id = v_actor;
  END IF;

  IF (TG_OP = 'DELETE') THEN
    v_old := to_jsonb(OLD);
    v_record_id := (v_old->>'id')::uuid;
  ELSIF (TG_OP = 'INSERT') THEN
    v_new := to_jsonb(NEW);
    v_record_id := (v_new->>'id')::uuid;
  ELSE -- UPDATE
    v_old := to_jsonb(OLD);
    v_new := to_jsonb(NEW);
    v_record_id := (v_new->>'id')::uuid;
    -- Calcular columnas que cambiaron
    FOR k IN SELECT jsonb_object_keys(v_new) LOOP
      IF (v_old->k) IS DISTINCT FROM (v_new->k) THEN
        v_changed := array_append(v_changed, k);
      END IF;
    END LOOP;
    -- Si nada cambió, no registramos
    IF array_length(v_changed, 1) IS NULL THEN
      RETURN NEW;
    END IF;
  END IF;

  INSERT INTO public.audit_logs
    (actor_id, actor_email, table_name, record_id, action, old_data, new_data, changed_fields)
  VALUES
    (v_actor, v_email, TG_TABLE_NAME, v_record_id, TG_OP, v_old, v_new,
     CASE WHEN TG_OP = 'UPDATE' THEN v_changed ELSE NULL END);

  IF (TG_OP = 'DELETE') THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;

-- ============================================================
-- 4) Triggers en vehicles y consignment_requests
-- ============================================================
CREATE TRIGGER vehicles_audit
AFTER INSERT OR UPDATE OR DELETE ON public.vehicles
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();

CREATE TRIGGER consignment_requests_audit
AFTER INSERT OR UPDATE OR DELETE ON public.consignment_requests
FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_fn();