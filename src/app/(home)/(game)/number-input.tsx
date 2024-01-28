import { Button } from "@kicka/components/ui/button";
import { Input } from "@kicka/components/ui/input";
import { useField } from "@tanstack/react-form";

interface NumberInputProps {
  inputName: string;
}

export default function NumberInput({ inputName }: NumberInputProps) {
  const { name, Field } = useField<any, any, any, any>({ name: inputName });

  return (
    <Field
      name={name}
      children={(field) => (
        <Input
          type="number"
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(Number.parseInt(e.target.value))}
        />
      )}
    />
  );
}
