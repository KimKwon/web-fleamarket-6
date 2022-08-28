import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import colors from '../styles/colors';
import { textXSmall } from '../styles/fonts';
import debounce from '../utils/debounce';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  readOnly?: boolean;
  validation?: RegExp;
  error?: string;
}

function CustomInput(props: InputProps) {
  const [isInValid, setIsInValid] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const debouncedValidation = useRef(
    debounce((validation?: RegExp, value?: InputProps['value']) => {
      if (validation && value) {
        setIsInValid(!validation.test(String(value)));
      }
      setIsDirty(true);
    }, 300),
  );

  useEffect(() => {
    debouncedValidation.current(props.validation, props.value);
  }, [props.value, props.validation]);

  return (
    <StyledInputWrapper>
      <StyledInput {...props} />
      {isInValid && isDirty && (
        <StyledErrorMessage className="error-message">
          {props.error}
        </StyledErrorMessage>
      )}
    </StyledInputWrapper>
  );
}

export default CustomInput;

const StyledInputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.625rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${colors.gray300};
  border-radius: 8px;
`;

const StyledErrorMessage = styled.span`
  position: absolute;
  left: 0.5rem;
  bottom: 0;
  color: red;
  ${textXSmall};
  align-self: flex-start;
`;
