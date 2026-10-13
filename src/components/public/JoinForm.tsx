import { useMemo, useState, type ChangeEvent, type ComponentProps, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadOptimizedImage } from "@/lib/storage";
import { supabase } from "@/lib/supabase";

const departments = {
  Bachelor: ["APM", "APS", "ST"],
  Masters: ["APS", "MBA"],
  Alumni: ["APM", "APS", "ST", "MBA"],
} as const;

type DegreeLevel = keyof typeof departments;

export function JoinForm() {
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel>("Bachelor");
  const [department, setDepartment] = useState<string>(departments.Bachelor[0]);
  const [preview, setPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const availableDepartments = useMemo(() => departments[degreeLevel], [degreeLevel]);

  function handleDegreeChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLevel = event.target.value as DegreeLevel;
    setDegreeLevel(nextLevel);
    setDepartment(departments[nextLevel][0]);
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function submitApplication(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) {
      setErrorMessage("Supabase is not configured.");
      return;
    }
    setSaving(true);
    setErrorMessage(null);

    try {
      const formData = new FormData(event.currentTarget);
      const imageUrl = imageFile
        ? await uploadOptimizedImage(imageFile, "bsa-gallery", "members")
        : null;
      const { error } = await supabase.from("members").insert({
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        semester: String(formData.get("semester") ?? "").trim(),
        student_id: String(formData.get("student_id") ?? "").trim(),
        nationality: "Bangladeshi",
        degree_level: degreeLevel,
        department,
        instagram_url: String(formData.get("instagram_url") ?? "").trim() || null,
        facebook_url: String(formData.get("facebook_url") ?? "").trim() || null,
        image_url: imageUrl,
        approval_status: "pending",
      });
      if (error) throw error;
      setSubmitted(true);
      event.currentTarget.reset();
      setPreview(null);
      setImageFile(null);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not submit your application.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (submitted) {
    return (
      <div className="border-t-4 border-primary bg-card p-8 text-center shadow-sm">
        <h2 className="text-3xl">Application received</h2>
        <p className="mt-3 text-muted-foreground">
          Thank you for joining BSA. An administrator will review your application soon.
        </p>
        <Button asChild className="mt-6">
          <Link to="/">Return home</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitApplication}
      className="space-y-6 border-t-4 border-primary bg-card p-6 shadow-sm md:p-8"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name" name="name" required />
        <Field label="Email address" name="email" type="email" required />
        <Field label="Semester" name="semester" placeholder="e.g. 3rd semester" required />
        <Field label="Student ID" name="student_id" required />
        <Field label="Nationality" name="nationality" value="Bangladeshi" readOnly />
        <label className="grid gap-2 text-sm font-medium">
          Degree level
          <select
            name="degree_level"
            value={degreeLevel}
            onChange={handleDegreeChange}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {Object.keys(departments).map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Department
          <select
            name="department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {availableDepartments.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium md:col-span-2">
          Profile picture
          <Input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && (
            <img
              src={preview}
              alt="Profile preview"
              className="h-24 w-24 rounded-full object-cover"
            />
          )}
          <span className="text-xs font-normal text-muted-foreground">
            Your picture will be compressed and displayed as a circular avatar.
          </span>
        </label>
        <Field
          label="Instagram URL"
          name="instagram_url"
          type="url"
          placeholder="https://instagram.com/..."
        />
        <Field
          label="Facebook URL"
          name="facebook_url"
          type="url"
          placeholder="https://facebook.com/..."
        />
      </div>
      {errorMessage && (
        <p role="alert" className="text-sm text-destructive">
          {errorMessage}
        </p>
      )}
      <Button type="submit" disabled={saving}>
        {saving ? "Submitting..." : "Submit application"}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  ...props
}: { label: string; name: string } & ComponentProps<typeof Input>) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <Input name={name} {...props} />
    </label>
  );
}
