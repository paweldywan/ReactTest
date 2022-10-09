import React from 'react';
import Table from './Table';

const FetchData = () => (
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
        filters={[
            {
                type: 'select',
                props: {
                    name: 'select',
                    label: 'Select',
                    options: [
                        {
                            value: '1',
                            text: '1'
                        },
                        {
                            value: '2',
                            text: '2'
                        },
                        {
                            value: '3',
                            text: '3'
                        },
                        {
                            value: '4',
                            text: '4'
                        },
                    ]
                }
            }
        ]}
    />
);

export default FetchData;
