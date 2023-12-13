import React from "react";
import styled from "styled-components";

const StyledButton = styled.button`
  background-color: #2db400;
  color: #ffffff;
  padding: 10px 20px;
  font-size: 16px;
  border: none; 
  border-radius: 5px; 
  cursor: pointer; 


  &:hover {
    background-color: #2980b9;
  }
`;

const Button = ({ onClick, children }) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};


export default Button;
