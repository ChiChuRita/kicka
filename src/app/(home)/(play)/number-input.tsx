import { Alert, AlertDescription } from "@kicka/components/ui/alert";
import { Minus, Plus } from "lucide-react";
import { UseControllerProps, useController } from "react-hook-form";

import { Button } from "@kicka/components/ui/button";
import { FormSchema } from "./solo";
import { Input } from "@kicka/components/ui/input";
import { MAX_SCORE } from "@kicka/lib/constants";

export default function NumberInput(props: UseControllerProps<FormSchema>) {
  const { field, fieldState } = useController(props);

  return (
    <div className="flex flex-row">
      <Button
        type="button"
        variant="outline"
        className="h-10 w-10 rounded-none rounded-l border-r-0"
        onClick={() => {
          const value = (field.value as number) - 1;
          field.onChange(Math.max(0, value));
        }}
      >
        -1
        <Minus />
      </Button>
      <Input
        type="number"
        className="z-10 flex w-12 rounded-none text-center hover:outline-none"
        {...field}
        onChange={(evt) => {
          const value = Number.parseInt(evt.target.value, 10);
          field.onChange(value);
        }}
      />
      <Button
        type="button"
        className="h-10 w-10 rounded-none rounded-r border-l-0 p-3"
        variant="outline"
        onClick={() => {
          const value = (field.value as number) + 1;
          field.onChange(Math.min(MAX_SCORE, value));
        }}
      >
        +1
        <Plus />
      </Button>
    </div>
  );
}
