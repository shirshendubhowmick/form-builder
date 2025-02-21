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
          "mb-2 rounded-md border border-border p-2 hover:border-primary focus:outline-none focus-visible:border-primary",
          error && "!border-error",
        )}
        id={id}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...otherProps}
      />
      {Boolean(props.error) && (
        <span className="text-error">{props.error}</span>
      )}
    </label>
  );
}

export default Input;
