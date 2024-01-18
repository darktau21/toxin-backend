import { Button as Btn } from '@react-email/components';

export const Button = ({
  children,
  className,
  ...props
}: Parameters<typeof Btn>[0]) => {
  return (
    <Btn
      className={`text-xl font-semibold bg-purple-600 text-white hover:bg-purple-400 px-6 py-3 rounded-md ${className}`}
      {...props}
    >
      {children}
    </Btn>
  );
};
