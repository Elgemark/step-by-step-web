import { useRef } from "react";

const OpenDialog = ({ children, accept = "image/png, image/jpeg", onFileSelected, ...props }) => {
  const inputRef = useRef<HTMLInputElement>();

  const onClickHandler = () => {
    inputRef.current.click();
  };

  const onChangeHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const file = e.target.files[0];

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = function (e) {
      onFileSelected({ file, url: e.target.result });
    };
  };

  return (
    <div onClick={onClickHandler} {...props}>
      {children}
      <input
        type="file"
        id="file"
        accept={accept}
        onChange={onChangeHandler}
        ref={inputRef}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default OpenDialog;
