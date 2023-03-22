import { Button, Menu, MenuItem, alpha } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import styled from "styled-components";
import { FC, ReactElement, ReactNode, useState } from "react";

type MenuOption = {
  label?: string;
  value: string | number;
  element?: ReactNode | ReactElement;
};

type MenuOptions = Array<MenuOption>;

const StyledMenu = styled(Menu)`
  .MuiPaper-root {
    border-radius: 6;
    margin-top: ${({ theme }) => theme.spacing(1)};
    min-width: 180;
    color: ${({ theme }) => (theme.palette.mode === "light" ? "rgb(55, 65, 81)" : theme.palette.grey[300])};

    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
  }
  .MuiMenu-list {
    padding: 4px 0;
  }
  .MuiSvgIcon-root {
    font-size: 18;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin-right: ${({ theme }) => theme.spacing(1.5)};
  }
`;

const StyledMenuItem = styled(MenuItem)`
  .MuiMenuItem-root .MuiSvgIcon-root {
    font-size: 18;
    color: ${({ theme }) => theme.palette.text.secondary};
    margin-right: ${({ theme }) => theme.spacing(1.5)};
  }
  &:active {
    background-color: ${({ theme }) => alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)};
  }
`;

const DropDown: FC<{
  options: MenuOptions;
  selectedOption?: MenuOption;
  placeholder?: MenuOption;
  onSelect: (option: MenuOption) => void | number;
}> = ({ options, onSelect, selectedOption, placeholder = { label: "select", element: null, value: null } }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const onClickMenuButtonHandler = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button
        aria-controls={open ? "drop-down" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={(e) => {
          onClickMenuButtonHandler(e);
        }}
        endIcon={<KeyboardArrowDownIcon />}
      >
        {selectedOption ? (
          <>
            {selectedOption.element}
            {selectedOption.label}
          </>
        ) : (
          <>
            {placeholder.element}
            {placeholder.label}
          </>
        )}
      </Button>
      <StyledMenu
        elevation={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options.map((option) => (
          <StyledMenuItem
            onClick={() => {
              handleClose();
              onSelect(option);
            }}
            selected={selectedOption.value === option.value}
          >
            {option.element || null}
            {option.label || null}
          </StyledMenuItem>
        ))}
      </StyledMenu>
    </>
  );
};

export default DropDown;
