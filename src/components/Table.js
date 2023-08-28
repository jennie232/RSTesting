import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import deleteIcon from '../images/delete.png';
//import FormControlLabel from '@mui/material/FormControlLabel';
//import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';

// const rows = [];

// export function createData(indicator_id, product_code, donor_id, indicator_checked_ok, qty) {
//     const rowNum = rows.length+1;
//     rows.push({ rowNum, indicator_id, product_code, donor_id, indicator_checked_ok, qty, });
// }

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) { return -1; }
    if (b[orderBy] > a[orderBy]) { return 1; }
    return 0;
}
  
function getComparator(order, orderBy) {
    return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'rowNum', numeric: false, disablePadding: true, label: '#'},
    { id: 'indicator_id', numeric: false, disablePadding: false, label: 'Indicator Batch ID'},
    { id: 'product_code', numeric: true, disablePadding: true, label: 'Product Code'},
    { id: 'donor_id', numeric: true, disablePadding: false, label: 'Donor ID'},
    { id: 'notes', numeric: false, disabledPadding: false, label: 'Notes'},
    { id: 'blood_exp', numeric: false, disabledPadding: false, label: 'Blood Exp.'},
    { id: 'indicator_exp', numeric: false, disabledPadding: false, label: 'Ind. Exp.'},
    { id: 'indicator_cat', numeric: false, disabledPadding: false, label: 'Ind. Cat. No.'},
    { id: 'indicator_checked_ok', numeric: true, disablePadding: false, label: 'Ind. OK'},
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, showIndicatorField } = props;
    const createSortHandler = (property) => (event) => { onRequestSort(event, property);};
    var headCells_temp = headCells;
    if(showIndicatorField === "0") headCells_temp = headCells.filter(hc => ['indicator_exp', 'indicator_cat'].indexOf(hc.id) === -1)
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                <Checkbox
                    color="primary"
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={rowCount > 0 && numSelected === rowCount}
                    onChange={onSelectAllClick}
                    inputProps={{ 'aria-label': 'select all desserts', }}/>
                </TableCell>
                    {headCells_temp.map((headCell) => ( 
                        <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false} >
                            <TableSortLabel
                                active={orderBy === headCell.id}
                                direction={orderBy === headCell.id ? order : 'asc'}
                                onClick={createSortHandler(headCell.id)} >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                            <Box component="span" sx={visuallyHidden}>
                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                            </Box>
                            ) : null}
                            </TableSortLabel>
                        </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
    const { numSelected, triggerDeleteRow } = props;
  
    return (
        <Toolbar sx={{pl: { sm: 2 }, pr: { xs: 1, sm: 1 }, ...(numSelected > 0 && { bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity), }),}}>
            {numSelected > 0 ? (
            <Typography sx={{ flex: '1 1 100%' }} component="div">{numSelected} selected </Typography>
            ) : (
            <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle" component="div">Table</Typography>
            )}
    
            {numSelected > 0 ? (
            <Tooltip title="Delete">
                <IconButton onClick={() => triggerDeleteRow()}><img src={deleteIcon} alt='removeButton'/></IconButton>
            </Tooltip>
            ) : ""}
        </Toolbar>
    );
}
  
EnhancedTableToolbar.propTypes = { numSelected: PropTypes.number.isRequired,};
  
// createData('Gingerbread', 356, 16.0, 49, 3.9)
// createData('Honeycomb', 408, 3.2, 87, 6.5)
// createData('Ice cream sandwich', 237, 9.0, 37, 4.3)
// createData('Jelly Bean', 375, 0.0, 94, 0.0)
// createData('KitKat', 518, 26.0, 65, 7.0)
// createData('Cupcake', 305, 3.7, 67, 4.3)
// createData('Donut', 452, 25.0, 51, 4.9)
// createData('Eclair', 262, 16.0, 24, 6.0)
// createData('Frozen yoghurt', 159, 6.0, 24, 4.0)
// createData('Lollipop', 392, 0.2, 98, 0.0)
// createData('Marshmallow', 318, 0, 81, 2.0)
// createData('Nougat', 360, 19.0, 9, 37.0)
// createData('Oreo', 437, 18.0, 63, 4.0)

export default function EnhancedTable({ rows, deleteRow, selected, setSelected, showIndicatorField }) {
    // assign row number
    rows = rows.map((r,index) => { r["rowNum"] = index; return r; });

    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('rowNum');
    //const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
  
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };
  
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.rowNum);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
  
    const handleClick = (event, rowNum) => {
        const selectedIndex = selected.indexOf(rowNum);
        let newSelected = [];
    
        if (selectedIndex === -1)
            newSelected = newSelected.concat(selected, rowNum);
        else if (selectedIndex === 0)
            newSelected = newSelected.concat(selected.slice(1));
        else if (selectedIndex === selected.length - 1)
            newSelected = newSelected.concat(selected.slice(0, -1));
        else if (selectedIndex > 0)
            newSelected = newSelected.concat( selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1),);
        setSelected(newSelected);
    };
  
    const triggerDeleteRow = () => { deleteRow(selected); }

    const handleChangePage = (event, newPage) => { setPage(newPage); };
  
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
  
    const isSelected = (rowNum) => selected.indexOf(rowNum) !== -1;
  
    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  
    return (
      <Box sx={{ width: '100%' }} className="px-1">
        <Paper sx={{ width: '100%' }}>
            <EnhancedTableToolbar numSelected={selected.length} triggerDeleteRow={triggerDeleteRow}/>
            <TableContainer>
                <Table sx={{ minWidth: 750 }} size={'small'}>
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                        showIndicatorField={showIndicatorField}/>
                    <TableBody>
                        {stableSort(rows, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row, index) => {
                            const isItemSelected = isSelected(row.rowNum);
                            const labelId = `enhanced-table-checkbox-${index}`;
    
                        return (
                            <TableRow
                                hover
                                onClick={(event) => handleClick(event, row.rowNum)}
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.rowNum}
                                selected={isItemSelected}
                                sx={{ cursor: 'pointer' }}>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        checked={isItemSelected}
                                        inputProps={{ 'aria-labelledby': labelId, }}/>
                                </TableCell>
                                <TableCell component="th" id={labelId} scope="row" padding="none"> {row.rowNum + 1} </TableCell>
                                <TableCell>{row.indicator_id}</TableCell>
                                <TableCell align="center">{row.product_code}</TableCell>
                                <TableCell align="right">{row.donor_id}</TableCell>
                                <TableCell align="left">{row.notes}</TableCell>
                                <TableCell align="left">{row.blood_exp}</TableCell>
                                {showIndicatorField === "1" ? 
                                    <><TableCell align="left">{row.ind_exp}</TableCell>
                                    <TableCell align="left">{row.indicator_cat}</TableCell></>
                                :""}
                                <TableCell align="right">{row.ind_ok}</TableCell>
                            </TableRow>
                        );
                    })}
                    {emptyRows > 0 && (
                    <TableRow style={{ height: 33 * emptyRows, }}>
                        <TableCell colSpan={6} />
                    </TableRow>
                    )}
                    </TableBody>
                </Table>
            </TableContainer>
          <TablePagination
            rowsPerPageOptions={[15, 30, 60]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    );
  }