import { MouseEvent } from 'react';
import { useNavigate } from '../hooks';
import { NextPathType } from '../providers/PathProvider';

interface LinkProps {
  className?: string;
  children: React.ReactNode;
  to: NextPathType;
  options?: any;
}

function Link({ className, children, to, options }: LinkProps) {
  const navigate = useNavigate();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(to, options);
  };

  return (
    <a className={className} onClick={handleClick}>
      {children}
    </a>
  );
}

export default Link;
