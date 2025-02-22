import { Indicator, Root } from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

export interface CheckboxProps {
  defaulChecked?: boolean;
  label?: string;
  id?: string;
  name: string;
  disabled?: boolean;
}
function Checkbox(props: CheckboxProps) {
  return (
    <label htmlFor={props.id} className="inline-flex flex-col">
      {Boolean(props.label) && <span className="mb-2">{props.label}</span>}
      <Root
        id={props.id}
        defaultChecked={props.defaulChecked}
        className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-solid border-color-border bg-white p-1 outline-none hover:border-color-primary hover:bg-color-background focus-visible:border-color-primary disabled:cursor-not-allowed disabled:border-color-border disabled:bg-color-background"
        name={props.name}
        disabled={props.disabled}
      >
        <Indicator asChild>
          <CheckIcon size={16} className="text-color-primary" />
        </Indicator>
      </Root>
    </label>
  );
}

export default Checkbox;
