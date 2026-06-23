import "./Input.scss";

const Input = ({ label, error, id, ...props }) => (
  <label className="input-field" htmlFor={id}>
    <span>{label}</span>
    <input id={id} {...props} />
    {error && <small>{error}</small>}
  </label>
);

export default Input;
