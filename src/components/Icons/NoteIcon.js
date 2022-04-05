const NoteIcon = ({ className }) => (
  <svg
    className={className ?? 'stroke-current'}
    fill="none"
    strokeLinecap="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" stroke="none" />
    <path d="M13 20l7-7M13 20v-6a1 1 0 011-1h6V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h7" />
  </svg>
);
 
export default NoteIcon;