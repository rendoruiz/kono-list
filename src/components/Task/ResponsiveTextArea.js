import * as React from 'react';

const ResponsiveTextArea = ({ 
  value,
  onChange,
  onEnter,
  ...props 
}) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    adjustHeight();
  }, [value]);
  
  const handleChange = (e) => {
    onChange(e.target.value);
    adjustHeight();
  }
  const handleEnterKeyPress = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      onEnter();
    }
  }

  const adjustHeight = () => {
    ref.current.style.height = 'auto';
    ref.current.style.height = (ref.current.scrollHeight + 2) + 'px';
  }

  return (  
    <textarea
      {...props}
      rows={1}
      autoComplete='off'
      ref={ref}
      value={value}
      onChange={handleChange}
      onKeyDown={onEnter && handleEnterKeyPress}
    />
  );
}
 
export default ResponsiveTextArea;