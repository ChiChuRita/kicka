import { Input } from "@kicka/components/ui/input";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";

export default function TeamName<FM extends FieldValues>(
  props: UseControllerProps<FM>,
) {
  const { field } = useController(props);
  return <Input type="text" {...field} />; 
}
