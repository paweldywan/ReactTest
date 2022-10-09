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
                type: 'input',
                props: {
                    type: 'select',
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
                        }
                    ]
                }
            },
            {
                type: 'input',
                props: {
                    type: 'select',
                    name: 'select-multiple',
                    label: 'Select Multiple',
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
                        }
                    ],
                    multiple: true
                }
            },
            {
                type: 'input',
                props: {
                    type: 'text',
                    name: 'select-searchable',
                    label: 'Select Searchable',
                    options: [
                        {
                            value: '1',
                            text: 'Option11'
                        },
                        {
                            value: '2',
                            text: 'Option12'
                        },
                        {
                            value: '3',
                            text: 'Option21'
                        },
                        {
                            value: '4',
                            text: 'Option22'
                        }
                    ],
                    searchable: true
                }
            },
            {
                type: 'input',
                props: {
                    type: 'text',
                    name: 'text',
                    label: 'Text'
                }
            },
            {
                type: 'input',
                props: {
                    type: 'month',
                    name: 'month',
                    label: 'Month'
                }
            },
            {
                type: 'input',
                props: {
                    type: 'date',
                    name: 'date',
                    label: 'Date'
                }
            }
        ]}
    />
);

export default FetchData;
