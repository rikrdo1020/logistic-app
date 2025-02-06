import { createClient } from "../config/components";

const supabase = createClient();

export async function addPackage(
  userId: string,
  trackingNumber: string,
  weight: number,
  price: number
) {
  const { data, error } = await supabase
    .from("packages")
    .insert([
      { user_id: userId, tracking_number: trackingNumber, weight, price },
    ]);

  if (error) {
    console.error("Error al agregar paquete:", error.message);
    return null;
  }

  return data;
}

export async function getUserPackages(userId: string) {
  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false }); // Ordenar por fecha de creación

  if (error) {
    console.error("Error al obtener paquetes:", error.message);
    return [];
  }

  return data;
}

export async function updatePackageStatus(
  packageId: string,
  status: "pending" | "in_transit" | "delivered"
) {
  const { error } = await supabase
    .from("packages")
    .update({ status })
    .eq("id", packageId);

  if (error) {
    console.error("Error al actualizar estado del paquete:", error.message);
  }
}

export async function deletePackage(packageId: string) {
  const { error } = await supabase
    .from("packages")
    .delete()
    .eq("id", packageId);

  if (error) {
    console.error("Error al eliminar paquete:", error.message);
  }
}
