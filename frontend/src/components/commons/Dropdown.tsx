import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import type { CSSProperties } from 'styled-components';
import colors from '../../styles/colors';
import { textSmall } from '../../styles/fonts';
import mixin from '../../styles/mixin';
import { appearFromTop } from '../../styles/keyframes';

interface DropDownElementInfo {
  content: {
    text: string;
    style?: CSSProperties;
  };
  onClick: () => void;
}

interface DropDownProps {
  initialDisplay: JSX.Element;
  dropDownElements: DropDownElementInfo[];
}

function DropDown({ initialDisplay, dropDownElements }: DropDownProps) {
  const dropDownRef = useRef<HTMLButtonElement>(null);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const toggleDropDown = (force?: boolean) => {
    setIsDropDownOpen((prevIsOpen) =>
      force === undefined ? !prevIsOpen : force,
    );
  };

  useEffect(() => {
    const handleClickOutsideDropdown = ({ target }: Event) => {
      if (!(target instanceof HTMLElement) || !dropDownRef.current) return;

      if (dropDownRef.current.contains(target) || target.closest('#modal'))
        return;

      toggleDropDown(false);
    };

    document.addEventListener('click', handleClickOutsideDropdown);
    return () => {
      document.removeEventListener('click', handleClickOutsideDropdown);
    };
  }, []);

  return (
    <StyledDropDown
      ref={dropDownRef}
      onClick={(event) => {
        event.stopPropagation();
        toggleDropDown();
      }}
    >
      {initialDisplay}
      {isDropDownOpen && (
        <DropDownList>
          {dropDownElements.map(({ content: { text, style }, onClick }) => (
            <DropDownElement
              key={text}
              onClick={(e) => {
                e.stopPropagation();
                onClick();
                toggleDropDown(false);
              }}
              style={style}
            >
              {text}
            </DropDownElement>
          ))}
        </DropDownList>
      )}
    </StyledDropDown>
  );
}

const StyledDropDown = styled.button`
  position: relative;
`;

const DropDownList = styled.ul`
  position: absolute;
  bottom: 0;
  right: 0;

  width: 8rem;

  display: flex;
  flex-direction: column;

  ${mixin.shadow.normal};
  backdrop-filter: blur(4px);
  background-color: ${colors.offWhite};
  border-radius: 10px;

  animation: ${appearFromTop} ease-in-out 0.1s forwards;
`;

const DropDownElement = styled.li`
  ${textSmall};
  padding: 1rem;
  text-align: left;

  &:not(:last-child) {
    border-bottom: 1px solid ${colors.gray300};
  }
`;

export default DropDown;
