import clsx from 'clsx';
import LOGO from '@/assets/svg/common/LOGO.svg?react';

const Logo = ({ className = '' }) => {
  return (
    <LOGO
      alt="Logo"
      className={clsx('w-52 h-52 object-contain rounded-[50px]', className)}
    />
  );
};

export default Logo;
