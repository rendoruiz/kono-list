import * as React from 'react';

const ResponsiveTextArea = ({ 
  value,
  onChange,
  onEnter,
  ...props 
}) => {
  const ref = React.useRef(null);

  React.useEffect(() => {
    ref.current.style.height = 'auto';
    ref.current.style.height = ref.current.scrollHeight + 'px';
  }, [value]);
  
  const handleChange = (e) => {
    onChange(e.target.value);
    ref.current.style.height = 'auto';
    ref.current.style.height = ref.current.scrollHeight + 'px';
  }
  const handleEnterKeyPress = (e) => {
    if (e.which === 13) {
      e.preventDefault();
      onEnter();
    }
  }

  return (  
    <textarea
      {...props}
      rows={1}
      ref={ref}
      value={value}
      onChange={handleChange}
      onKeyDown={onEnter && handleEnterKeyPress}
    />
  );
}
 
export default ResponsiveTextArea;