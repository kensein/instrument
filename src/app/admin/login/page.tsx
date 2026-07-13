import { Suspense } from "react";

import AdminLoginForm from "./login-form";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="text-sm text-slate-500">Memuat...</div>}
    >
      <AdminLoginForm />
    </Suspense>
  );
}
