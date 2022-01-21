import Head from 'next/head';
import React, { PureComponent, Fragment } from 'react';
import Page from '@components/common/layout/page';
import { message } from 'antd';
import { bannerService } from '@services/banner.service';
import { IBannerUpdate } from 'src/interfaces';
import Loader from '@components/common/base/loader';
import { BreadcrumbComponent } from '@components/common';
import { FormUploadBanner } from '@components/banner/form-upload-banner';
import { AggregatorCategoryUpdate } from 'src/interfaces/aggregator-categories';
import { aggregatorService } from '@services/aggregator.service';
import Form from 'antd/lib/form/Form';
import { FormAggregator } from '@components/aggregator-category/aggregator-form';
import  Router  from 'next/router';

interface IProps {
    id: string;
}
class CamAggregatorUpdate extends PureComponent<IProps> {
    state = {
        submitting: false,
        fetching: true,
        data: {} as AggregatorCategoryUpdate
    };

    static async getInitialProps({ ctx }) {
        return ctx.query;
    }

    async componentDidMount() {
        const { id } = this.props;
        try {
            const resp = await aggregatorService.findById(id);
            this.setState({ data: resp.data });
        } catch (e) {
            message.error('No data found!');
        } finally {
            this.setState({ fetching: false });
        }
    }

    async submit(data: any) {
        const { id } = this.props;
        try {
            this.setState({ submitting: true });

            const submitData = {
                ...data
            };
            console.log(submitData);
            await aggregatorService.update(id, submitData);
            message.success('Updated successfully');
            this.setState({ submitting: false });
        } catch (e) {
            // TODO - check and show error here
            message.error('Something went wrong, please try again!');
            this.setState({ submitting: false });
        }
        Router.push('/cam-aggregator');
    }

    render() {
        const { data, submitting, fetching } = this.state;
        return (
            <>
                <Head>
                    <title>Update Category</title>
                </Head>
                <BreadcrumbComponent
                    breadcrumbs={[
                        { title: 'Categories', href: '/cam-aggregator' },
                        { title: data.name ? data.name : 'Detail' },
                        { title: 'Update' }
                    ]}
                />
                <Page>
                    {fetching ? (
                        <Loader />
                    ) : (
                        <FormAggregator
                            category={data}
                            onFinish={this.submit.bind(this)}
                            submitting={submitting}
                        />
                    )}
                </Page>
            </>
        );
    }
}

export default CamAggregatorUpdate;
