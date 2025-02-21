import { twJoin, twMerge } from "tailwind-merge";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  className?: string;
}
function Input(props: InputProps) {
  const { label, id, error, ...otherProps } = props;

  return (
    <label
      htmlFor={id}
      className={twMerge("inline-flex flex-col", props.className)}
    >
      {Boolean(label) && <span className="mb-2">{label}</span>}
      <input
        className={twJoin(
          "border-color-border hover:border-color-primary focus-visible:border-color-primary mb-2 rounded-md border p-2 focus:outline-none",
          error && "!border-color-error",
        )}
        id={id}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...otherProps}
      />
      {Boolean(props.error) && (
        <span className="text-color-error">{props.error}</span>
      )}
    </label>
  );
}

export default Input;
