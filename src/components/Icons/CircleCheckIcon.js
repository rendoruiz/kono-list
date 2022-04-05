// https://tablericons.com/
const CircleCheckIcon = ({ className, circleClassName, checkClassName }) => (
  <svg
    className={className ?? 'stroke-current'}
    fill="none"
    strokeLinecap="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" stroke="none" />
    <circle cx="12" cy="12" r="9" className={circleClassName ?? ""} />
    <path d="M9 12l2 2 4-4" className={checkClassName ?? ""} />
  </svg>
);
 
export default CircleCheckIcon;