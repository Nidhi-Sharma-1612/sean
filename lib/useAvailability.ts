"use client";

import { useEffect, useState } from "react";
import type { AvailabilityResponse } from "@/lib/availability";

export function useAvailability() {
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/availability", { signal: controller.signal })
      .then((res) => res.json() as Promise<AvailabilityResponse>)
      .then(setAvailability)
      .catch((error: unknown) => {
        if (!controller.signal.aborted) {
          console.error(error);
          setAvailability({ status: "error" });
        }
      });

    return () => controller.abort();
  }, []);

  return availability;
}
