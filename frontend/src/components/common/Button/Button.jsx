import "./Button.scss";

const Button = ({ variant = "primary", className = "", ...props }) => (
  <button
    className={`button button--${variant} ${className}`.trim()}
    {...props}
  />
);

export default Button;
