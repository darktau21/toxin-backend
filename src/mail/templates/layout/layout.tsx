import {
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Row,
  Tailwind,
} from '@react-email/components';
import { PropsWithChildren } from 'react';

import { AppConfigStatic } from '~/config/app-config.static';

type Props = { title: string };

export const Layout = ({ children, title }: PropsWithChildren<Props>) => {
  const { baseUrl } = AppConfigStatic.getMail();
  // const baseUrl = 'test';

  return (
    <Tailwind>
      <Html lang="ru">
        <Head>
          <title>{title}</title>
          <meta charSet="UTF-8" />
          <meta
            content="width=device-width, initial-scale=1.0"
            name="viewport"
          />
          <Font
            fallbackFontFamily="Verdana"
            fontFamily="Roboto"
            fontStyle="normal"
            fontWeight={400}
            webFont={{
              format: 'woff2',
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            }}
          />
        </Head>
        <body>
          <Container
            className="rounded-xl border-solid border-gray-200 border-2 p-2 bg-white text-sm"
            style={{
              boxShadow: '5px 5px 10px black',
              fontFamily: 'Roboto, Verdana, sans-serif',
            }}
          >
            <Row>
              <Column>
                <Img
                  alt="Toxin Logo"
                  height={40}
                  src={`${baseUrl}/logo.png`}
                  width={106}
                />
              </Column>
            </Row>
            {children}
          </Container>
        </body>
      </Html>
    </Tailwind>
  );
};
