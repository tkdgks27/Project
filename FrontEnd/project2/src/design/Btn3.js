import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  width: 300px;
  padding: 10px;
  margin-bottom: 10px;
  border: 2px solid #fff;
  border-radius: 5px;
  background-color: #1f1f2e;
  color: #fff;
  outline: none;

  &:hover {
    cursor: pointer;
    background-color: #000000;
  }
`;

const Btn3 = ({ onClick, children }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

export default Btn3;
