import * as Select from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

import { LabelValuePair } from "~/types";

export interface SelectInputProps {
  onValueChange?: (value: string) => void;
  value?: string | null;
  options: LabelValuePair[];
  className?: string;
  placeholder?: string;
  name: string;
  ariaLabel: string;
}
function SelectInput(props: SelectInputProps) {
  const sanitizedValue = useMemo(() => {
    if (typeof props.value === "undefined") {
      return undefined;
    }
    if (!props.value || !props.options.find((o) => o.value === props.value)) {
      return "";
    }

    return props.value;
  }, [props.options, props.value]);

  return (
    <Select.Root
      onValueChange={props.onValueChange}
      value={sanitizedValue}
      name={props.name}
      key={props.name}
    >
      <Select.Trigger
        aria-label={props.ariaLabel}
        className={twMerge(
          "border-color-border focus-visible:border-color-primary flex min-w-48 items-center justify-between rounded-md border border-solid p-2 focus:outline-none",
          props.className,
        )}
      >
        <span className="truncate p-0.5">
          <Select.Value placeholder={props.placeholder} />
        </span>
        <Select.Icon className="flex items-center" aria-hidden={false}>
          <ChevronDownIcon className="text-color-light" size={16} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Content className="border-color-border z-menu rounded border border-solid bg-white">
        <Select.ScrollUpButton className="border-color-border cursor-pointer border-b border-solid">
          <ChevronUpIcon className="text-color-border mx-auto" />
        </Select.ScrollUpButton>
        <Select.Viewport>
          {props.options.map((option) => {
            return (
              <Select.Item
                key={option.value}
                value={option.value}
                className="hover:bg-color-background data-[highlighted]:bg-color-background border-color-border data-[state=checked]:text-color-primary flex max-w-full cursor-pointer items-center justify-between border-b p-4 outline-none last-of-type:border-b-0"
              >
                <Select.ItemText asChild>
                  <span className="mr-1 max-w-full truncate">
                    {option.label}
                  </span>
                </Select.ItemText>
                <Select.ItemIndicator>
                  <CheckIcon size={16} className="text-color-primary" />
                </Select.ItemIndicator>
              </Select.Item>
            );
          })}
        </Select.Viewport>
        <Select.ScrollDownButton className="border-color-border cursor-pointer border-t border-solid">
          <ChevronDownIcon className="text-color-border mx-auto" />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Root>
  );
}

export default SelectInput;
