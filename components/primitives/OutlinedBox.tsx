import styled from "styled-components";

const Root = styled.div`
  border-radius: 4px;
  box-sizing: border-box;
  border-color: rgba(255, 255, 255, 0.2);
  border-style: solid;
  border-width: 1px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const OutlinedBox = (props) => {
  return <Root {...props}></Root>;
};

export default OutlinedBox;
