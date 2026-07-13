import { Suspense } from "react";

import AdminLoginForm from "./login-form";

// Nonce-based CSP requires dynamic rendering (nonce is injected per request).
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="text-sm text-slate-500">Memuat...</div>}
    >
      <AdminLoginForm />
    </Suspense>
  );
}
