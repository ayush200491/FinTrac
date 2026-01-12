import React from 'react'; // eslint-disable-line no-unused-vars
import PropTypes from 'prop-types';
import styled from 'styled-components';
import ButtonIcon from './ButtonIcon';
import ButtonsGroup from './ButtonsGroup';

// Styled table components
export const TableContainer = styled.div`
  width: 100%;
  max-width: 100%;
  border-collapse: collapse;
  overflow: auto;
  overflow-x: auto;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--color-grey-200);
  box-shadow: var(--shadow-sm);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.72));
`;

export const TableElement = styled.table`
  color: var(--color-grey-700);
  width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  font-weight: bold;
  text-align: left;
  cursor: pointer;
  background-color: var(--color-silver-100);
  color: var(--color-silver-700);
`;

export const TableBody = styled.tbody``;

export const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-grey-200);

  &:nth-child(even) {
    background-color: rgba(236, 241, 240, 0.55);
  }

  &:hover {
    background-color: rgba(17, 127, 115, 0.08);
  }
`;

export const TableCell = styled.td`
  max-width: 300px;
  padding: 1.2rem 1rem;
  color: var(--color-silver-700);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

function formatHeader(header) {
  // Split the header text by capital letters
  const words = header.split(/(?=[A-Z])/);
  // Convert words to lowercase and join with dashes
  return words.map(word => word.toLowerCase()).join('-');
}

const Table = ({ headers, data, actions }) => {
  // Add 'Actions' header
  const headersWithActions = [...headers, 'Actions'];

  return (
    <TableContainer>
      <TableElement>
        <TableHead>
          <TableRow>
            {/* Render all headers including action headers */}
            {headersWithActions.map(header => (
              <TableCell key={header}>{formatHeader(header)}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {/* Render data cells */}
              {headers.map(header => (
                <TableCell key={header}>{item[header]}</TableCell>
              ))}
              {/* Render action buttons */}
              <TableCell>
              <ButtonsGroup>
                {actions.map((action, actionIndex) => (
                  <ButtonIcon
                    key={actionIndex}
                    color={action.color}
                    iconSize='2.1rem'
                    // variation='text'
                    onClick={() => action.onClick(item)}
                  >
                    {action.icon} {action.label}
                  </ButtonIcon>
                ))}
                </ButtonsGroup>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableElement>
    </TableContainer>
  );
};

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    icon: PropTypes.element.isRequired, 
    color: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
  })).isRequired,
};

export default Table;