import React, { useEffect, useState } from 'react';
import authService from './api-authorization/AuthorizeService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

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

    const populateData = async () => {
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
    };

    useEffect(() => {
        populateData();
    }, [sort, pagination]);

    const getPostfix = currentColumn => {
        let { column, order } = sort;

        return currentColumn === column ?
            (order === 'asc' ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />)
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
        let { _, pageSize } = pagination;

        setPagination({ currentPage: page, pageSize: pageSize });
    }

    const getTable = () =>
    (<>
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
                    pagination.currentPage === 1 ?
                        <li key="prev" className="page-item disabled">
                            <span className="page-link">Previous</span>
                        </li> :
                        <li key="prev" className="page-item">
                            <a className="page-link" role="button" tabIndex="-1" onClick={previousPage}>Previous</a>
                        </li>
                }
                <>
                    {
                        [...Array(data.pages).keys()].map(p => p + 1 !== pagination.currentPage ?
                            <li key={p} className="page-item"><a className="page-link" role="button" onClick={() => setPage(p + 1)}>{p + 1}</a></li> :
                            <li key={p} className="page-item active">
                                <span className="page-link">
                                    {p + 1}
                                    <span className="sr-only">(current)</span>
                                </span>
                            </li>)
                    }
                </>
                {
                    pagination.currentPage === data.pages ?
                        <li key="next" className="page-item disabled">
                            <span className="page-link">Next</span>
                        </li> :
                        <li key="next" className="page-item">
                            <a role="button" className="page-link" onClick={nextPage}>Next</a>
                        </li>
                }
            </ul>
        </nav>
    </>);

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

export default Table;
