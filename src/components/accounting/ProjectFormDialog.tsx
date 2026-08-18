"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClinicStore } from "@/lib/store";
import { projectSchema, type ProjectFormValues } from "@/lib/validation/project-schema";
import type { Project, ProjectStatus } from "@/types/accounting/project";

const DEFAULT_VALUES: ProjectFormValues = {
  nama: "",
  tanggalMulai: "",
  tanggalSelesai: "",
  status: "aktif",
};

interface ProjectFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

export function ProjectFormDialog({ open, onOpenChange, project }: ProjectFormDialogProps) {
  const addProject = useClinicStore((s) => s.addProject);
  const updateProject = useClinicStore((s) => s.updateProject);
  const isEdit = Boolean(project);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) return;
    reset(
      project
        ? {
            nama: project.nama,
            tanggalMulai: project.tanggalMulai ?? "",
            tanggalSelesai: project.tanggalSelesai ?? "",
            status: project.status,
          }
        : DEFAULT_VALUES
    );
  }, [open, project, reset]);

  const status = watch("status");

  const onSubmit = (values: ProjectFormValues) => {
    const payload = {
      ...values,
      tanggalMulai: values.tanggalMulai || undefined,
      tanggalSelesai: values.tanggalSelesai || undefined,
    };
    if (isEdit && project) {
      updateProject(project.id, payload);
      toast.success("Project updated successfully");
    } else {
      addProject(payload);
      toast.success("Project added successfully");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Project" : "Add Project"}</DialogTitle>
          <DialogDescription>Track transactions by project.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid max-h-[85vh] gap-3 overflow-y-auto overflow-x-hidden pr-1"
        >
          <div className="grid gap-1.5">
            <Label htmlFor="nama">Name</Label>
            <Input id="nama" {...register("nama")} placeholder="Renovasi Klinik" />
            {errors.nama && <p className="text-xs text-destructive">{errors.nama.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label htmlFor="tanggalMulai">Start Date (optional)</Label>
              <Input id="tanggalMulai" type="date" {...register("tanggalMulai")} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="tanggalSelesai">End Date (optional)</Label>
              <Input id="tanggalSelesai" type="date" {...register("tanggalSelesai")} />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => v && setValue("status", v as ProjectStatus, { shouldValidate: true })}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aktif">Aktif</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEdit ? "Save Changes" : "Add Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
