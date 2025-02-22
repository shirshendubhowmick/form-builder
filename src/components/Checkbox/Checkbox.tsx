import { Indicator, Root } from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export interface CheckboxProps {
  defaulChecked?: boolean;
  label?: string;
  id?: string;
  name: string;
  disabled?: boolean;
  className?: string;
}
function Checkbox(props: CheckboxProps) {
  return (
    <label
      htmlFor={props.id}
      className={twMerge("inline-flex items-center", props.className)}
    >
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
      {Boolean(props.label) && <span className="ml-2">{props.label}</span>}
    </label>
  );
}

export default Checkbox;
