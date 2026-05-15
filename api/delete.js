import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {

    // 🚀 SIN JSON.parse
    const { filename } = req.body;

    console.log("Borrando:", filename);

    // STORAGE

    const { error: storageError } =
    await supabase.storage
      .from("Imagenes")
      .remove([filename]);

    // DB

    const { error: dbError } =
    await supabase
      .from("Imagenes")
      .delete()
      .eq("filename", filename);

    if (storageError || dbError) {

      console.log(storageError);
      console.log(dbError);

      return res.status(400).json({
        ok:false,
        storageError,
        dbError
      });
    }

    return res.status(200).json({
      ok:true
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      error: err.message
    });
  }
}
