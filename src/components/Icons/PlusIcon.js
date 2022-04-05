// https://tablericons.com/
const PlusIcon = ({ className }) => (
  <svg
    className={className ?? 'stroke-current'}
    fill="none"
    strokeLinecap="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" stroke="none" />
    <path d="M12 5v14M5 12h14" />
  </svg>
);
 
export default PlusIcon;