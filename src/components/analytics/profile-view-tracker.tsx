"use client";

import { useEffect, useRef } from "react";

type ProfileViewTrackerProps = {
  tailorProfileId: string;
  skip?: boolean;
};

export function ProfileViewTracker({ tailorProfileId, skip = false }: ProfileViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (skip || tracked.current) return;
    tracked.current = true;

    void fetch("/api/analytics/profile-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tailorProfileId }),
      keepalive: true,
    });
  }, [skip, tailorProfileId]);

  return null;
}
