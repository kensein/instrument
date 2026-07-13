"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import type { Equipment } from "@/lib/types";
import { apiUrl } from "@/lib/paths";
import { cn } from "@/lib/utils";

const bookingSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Nama lengkap minimal 3 karakter")
      .max(100, "Nama terlalu panjang"),
    identityNumber: z
      .string()
      .min(8, "NIK/NIP minimal 8 karakter")
      .max(20, "NIK/NIP terlalu panjang")
      .regex(/^[0-9]+$/, "NIK/NIP hanya boleh berisi angka"),
    email: z.string().email("Format email tidak valid"),
    whatsapp: z
      .string()
      .min(10, "Nomor WhatsApp minimal 10 digit")
      .max(15, "Nomor WhatsApp terlalu panjang")
      .regex(/^[0-9+]+$/, "Gunakan format nomor yang valid"),
    startDate: z.date({ error: "Tanggal mulai wajib diisi" }),
    endDate: z.date({ error: "Tanggal selesai wajib diisi" }),
    quantity: z
      .number({ error: "Jumlah alat wajib diisi" })
      .int("Jumlah harus bilangan bulat")
      .min(1, "Minimal 1 unit")
      .max(50, "Maksimal 50 unit per permohonan"),
    purpose: z
      .string()
      .min(20, "Jelaskan tujuan penggunaan (minimal 20 karakter)")
      .max(1000, "Tujuan penggunaan terlalu panjang"),
  })
  .refine((data) => data.endDate >= data.startDate, {
    message: "Tanggal selesai harus sama atau setelah tanggal mulai",
    path: ["endDate"],
  });

type BookingFormValues = z.infer<typeof bookingSchema>;

type BookingFormProps = {
  equipment: Equipment;
};

export function BookingForm({ equipment }: BookingFormProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      identityNumber: "",
      email: "",
      whatsapp: "",
      quantity: 1,
      purpose: "",
    },
  });

  async function onSubmit(values: BookingFormValues) {
    setSubmitting(true);
    try {
      const res = await fetch(apiUrl("/bookings"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipmentId: equipment.id,
          fullName: values.fullName,
          identityNumber: values.identityNumber,
          email: values.email,
          whatsapp: values.whatsapp,
          startDate: values.startDate.toISOString(),
          endDate: values.endDate.toISOString(),
          quantity: values.quantity,
          purpose: values.purpose,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Gagal mengirim permohonan");
        return;
      }

      setOpen(false);
      form.reset();
      toast.success("Permohonan sewa berhasil dikirim", {
        description: `Permohonan untuk ${equipment.name} (${equipment.id}) atas nama ${values.fullName} telah diterima. Tim PSIMKG akan menghubungi Anda melalui WhatsApp/email.`,
      });
    } catch {
      toast.error("Terjadi kesalahan jaringan");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="h-11 w-full bg-amber-500 text-slate-900 hover:bg-amber-400 sm:w-auto sm:min-w-56"
        >
          Pesan Sekarang
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-slate-900">
            Form Permohonan Sewa
          </DialogTitle>
          <DialogDescription>
            Lengkapi data berikut untuk mengajukan sewa{" "}
            <span className="font-medium text-slate-700">{equipment.name}</span>.
            Tim PSIMKG akan memverifikasi ketersediaan dan menghubungi Anda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FieldGroup>
            <Controller
              control={form.control}
              name="fullName"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="fullName">Nama Lengkap</FieldLabel>
                  <Input
                    {...field}
                    id="fullName"
                    placeholder="Sesuai KTP / identitas resmi"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="identityNumber"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="identityNumber">NIK / NIP</FieldLabel>
                  <Input
                    {...field}
                    id="identityNumber"
                    inputMode="numeric"
                    placeholder="Nomor Induk Kependudukan atau Pegawai"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      placeholder="nama@instansi.go.id"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="whatsapp"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="whatsapp">Nomor WhatsApp</FieldLabel>
                    <Input
                      {...field}
                      id="whatsapp"
                      inputMode="tel"
                      placeholder="08xxxxxxxxxx"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="startDate"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tanggal Mulai</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "h-9 w-full justify-start font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          aria-invalid={fieldState.invalid}
                        >
                          <CalendarIcon />
                          {field.value
                            ? format(field.value, "d MMMM yyyy", {
                                locale: localeId,
                              })
                            : "Pilih tanggal"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={{ before: new Date() }}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="endDate"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tanggal Selesai</FieldLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "h-9 w-full justify-start font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          aria-invalid={fieldState.invalid}
                        >
                          <CalendarIcon />
                          {field.value
                            ? format(field.value, "d MMMM yyyy", {
                                locale: localeId,
                              })
                            : "Pilih tanggal"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={{ before: new Date() }}
                        />
                      </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="quantity"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="quantity">Jumlah Alat</FieldLabel>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    max={50}
                    value={field.value}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="purpose"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="purpose">Tujuan Penggunaan</FieldLabel>
                  <Textarea
                    {...field}
                    id="purpose"
                    rows={4}
                    placeholder="Jelaskan kegiatan, lokasi, dan tujuan penggunaan alat secara singkat..."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            disabled={submitting}
            className="h-10 w-full bg-slate-900 text-white hover:bg-slate-800"
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" />
                Mengirim...
              </>
            ) : (
              "Kirim Permohonan Sewa"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
