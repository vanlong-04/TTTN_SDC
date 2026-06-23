import "./Card.scss";

const Card = ({ className = "", ...props }) => (
  <section className={`card ${className}`.trim()} {...props} />
);

export default Card;
