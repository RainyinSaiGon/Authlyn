import { getJson } from "@/shared/api/http";
import type { PublicMeta } from "@/shared/types/system";

export function getPublicMeta() {
  return getJson<PublicMeta>("/api/public/meta");
}
