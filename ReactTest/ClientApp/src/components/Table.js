import React, { useEffect, useState, useCallback } from 'react';
import authService from './api-authorization/AuthorizeService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'
import clsx from 'clsx';
import PropTypes from 'prop-types';

const Table = ({
    defaultColumn,
    defaultOrder,
    defaultPage,
    defaultPageSize,
    columns,
    rowKey,
    action,
    label,
    description
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
    }, [pagination, sort]);

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

    const nextPage = () => {
        let { currentPage, pageSize } = pagination;

        setPagination({ currentPage: currentPage + 1, pageSize: pageSize });
    }

    const previousPage = () => {
        let { currentPage, pageSize } = pagination;

        setPagination({ currentPage: currentPage - 1, pageSize: pageSize });
    }

    const setPage = page => {
        let { pageSize } = pagination;

        setPagination({ currentPage: page, pageSize: pageSize });
    }

    const getTable = () => {
        const firstPage = pagination.currentPage === 1;

        const lastPage = pagination.currentPage === data.pages;

        const pages = [...Array(data.pages).keys()];

        pages.forEach((num, index) => {
            pages[index] = num + 1;
        });

        return (<>
            <table className='table table-striped' aria-labelledby="tabelLabel">
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
            </table>
            <nav aria-label="...">
                <ul className="pagination">
                    {
                        <li key="prev" className={clsx('page-item', firstPage && 'disabled')}>
                            {firstPage ?
                                <span className="page-link">Previous</span> :
                                <button className="page-link" tabIndex="-1" onClick={previousPage}>Previous</button>}
                        </li>
                    }
                    {
                        pages.map(p => {
                            const currentPage = p === pagination.currentPage;

                            return (<li key={p} className={clsx('page-item', currentPage && 'active')}>
                                {currentPage ?
                                    <span className="page-link">
                                        {p}
                                        <span className="sr-only">(current)</span>
                                    </span> :
                                    <button className="page-link" onClick={() => setPage(p)}>{p}</button>}
                            </li>);
                        })
                    }
                    {
                        <li key="next" className={clsx('page-item', lastPage && 'disabled')}>
                            {lastPage ?
                                <span className="page-link">Next</span> :
                                <button className="page-link" onClick={nextPage}>Next</button>}
                        </li>
                    }
                </ul>
            </nav>
        </>)
    };

    const contents = loading
        ? <p><em>Loading...</em></p>
        : getTable();

    return (
        <div>
            <h1 id="tabelLabel" >{label}</h1>
            <p>{description}</p>
            <button disabled={loading} className="btn btn-primary mb-2" onClick={populateData}>Refresh</button>
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
    rowKey: PropTypes.string.isRequired
}

export default Table;
