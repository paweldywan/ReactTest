import React, { useEffect, useState, useCallback } from 'react';
import authService from './api-authorization/AuthorizeService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import PropTypes from 'prop-types';
import {
    Table as DefaultTable,
    Pagination,
    PaginationItem,
    PaginationLink,
    Button,
    Spinner,
    UncontrolledAccordion,
    AccordionItem,
    AccordionHeader,
    AccordionBody
} from 'reactstrap';
import Select from './Select';

const Table = ({
    defaultColumn,
    defaultOrder,
    defaultPage,
    defaultPageSize,
    columns,
    rowKey,
    action,
    label,
    description,
    filters
}) => {
    const [loading, setLoading] = useState(true);

    const [data, setData] = useState({
        data: [],
        pages: 1
    });

    const [sort, setSort] = useState({
        column: defaultColumn,
        order: defaultOrder
    });

    const [pagination, setPagination] = useState({
        currentPage: defaultPage,
        pageSize: defaultPageSize
    });

    const populateData = useCallback(async () => {
        const token = await authService.getAccessToken();

        const response = await fetch(`${action}?` + new URLSearchParams({
            currentPage: pagination.currentPage,
            pageSize: pagination.pageSize,
            sort: sort.column,
            sortDirection: sort.order
        }),
            {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            });

        const data = await response.json();

        setData(data);

        setLoading(false);
    }, [pagination, sort, action]);

    useEffect(() => {
        populateData();
    }, [populateData]);

    const getPostfix = currentColumn => {
        let { column, order } = sort;

        return currentColumn === column ?
            <FontAwesomeIcon icon={order === 'asc' ? faChevronUp : faChevronDown} />
            : null;
    }

    const executeSort = currentColumn => {
        let { column, order } = sort;

        order = (order === 'asc' && column === currentColumn) ? 'desc' : 'asc';

        setSort({ column: currentColumn, order: order });
    }

    const setPage = page => {
        let { pageSize } = pagination;

        setPagination({ currentPage: page, pageSize: pageSize });
    }

    const setNextPage = () => {
        let { currentPage } = pagination;

        setPage(currentPage + 1);
    }

    const setPreviousPage = () => {
        let { currentPage } = pagination;

        setPage(currentPage - 1);
    }

    const setFirstPage = () => setPage(1);

    const setLastPage = () => setPage(data.pages);

    const getFilters = () =>
    (<UncontrolledAccordion defaultOpen="1" className="mb-2" >
        <AccordionItem>
            <AccordionHeader targetId="1">
                Filters
            </AccordionHeader>
            <AccordionBody accordionId="1">
                {filters.map(filter => {
                    const { type, props } = filter;

                    switch (type) {
                        case 'select':
                            return <Select {...props} />

                        default:
                            return null;
                    }
                })}
            </AccordionBody>
        </AccordionItem>
    </UncontrolledAccordion>);

    const getTable = () => {
        const isFirstPage = pagination.currentPage === 1;

        const isLastPage = pagination.currentPage === data.pages;

        const pages = [...Array(data.pages).keys()];

        pages.forEach((num, index) => {
            pages[index] = num + 1;
        });

        return (<>
            <DefaultTable striped bordered hover responsive>
                <thead>
                    <tr>
                        {columns.map(column =>
                            <th key={column.key} role="button" onClick={() => executeSort(column.key)}>{column.name} {getPostfix(column.key)}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.data.map(data =>
                        <tr key={data[rowKey]}>
                            {columns.map(column =>
                                <td key={column.key}>{data[column.key]}</td>
                            )}
                        </tr>
                    )}
                </tbody>
            </DefaultTable>

            <Pagination>
                <PaginationItem disabled={isFirstPage}>
                    <PaginationLink
                        first
                        tag="button"
                        onClick={setFirstPage}
                    />
                </PaginationItem>
                <PaginationItem disabled={isFirstPage}>
                    <PaginationLink
                        previous
                        tag="button"
                        onClick={setPreviousPage}
                    />
                </PaginationItem>
                {
                    pages.map(p => {
                        const currentPage = p === pagination.currentPage;

                        return (<PaginationItem active={currentPage}>
                            <PaginationLink
                                tag="button"
                                onClick={() => setPage(p)}
                            >
                                {p}
                            </PaginationLink>
                        </PaginationItem>);
                    })
                }
                <PaginationItem disabled={isLastPage}>
                    <PaginationLink
                        next
                        tag="button"
                        onClick={setNextPage}
                    />
                </PaginationItem>
                <PaginationItem disabled={isLastPage}>
                    <PaginationLink
                        last
                        tag="button"
                        onClick={setLastPage}
                    />
                </PaginationItem>
            </Pagination>
        </>)
    };

    const contents = loading
        ? <Spinner /> : getTable();

    const contentsFilters = getFilters();

    return (
        <div>
            <h1 id="tabelLabel">{label}</h1>
            <p>{description}</p>
            {contentsFilters}
            <Button disabled={loading} color='primary' className="mb-2" onClick={populateData}>Refresh</Button>
            {contents}
        </div>
    );
};

Table.propTypes = {
    defaultColumn: PropTypes.string.isRequired,
    defaultOrder: PropTypes.string.isRequired,
    defaultPage: PropTypes.number.isRequired,
    defaultPageSize: PropTypes.number.isRequired,
    action: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            key: PropTypes.string.isRequired
        })
    ),
    rowKey: PropTypes.string.isRequired,
    filters: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.oneOf(['select']).isRequired,
        props: PropTypes.object.isRequired
    })).isRequired
}

export default Table;
