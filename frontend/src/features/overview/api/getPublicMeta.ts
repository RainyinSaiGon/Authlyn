import { getJson } from "@/shared/api/http";
import { apiBaseUrl } from "@/shared/config/env";
import type { PublicMeta } from "@/shared/types/system";

export function getPublicMeta() {
  return getJson<PublicMeta>(`${apiBaseUrl}/api/public/meta`);
}
