// https://tablericons.com/
const SearchIcon = ({ className }) => (
  <svg
    className={className ?? 'stroke-current'}
    fill="none"
    strokeLinecap="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" stroke="none" />
    <path d="M21 21l-6-6" />
    <circle cx="10" cy="10" r="7" />
  </svg>
);
 
export default SearchIcon;