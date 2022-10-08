import React, { Component } from 'react';
import { Table } from './Table';

export class FetchData extends Component {
    static displayName = FetchData.name;

    render() {
        return (
            <Table
                defaultColumn='date'
                defaultOrder='desc'
                defaultPage={1}
                defaultPageSize={10}
                action='weatherforecast'
                label='Weather forecast'
                description='This component demonstrates fetching data from the server.'
                columns={[
                    {
                        name: 'Date',
                        key: 'date'
                    },
                    {
                        name: 'Temp. (C)',
                        key: 'temperatureC'
                    },
                    {
                        name: 'Temp. (F)',
                        key: 'temperatureF'
                    },
                    {
                        name: 'Summary',
                        key: 'summary'
                    }
                ]}
                rowKey='date'
            />
        );
    }
}
