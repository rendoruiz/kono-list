// modified
const SendIcon = ({ className }) => (
  <svg
    className={className ?? 'stroke-current'}
    fill="none"
    strokeLinecap="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" stroke="none" />
    <path d="M4.01 4H20v15.99H4.01z" stroke="none" strokeWidth=".999" />
    <path d="M12.005 7.331v9.328M16.003 11.329l-3.998-3.998M8.008 11.329l3.997-3.998" />
    <rect height="16" width="16" rx="2" x="4" y="4" />
  </svg>
);
 
export default SendIcon;