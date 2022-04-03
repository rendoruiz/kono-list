import * as React from 'react';

const ResponsiveTextArea = ({ 
  value,
  onEnter,
  ...props 
}) => {
  const ref = React.useRef(null);
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    setText(value ?? "");
  }, [value])
  
  const handleChange = (e) => {
    setText(e.target.value);
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
      value={text}
      onChange={handleChange}
      onKeyDown={onEnter && handleEnterKeyPress}
    />
  );
}
 
export default ResponsiveTextArea;