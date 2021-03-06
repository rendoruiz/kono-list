// modified
const SendIcon = ({ className = "", arrowClassName = "", bgClassName = "", rectClassName = "" }) => (
  <svg
    className={className}
    fill="none"
    strokeLinecap="round"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4.01 4H20v15.99H4.01z" stroke="none" strokeWidth=".999" className={bgClassName} />
    <path d="M12.005 7.331v9.328M16.003 11.329l-3.998-3.998M8.008 11.329l3.997-3.998" className={arrowClassName} />
    <rect height="16" width="16" rx="2" x="4" y="4" className={rectClassName} />
  </svg>
);
 
export default SendIcon;