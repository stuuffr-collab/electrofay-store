
import { adminSupabase } from "./supabaseClient";

async function run() {
    console.log("Testing simple fetch of offers (no joins)...");

    // 1. Fetch all offers without any filters or joins
    const { data: allOffers, error: allError } = await adminSupabase
        .from('offers')
        .select('*');

    if (allError) {
        console.error("Error fetching all offers:", JSON.stringify(allError, null, 2));
    } else {
        console.log(`Fetched ${allOffers?.length} offers (raw select *)`);
        if (allOffers && allOffers.length > 0) {
            console.log("Sample offer:", JSON.stringify(allOffers[0], null, 2));
        }
    }

    // 2. Fetch with deleted_at filter only
    const { data: activeOffers, error: activeError } = await adminSupabase
        .from('offers')
        .select('*')
        .is('deleted_at', null);

    if (activeError) {
        console.error("Error fetching non-deleted offers:", JSON.stringify(activeError, null, 2));
    } else {
        console.log(`Fetched ${activeOffers?.length} non-deleted offers`);
    }
}

run();
