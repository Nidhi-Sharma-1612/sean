import type { AvailabilityResponse } from "@/lib/availability";
import { getAvailability, isGuestyConfigured } from "@/lib/guesty";

function respond(body: AvailabilityResponse, status = 200) {
  return Response.json(body, { status });
}

export async function GET() {
  if (!isGuestyConfigured()) return respond({ status: "not-configured" });

  try {
    return respond({ status: "live", cabins: await getAvailability() });
  } catch (error) {
    console.error(error);
    return respond({ status: "error" }, 502);
  }
}
