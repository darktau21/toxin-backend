import { Column, Link, Row } from '@react-email/components';

import { AppConfigStatic } from '~/config/app-config.static';

import { Button } from './button';
import { P } from './p';

export type ConfirmEmailLinkProps = { code: string };

export const ConfirmEmailLink = ({ code }: ConfirmEmailLinkProps) => {
  const { baseUrl, confirmEmailUrl } = AppConfigStatic.getMail();
  const confirmationLink = `${baseUrl}/${confirmEmailUrl}/${code}`;

  return (
    <>
      <Row>
        <Column className="text-center">
          <Button href={confirmationLink}>Подтвердить</Button>
        </Column>
      </Row>
      <Row>
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
