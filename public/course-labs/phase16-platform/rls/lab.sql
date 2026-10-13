\set ON_ERROR_STOP on
-- Banco DESCARTÁVEL: cria roles/schema/tabela temporários na transação e desfaz ao final.
BEGIN;
CREATE ROLE lab_anon NOLOGIN;
CREATE ROLE lab_authenticated NOLOGIN;
CREATE SCHEMA auth;
-- Dublê SOMENTE de identidade: não valida JWT; não é autenticação Supabase.
CREATE FUNCTION auth.uid() RETURNS uuid LANGUAGE sql STABLE AS $$
 SELECT nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
GRANT USAGE ON SCHEMA public, auth TO lab_authenticated, lab_anon;
CREATE TABLE public.notes(id integer PRIMARY KEY, user_id uuid NOT NULL, body text NOT NULL);
INSERT INTO public.notes VALUES
 (1,'00000000-0000-0000-0000-00000000000a','nota A'),
 (2,'00000000-0000-0000-0000-00000000000b','nota B');
GRANT SELECT, INSERT, UPDATE ON public.notes TO lab_authenticated;
SET ROLE lab_authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-00000000000a',true);
DO $$ BEGIN
 IF (SELECT count(*) FROM public.notes) <> 2 THEN RAISE EXCEPTION 'baseline inesperado'; END IF;
 RAISE NOTICE 'BASELINE: Alice lê 2 linhas sem RLS';
END $$;
RESET ROLE;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
-- FORCE também sujeita o owner comum a RLS; superuser/BYPASSRLS continuam especiais.
ALTER TABLE public.notes FORCE ROW LEVEL SECURITY;
CREATE POLICY notes_read ON public.notes FOR SELECT TO lab_authenticated
 USING (auth.uid() = user_id);
CREATE POLICY notes_insert ON public.notes FOR INSERT TO lab_authenticated
 WITH CHECK (auth.uid() = user_id);
CREATE POLICY notes_update ON public.notes FOR UPDATE TO lab_authenticated
 USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
SET ROLE lab_authenticated;
DO $$ DECLARE affected integer; BEGIN
 IF (SELECT count(*) FROM public.notes) <> 1 THEN RAISE EXCEPTION 'SELECT isolation'; END IF;
 IF (SELECT body FROM public.notes WHERE id=1) <> 'nota A' THEN RAISE EXCEPTION 'own read'; END IF;
 INSERT INTO public.notes VALUES (3,auth.uid(),'nova nota A');
 UPDATE public.notes SET body='editada A' WHERE id=1;
 GET DIAGNOSTICS affected = ROW_COUNT;
 IF affected <> 1 THEN RAISE EXCEPTION 'own update'; END IF;
 UPDATE public.notes SET body='indevida' WHERE id=2;
 GET DIAGNOSTICS affected = ROW_COUNT;
 IF affected <> 0 THEN RAISE EXCEPTION 'cross update'; END IF;
 BEGIN
  INSERT INTO public.notes VALUES (4,'00000000-0000-0000-0000-00000000000b','indevida');
  RAISE EXCEPTION 'cross insert não foi bloqueado';
 EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'PASS cross INSERT negado'; END;
 BEGIN
  UPDATE public.notes SET user_id='00000000-0000-0000-0000-00000000000b' WHERE id=1;
  RAISE EXCEPTION 'transferência não foi bloqueada';
 EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'PASS WITH CHECK impediu transferência'; END;
 RAISE NOTICE 'PASS SELECT/INSERT/UPDATE próprios e isolamento Alice';
END $$;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-00000000000b',true);
DO $$ BEGIN
 IF (SELECT count(*) FROM public.notes) <> 1 OR (SELECT body FROM public.notes WHERE id=2) <> 'nota B' THEN RAISE EXCEPTION 'Bob isolation'; END IF;
 RAISE NOTICE 'PASS Bob lê apenas nota B intacta';
END $$;
SELECT set_config('request.jwt.claim.sub','',true);
DO $$ BEGIN
 IF EXISTS (SELECT 1 FROM public.notes) THEN RAISE EXCEPTION 'NULL uid deve ocultar linhas'; END IF;
 RAISE NOTICE 'PASS uid ausente: zero linhas';
END $$;
RESET ROLE;
SET ROLE lab_anon;
DO $$ BEGIN
 BEGIN PERFORM * FROM public.notes;
  RAISE EXCEPTION 'anon recebeu SELECT';
 EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'PASS anon sem grant'; END;
END $$;
RESET ROLE;
SET ROLE lab_authenticated;
SELECT set_config('request.jwt.claim.sub','00000000-0000-0000-0000-00000000000a',true);
DO $$ BEGIN
 IF (SELECT count(*) FROM public.notes) <> 2 OR EXISTS(SELECT 1 FROM public.notes WHERE id=2) THEN RAISE EXCEPTION 'reteste Alice'; END IF;
 RAISE NOTICE 'PASS reteste: Alice lê suas 2 notas e não lê Bob';
END $$;
RESET ROLE;
ROLLBACK;
