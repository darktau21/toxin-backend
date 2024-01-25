import { Heading as H, HeadingProps as HProps } from '@react-email/components';

export type HeadingProps = HProps;

export const Heading = ({
  as = 'h1',
  children,
  className,
  ...props
}: HeadingProps) => {
  return (
    <H {...props} as={as} className={`text-xl text-center ${className}`}>
      {children}
    </H>
  );
};
