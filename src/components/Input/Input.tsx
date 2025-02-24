import { twJoin, twMerge } from "tailwind-merge";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  containerClassName?: string;
}
function Input(props: InputProps) {
  const { label, id, error, containerClassName, className, ...otherProps } =
    props;

  return (
    <label
      htmlFor={id}
      className={twMerge("inline-flex min-w-48 flex-col", containerClassName)}
    >
      {Boolean(label) && <span className="mb-2">{label}</span>}
      <input
        className={twJoin(
          "mb-2 rounded-md border border-color-border p-2 hover:border-color-primary focus:outline-none focus-visible:border-color-primary disabled:cursor-not-allowed disabled:hover:border-color-border",
          error && "!border-color-error",
          className,
        )}
        id={id}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...otherProps}
      />
      <span className="min-h-4 text-color-error">{props.error ?? ""}</span>
    </label>
  );
}

export default Input;
