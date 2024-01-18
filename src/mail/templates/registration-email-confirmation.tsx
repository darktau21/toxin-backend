import {
  Column,
  Heading,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';

import { AppConfigStatic } from '~/config/app-config.static';

import { Button, Layout } from './layout';

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
  const { baseUrl, confirmEmailUrl } = AppConfigStatic.getMail();
  const confirmationLink = `${baseUrl}/${confirmEmailUrl}/${code}`;
  // const confirmationLink = 'test';
  return (
    <Layout title="Регистрация аккаунта">
      <Section>
        <Row>
          <Column className="text-center">
            <Heading as="h1" className="text-xl">
              Добро пожаловать!
            </Heading>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className="text-center">
              {name} {lastName}, Ваш аккаунт был успешно зарегистрирован.
            </Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className="text-center">
              Для использования всех функций сервиса подтвердите почту, нажав на
              кнопку ниже:
            </Text>
          </Column>
        </Row>
        <Row>
          <Column className="text-center">
            <Button
              className="text-xl font-semibold bg-purple-600 text-white px-6 py-3 rounded-md"
              href={confirmationLink}
            >
              Подтвердить
            </Button>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text className="text-center">
              Или перейдите по ссылке:{' '}
              <Link href={confirmationLink}>{confirmationLink}</Link>
            </Text>
          </Column>
        </Row>
      </Section>
    </Layout>
  );
};

export default RegistrationEmailConfirmation;
