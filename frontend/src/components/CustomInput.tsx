import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';
import { textXSmall } from '../styles/fonts';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readOnly?: boolean;
  validation?: RegExp;
  error?: string;
}

function CustomInput(props: InputProps) {
  const [isInValid, setIsInValid] = useState(false);

  useEffect(() => {
    if (props.validation && props.value) {
      setIsInValid(!props.validation.test(String(props.value)));
    }
  }, [props.value, props.validation]);

  return (
    <>
      <StyledInput {...props} />
      {isInValid && (
        <StyledErrorMessage className="error-message">
          {props.error}
        </StyledErrorMessage>
      )}
    </>
  );
}

export default CustomInput;

const StyledInput = styled.input`
  padding: 0.625rem 1rem;
  border: 1px solid ${colors.gray300};
  border-radius: 8px;
`;

const StyledErrorMessage = styled.span`
  margin-bottom: 0.25rem;
  color: red;
  ${textXSmall};
  align-self: flex-start;
`;
