import { Column, Row, Section } from '@react-email/components';

import { ConfirmEmailLink, Heading, Layout, P } from './layout';

export type RegistrationEmailConfirmationProps = {
  code: string;
  lastName: string;
  name: string;
};

export const RegistrationEmailConfirmation = ({
  code,
  lastName,
  name,
}: RegistrationEmailConfirmationProps) => {
  return (
    <Layout title="Регистрация аккаунта">
      <Section>
        <Row>
          <Column>
            <Heading>Добро пожаловать!</Heading>
          </Column>
        </Row>
        <Row>
          <Column>
            <P>
              {name} {lastName}, Ваш аккаунт был успешно зарегистрирован.
            </P>
          </Column>
        </Row>
        <Row>
          <Column>
            <P>
              Для использования всех функций сервиса подтвердите почту, нажав на
              кнопку ниже:
            </P>
          </Column>
        </Row>
        <ConfirmEmailLink code={code} />
      </Section>
    </Layout>
  );
};

export default RegistrationEmailConfirmation;
