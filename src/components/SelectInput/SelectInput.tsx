import { Label } from "@radix-ui/react-label";
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
  label?: string;
  error?: string | null;
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
    <Label className="inline-block">
      {Boolean(props.label) && (
        <span className="mb-2 block">{props.label}</span>
      )}
      <Select.Root
        onValueChange={props.onValueChange}
        value={sanitizedValue}
        name={props.name}
        key={props.name}
      >
        <Select.Trigger
          aria-label={props.ariaLabel}
          className={twMerge(
            "mb-2 flex min-w-48 items-center justify-between rounded-md border border-solid border-color-border p-2 focus:outline-none focus-visible:border-color-primary",
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
        <Select.Content className="z-menu rounded border border-solid border-color-border bg-white">
          <Select.ScrollUpButton className="cursor-pointer border-b border-solid border-color-border">
            <ChevronUpIcon className="mx-auto text-color-border" />
          </Select.ScrollUpButton>
          <Select.Viewport>
            {props.options.map((option) => {
              return (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="flex max-w-full cursor-pointer items-center justify-between border-b border-color-border p-4 outline-none last-of-type:border-b-0 hover:bg-color-background data-[highlighted]:bg-color-background data-[state=checked]:text-color-primary"
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
          <Select.ScrollDownButton className="cursor-pointer border-t border-solid border-color-border">
            <ChevronDownIcon className="mx-auto text-color-border" />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Root>
      {Boolean(props.error) && (
        <span className="text-color-error">{props.error}</span>
      )}
    </Label>
  );
}

export default SelectInput;
