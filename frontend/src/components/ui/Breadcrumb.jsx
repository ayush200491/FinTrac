import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const BreadcrumbNav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
  }

  li {
    margin-right: 10px;
  }

  li:last-child {
    margin-right: 0;
  }

  a {
    text-decoration: none;
    color: #007bff;
  }
`;

const Breadcrumb = ({ crumbs }) => {
    return (
        <BreadcrumbNav>
            <ul>
                {crumbs.map((crumb, index) => (
                    <li key={index}>
                        <Link to={crumb.path}>{crumb.label}</Link>
                    </li>
                ))}
            </ul>
        </BreadcrumbNav>
    );
};

export default Breadcrumb;