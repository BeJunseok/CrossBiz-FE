import clsx from 'clsx';

const Logo = ({ className = '' }) => {
  return (
    <div
      className={clsx(
        'w-52 h-52 bg-gray-200 rounded-[50px] flex items-center justify-center',
        className
      )}
    >
      <img
        src="/assets/logo.svg"
        alt="Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;
