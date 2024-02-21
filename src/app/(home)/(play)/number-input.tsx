"use client";

import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

import { Button } from "@kicka/components/ui/button";
import { Input } from "@kicka/components/ui/input";
import { MAX_SCORE } from "@kicka/lib/constants";

export default function NumberInput<FM extends FieldValues>(
  props: UseControllerProps<FM>,
) {
  const { field } = useController(props);

  return (
    <div className="flex flex-row">
      <Button
        type="button"
        variant="outline"
        className="rounded-none rounded-l border-r-0"
        onClick={() => {
          const value = (field.value as number) - 10;
          field.onChange(Math.max(0, value));
        }}
      >
        -10
      </Button>
      <Button
        type="button"
        variant="outline"
        className="rounded-none border-r-0"
        onClick={() => {
          const value = (field.value as number) - 1;
          field.onChange(Math.max(0, value));
        }}
      >
        -1
      </Button>
      <Input
        type="number"
        className="z-10 flex h-9 w-24 rounded-none text-center text-lg hover:outline-none"
        {...field}
      />
      <Button
        type="button"
        className="rounded-none border-l-0 p-3"
        variant="outline"
        onClick={() => {
          const value = (field.value as number) + 1;
          field.onChange(Math.min(MAX_SCORE, value));
        }}
      >
        +1
      </Button>
      <Button
        type="button"
        variant="outline"
        className="rounded-none rounded-r border-l-0"
        onClick={() => {
          const value = (field.value as number) + 10;
          field.onChange(Math.min(MAX_SCORE, value));
        }}
      >
        +10
      </Button>
    </div>
  );
}
