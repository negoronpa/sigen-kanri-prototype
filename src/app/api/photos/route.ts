import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "Google Maps API key is not configured" }, { status: 500 });
    }

    try {
        // 1. Search for the place to get place_id
        // We use location bias if lat/lng are provided for better accuracy
        const locationBias = lat && lng ? `&locationbias=circle:5000@${lat},${lng}` : "";
        const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
            name
        )}&inputtype=textquery&fields=photos,place_id${locationBias}&key=${apiKey}`;

        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (searchData.status !== "OK" || !searchData.candidates?.[0]?.photos?.[0]) {
            return NextResponse.json({ photoUrl: null });
        }

        const photoReference = searchData.candidates[0].photos[0].photo_reference;

        // 2. Construct the photo URL
        // Note: We return the direct Google API URL for the photo. 
        // Maxwidth 800 is usually enough for a card.
        const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=${apiKey}`;

        return NextResponse.json({ photoUrl });
    } catch (error) {
        console.error("Error fetching photo:", error);
        return NextResponse.json({ error: "Failed to fetch photo" }, { status: 500 });
    }
}
