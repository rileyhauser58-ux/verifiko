"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";

export function PasswordInput({
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const checkboxId = `${inputId}-visible`;

  return (
    <div className="space-y-1.5">
      <Input id={inputId} type={visible ? "text" : "password"} {...props} />
      <label
        htmlFor={checkboxId}
        className="flex items-center gap-1.5 text-xs text-muted"
      >
        <input
          id={checkboxId}
          type="checkbox"
          checked={visible}
          onChange={(e) => setVisible(e.target.checked)}
        />
        Mostrar contraseña
      </label>
    </div>
  );
}
