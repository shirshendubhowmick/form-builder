import { type VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const button = cva(
  "text-base disabled:hover:translate-y-0 disabled:active:translate-y-0 transition-transform focus-visible:outline-none will-change-transform disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
  {
    variants: {
      intent: {
        primary: "border border-solid rounded",
        secondary: "border border-solid rounded",
        tertiary: "",
        icon: "p-1 rounded",
      },
      color: {
        primary:
          "border-color-primary hover:bg-color-primary-hover  focus-visible:ring-offset-color-primary-hover focus-visible:ring-4",
        success:
          "border-color-success hover:bg-color-success-hover focus-visible:ring-color-success-hover focus-visible:ring-4",
        error:
          "border-color-error hover:bg-color-error-hover focus-visible:ring-color-error-hover focus-visible:ring-4",
      },
      size: {
        xs: "w-16 p-1 text-xs",
        sm: "w-24 p-2",
        md: "w-40 p-3",
        lg: "w-96 p-4",
        full: "w-full p-4",
      },
      disableAnimation: {
        true: "",
        false: "hover:-translate-y-px active:translate-y-px",
      },
    },
    compoundVariants: [
      {
        intent: "primary",
        color: "primary",
        class: "bg-color-primary text-white disabled:hover:bg-color-primary",
      },
      {
        intent: "primary",
        color: "success",
        class: "bg-color-success text-white disabled:hover:bg-color-success",
      },
      {
        intent: "primary",
        color: "error",
        class: "bg-color-error text-white disabled:hover:bg-color-error",
      },
      {
        intent: "secondary",
        color: "primary",
        class:
          "bg-transparent text-color-primary disabled:hover:text-color-primary disabled:hover:bg-transparent hover:text-white",
      },
      {
        intent: "secondary",
        color: "success",
        class:
          "bg-transparent text-color-success disabled:hover:text-color-success disabled:hover:bg-transparent hover:text-white",
      },
      {
        intent: "secondary",
        color: "error",
        class:
          "bg-transparent text-color-error disabled:hover:text-color-error disabled:hover:bg-transparent hover:text-white",
      },
      {
        intent: "tertiary",
        color: "primary",
        class:
          "text-color-primary hover:text-color-primary-hover hover:bg-transparent p-0 w-auto",
      },
      {
        intent: "tertiary",
        color: "success",
        class:
          "text-color-success hover:text-color-success-hover hover:bg-transparent p-0 w-auto",
      },
      {
        intent: "tertiary",
        color: "error",
        class:
          "text-color-error hover:text-color-error-hover hover:bg-transparent p-0 w-auto",
      },
      {
        intent: "icon",
        color: "primary",
        class:
          "text-color-primary hover:bg-color-background focus-visible:text-base-content focus-visible:bg-base-300 ",
      },
      {
        intent: "icon",
        color: "success",
        class:
          "text-color-success hover:bg-color-background focus-visible:text-base-content focus-visible:bg-base-300 ",
      },
      {
        intent: "icon",
        color: "error",
        class:
          "text-color-error hover:bg-color-background focus-visible:text-base-content focus-visible:bg-base-300 ",
      },
    ],
    defaultVariants: {
      disableAnimation: false,
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof button>;

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "size">,
    Omit<ButtonVariantProps, "intent">,
    Required<Pick<ButtonVariantProps, "intent">> {
  className?: string;
  type?: "button" | "submit" | "reset";
}

type Intent = NonNullable<ButtonProps["intent"]>;

export const INTENT: { [key in Intent]: Intent } = {
  primary: "primary",
  secondary: "secondary",
  tertiary: "tertiary",
  icon: "icon",
};

type Size = NonNullable<ButtonProps["size"]>;

export const SIZE: { [key in Size]: Size } = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  full: "full",
};

type Color = NonNullable<ButtonProps["color"]>;

export const COLOR: { [key in Color]: Color } = {
  primary: "primary",
  success: "success",
  error: "error",
};

function Button(
  props: ButtonProps,
  ref: React.ForwardedRef<HTMLButtonElement>,
) {
  const {
    color,
    className,
    intent,
    type = "button",
    size,
    disableAnimation,
    ...others
  } = props;

  return (
    <button
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...others}
      className={twMerge(
        button({
          color,
          intent,
          size: intent === "icon" ? null : (size ?? "sm"),
          disableAnimation,
        }),
        className,
      )}
      // eslint-disable-next-line react/button-has-type
      type={type}
      ref={ref}
    />
  );
}

export default forwardRef(Button);
