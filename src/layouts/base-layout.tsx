import * as React from 'react';
import PrimaryLayout from './primary-layout';
import PublicLayout from './public-layout';
import { IAppConfig } from 'src/interfaces';
import Head from 'next/head';

interface DefaultProps {
  children: any;
  appConfig?: IAppConfig;
  layout?: string;
}

const LayoutMap = {
  primary: PrimaryLayout,
  public: PublicLayout
};

export default class BaseLayout extends React.PureComponent<DefaultProps> {
  render() {
    const { children, layout, appConfig } = this.props;
    const Container = layout && LayoutMap[layout] ? LayoutMap[layout] : LayoutMap.primary;
    return (
      <React.Fragment>
        <Head>
          <link href="/css/antd.min.css" rel="stylesheet" key="antd" />
        </Head>
        <Container>{children}</Container>
      </React.Fragment>
    );
  }
}
