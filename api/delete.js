import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { filename } = JSON.parse(req.body);

    // 1. borrar de Storage
    const { error: storageError } = await supabase.storage
      .from("Imagenes")
      .remove([filename]);

    // 2. borrar de la tabla
    const { error: dbError } = await supabase
      .from("imagenes")
      .delete()
      .eq("filename", filename);

    if (storageError || dbError) {
      return res.status(400).json({
        ok: false,
        storageError,
        dbError
      });
    }

    return res.status(200).json({ ok: true });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
