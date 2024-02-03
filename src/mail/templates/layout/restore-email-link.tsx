import { Column, Link, Row } from '@react-email/components';

import { AppConfigStatic } from '~/config/app-config.static';

import { Button } from './button';
import { P } from './p';

export type RestoreEmailLinkProps = { code: string };

export const ResetEmailLink = ({ code }: RestoreEmailLinkProps) => {
  const { baseUrl, confirmEmailUrl } = AppConfigStatic.getMail();
  const confirmationLink = `${baseUrl}/${confirmEmailUrl}/${code}`;

  return (
    <>
      <Row key="1">
        <Column className="text-center">
          <Button href={confirmationLink}>Восстановить</Button>
        </Column>
      </Row>
      <Row key="2">
        <Column>
          <P>
            Или перейдите по ссылке:{' '}
            <Link href={confirmationLink}>{confirmationLink}</Link>
          </P>
        </Column>
      </Row>
    </>
  );
};
