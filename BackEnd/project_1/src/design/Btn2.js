import React from "react";
import styled from "styled-components";

const ButtonStyle = styled.button`
    width: 120px;
    height: 60px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 20px;
    font-weight: 900;
    border: 2px solid purple;
    border-radius: 20%;
    padding: 10px;
    cursor: pointer;
`;

const Btn2 = ({ onClick, children }) => {
  return <ButtonStyle onClick={onClick}>{children}</ButtonStyle>;
};

export default Btn2;