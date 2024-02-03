import { Column, Heading, Row, Section } from '@react-email/components';

import { Layout, P, ResetEmailLink } from './layout';

export type ChangeEmailNotificationProps = {
  code: string;
  lastName: string;
  name: string;
  newEmail: string;
  oldEmail: string;
};

export const ChangeEmailNotification = ({
  code,
  lastName,
  name,
  newEmail,
  oldEmail,
}: ChangeEmailNotificationProps) => {
  return (
    <Layout title="Смена почтового адреса">
      <Section>
        <Row key="1">
          <Column>
            <Heading>Ваш email был изменен</Heading>
          </Column>
        </Row>
        <Row key="2">
          <Column>
            <P>
              {name} {lastName}, email адрес Вашего аккаунта Toxin был изменен с{' '}
              {oldEmail} на {newEmail}.
            </P>
          </Column>
        </Row>
        <Row key="3">
          <Column>
            <P>
              Если это были не Вы, восстановить почту можно нажав кнпоку ниже:
            </P>
          </Column>
        </Row>
        <ResetEmailLink code={code} />
      </Section>
    </Layout>
  );
};
