import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export class Table extends Component {
    static displayName = Table.name;

    constructor(props) {
        super(props);

        const {
            defaultColumn,
            defaultOrder,
            defaultPage,
            defaultPageSize,
        } = props;

        this.state = {
            data: {
                data: [],
                pages: 1
            },
            sort: {
                column: defaultColumn,
                order: defaultOrder
            },
            pagination: {
                currentPage: defaultPage,
                pageSize: defaultPageSize
            },
            loading: true,
        };

        this.populateData = this.populateData.bind(this);
    }

    componentDidMount() {
        this.populateData();
    }

    static getPostfix(sort, currentColumn) {
        let { column, order } = sort;

        return currentColumn === column ?
            (order === 'asc' ? <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />)
            : null;
    }

    setSort(currentColumn) {
        return () => {
            let { column, order } = this.state.sort;

            order = (order === 'asc' && column === currentColumn) ? 'desc' : 'asc';

            this.setState({ sort: { column: currentColumn, order: order } });

            this.populateData();
        }
    }

    nextPage() {
        return () => {
            let { currentPage, pageSize } = this.state.pagination;

            this.setState({ pagination: { currentPage: currentPage + 1, pageSize: pageSize } });

            this.populateData();
        }
    }

    previousPage() {
        return () => {
            let { currentPage, pageSize } = this.state.pagination;

            this.setState({ pagination: { currentPage: currentPage - 1, pageSize: pageSize } });

            this.populateData();
        }
    }

    setPage(page) {
        return () => {
            let { _, pageSize } = this.state.pagination;

            this.setState({ pagination: { currentPage: page, pageSize: pageSize } });

            this.populateData();
        }
    }

    renderTable() {
        const sort = this.state.sort;

        return (
            <>
                <table className='table table-striped' aria-labelledby="tabelLabel">
                    <thead>
                        <tr>
                            {this.props.columns.map(column =>
                                <th key={column.key} role="button" onClick={this.setSort(column.key)}>{column.name} {Table.getPostfix(sort, column.key)}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.data.data.map(data =>
                            <tr key={data[this.props.rowKey]}>
                                {this.props.columns.map(column =>
                                    <td key={column.key}>{data[column.key]}</td>
                                )}                               
                            </tr>
                        )}
                    </tbody>
                </table>
                <nav aria-label="...">
                    <ul className="pagination">
                        {
                            this.state.pagination.currentPage === 1 ?
                                <li key="prev" className="page-item disabled">
                                    <span className="page-link">Previous</span>
                                </li> :
                                <li key="prev" className="page-item">
                                    <a className="page-link" role="button" tabIndex="-1" onClick={this.previousPage()}>Previous</a>
                                </li>
                        }
                        <>
                            {
                                [...Array(this.state.data.pages).keys()].map(p => p + 1 !== this.state.pagination.currentPage ?
                                    <li key={p} className="page-item"><a className="page-link" role="button" onClick={this.setPage(p + 1)}>{p + 1}</a></li> :
                                    <li key={p} className="page-item active">
                                        <span className="page-link">
                                            {p + 1}
                                            <span className="sr-only">(current)</span>
                                        </span>
                                    </li>)
                            }
                        </>
                        {
                            this.state.pagination.currentPage === this.state.data.pages ?
                                <li key="next" className="page-item disabled">
                                    <span className="page-link">Next</span>
                                </li> :
                                <li key="next" className="page-item">
                                    <a role="button" className="page-link" onClick={this.nextPage()}>Next</a>
                                </li>
                        }
                    </ul>
                </nav>
            </>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderTable();

        return (
            <div>
                <h1 id="tabelLabel" >{this.props.label}</h1>
                <p>{this.props.description}</p>
                <button disabled={this.state.loading} className="btn btn-primary mb-2" onClick={this.populateData}>Refresh</button>
                {contents}
            </div>
        );
    }

    async populateData() {
        const token = await authService.getAccessToken();

        const response = await fetch(`${this.props.action}?` + new URLSearchParams({
            currentPage: this.state.pagination.currentPage,
            pageSize: this.state.pagination.pageSize,
            sort: this.state.sort.column,
            sortDirection: this.state.sort.order
        }),
            {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            });

        const data = await response.json();

        this.setState({ data: data, loading: false });
    }
}
