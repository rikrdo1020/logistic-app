import { createClient } from "../config/components";

const supabase = createClient();

export async function registerUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error(error);
    return;
  }

  // Verificar si `data.user` existe antes de acceder a su `id`
  if (!data || !data.user) {
    console.error("Error: No se pudo obtener el usuario después del registro.");
    return;
  }

  // Insertar en la tabla de perfiles con el rol de cliente por defecto
  const { error: profileError } = await supabase
    .from("profiles")
    .insert([{ id: data.user.id, email, role: "customer" }]);

  if (profileError) {
    console.error("Error al insertar en profiles:", profileError);
  }
}

export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error(error);
    return;
  }

  // Obtener el rol del usuario
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profileError) {
    console.error(profileError);
    return;
  }

  // Guardar el rol en el estado o en cookies/localStorage
  return profile.role;
}
