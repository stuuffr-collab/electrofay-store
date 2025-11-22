
import { adminSupabase } from "./supabaseClient";

async function run() {
    // Decode JWT to check role (simple check)
    const key = (adminSupabase as any).supabaseKey || '';
    try {
        const payload = JSON.parse(atob(key.split('.')[1]));
        console.log("Admin Client Role:", payload.role);
    } catch (e) {
        console.log("Could not decode key role");
    }

    console.log("Attempting to fetch offers...");
    try {
        const { data: offers, error, count } = await adminSupabase
            .from('offers')
            .select(`
        *,
        offer_products (
          id,
          product_id,
          quantity,
          display_order,
          products (
            id,
            name,
            price,
            image_url:image
          )
        )
      `, { count: 'exact' })
            .is('deleted_at', null);

        if (error) {
            console.error("Error fetching offers:", JSON.stringify(error, null, 2));
        } else {
            console.log("Successfully fetched offers. Count:", offers?.length);
            if (offers && offers.length > 0) {
                console.log("First offer:", JSON.stringify(offers[0], null, 2));
            } else {
                console.log("No offers found.");
            }
        }
    } catch (err) {
        console.error("Unexpected error:", err);
    }
}

run();
