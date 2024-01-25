import { Column, Heading, Row, Section } from '@react-email/components';

import { ConfirmEmailLink, Layout, P } from './layout';

type ChangeEmailConfirmationProps = {
  code: string;
  lastName: string;
  name: string;
  newEmail: string;
  oldEmail: string;
};

export const ChangeEmailConfirmation = ({
  code,
  lastName,
  name,
  newEmail,
  oldEmail,
}: ChangeEmailConfirmationProps) => {
  return (
    <Layout title="Смена почтового адреса">
      <Section>
        <Row>
          <Column>
            <Heading>Ваш email изменен</Heading>
          </Column>
        </Row>
        <Row>
          <Column>
            <P>
              {name} {lastName}, email адрес Вашего аккаунта Toxin был изменен с{' '}
              {oldEmail} на {newEmail}.
            </P>
          </Column>
        </Row>
        <Row>
          <Column>
            <P>Чтобы подтвердить изменение нажмите на кнопку ниже:</P>
          </Column>
        </Row>
        <ConfirmEmailLink code={code} />
      </Section>
    </Layout>
  );
};
