import { useRef } from "react";

const OpenDialog = ({ children, onFileSelected, ...props }) => {
  const inputRef = useRef();

  const onClickHandler = (e) => {
    inputRef.current.click();
  };

  const onChangeHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    var file = e.target.files[0];
    onFileSelected(file);
  };

  return (
    <div onClick={onClickHandler} {...props}>
      {children}
      <input type="file" id="file" onChange={onChangeHandler} ref={inputRef} style={{ display: "none" }} />
    </div>
  );
};

export default OpenDialog;
