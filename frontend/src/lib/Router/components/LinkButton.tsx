import { useNavigate } from '../hooks';
import { NextPathType, PathDispatchOptions } from '../providers/PathProvider';

interface LinkButtonProps {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
  moveTo: NextPathType;
  options?: PathDispatchOptions;
}

function LinkButton({ className, children, moveTo, options }: LinkButtonProps) {
  const navigate = useNavigate();

  const handleLinkButtonClick = () => {
    navigate(moveTo, options);
  };

  return (
    <button
      style={{ display: 'flex' }}
      className={className}
      onClick={handleLinkButtonClick}
    >
      {children}
    </button>
  );
}

export default LinkButton;
