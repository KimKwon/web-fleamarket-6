import styled from 'styled-components';
import { ChevronLeftIcon } from '../../assets/icons/icons';
import { LinkButton } from '../../lib/Router';
import colors from '../../styles/colors';
import { textMedium } from '../../styles/fonts';
interface PageHeaderProps {
  pageName: string;
  extraButton?: React.ReactNode;
  prevUrl?: string;
}

function PageHeader({ pageName, extraButton, prevUrl }: PageHeaderProps) {
  return (
    <StyledHeader>
      <LinkButton className="go-back-button" moveTo={prevUrl || -1}>
        <ChevronLeftIcon />
      </LinkButton>
      <h1>{pageName}</h1>
      {extraButton}
    </StyledHeader>
  );
}

const StyledHeader = styled.header`
  position: sticky;
  top: 0;
  z-index: 1;

  width: 100%;
  height: 3.5rem;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  padding: 1rem;
  background-color: ${colors.offWhite};

  & > .go-back-button {
    display: flex;
    justify-self: flex-start;
  }

  & > h1 {
    justify-self: center;
    ${textMedium};
  }

  & > *:last-child:not(h1) {
    justify-self: flex-end;
  }
`;

export default PageHeader;
