"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Ticket, Loader2 } from "lucide-react";
import { redeemFreeClass } from "../../actions";
import { btn } from "../../_components/ui";

export default function FreeClassActions({ code }: { code: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await redeemFreeClass(code);
          if (res.ok) toast.success(res.message);
          else toast.error(res.message);
          router.refresh();
        })
      }
      className={`${btn.primary} h-14 text-lg w-full sm:w-auto`}
    >
      {pending ? <Loader2 size={20} className="animate-spin" /> : <Ticket size={20} />}
      {pending ? "Registrando…" : "Registrar clase gratis"}
    </button>
  );
}
