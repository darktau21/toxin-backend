import { Text, TextProps } from '@react-email/components';

export type PProps = TextProps;

export const P = ({ children, className, ...props }: PProps) => {
  return (
    <Text {...props} className={`text-center ${className}`}>
      {children}
    </Text>
  );
};
