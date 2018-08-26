import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import BitcoinLib from 'bitcoinjs-lib';
import EthereumUtil from 'ethereumjs-util'
import red from '@material-ui/core/colors/red';
import SvgIcon from '@material-ui/core/SvgIcon';

import { Buffer } from 'buffer';
import wif from 'wif';
var BigInteger = require("big-integer");

const RowsPerPage = 10
const RecordCount = BigInteger("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140", 16)
const MaxPageCount = RecordCount.divide(RowsPerPage).add(1)
const BrightRed = red['500']

String.prototype.paddingHexString = function (length) {
  return (Array(length).join("0") + this).slice(-length)
}

const getPriv = (privBuffer) => {
  return wif.encode(128, privBuffer, true)
}

const getPaddingHex = (key) => {
  return key.toString(16).paddingHexString(64)
}

const getECKeyBuffer = (hexString) => {
  return new Buffer(hexString, 'hex')
}

const getBitcoinAddressFromPriv = (priv) => {
  let keyPair = BitcoinLib.ECPair.fromWIF(priv)
  let { address } = BitcoinLib.payments.p2pkh({ pubkey: keyPair.publicKey })
  return address
}

const getEthereumAddressFromECKey = (key) => {
  return EthereumUtil.privateToAddress(getECKeyBuffer(getPaddingHex(key))).toString('hex')
}

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: '0 12px'
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const TableCellTd = withStyles(theme => ({
  body: {
    padding: '0 12px'
  },
}))(TableCell);

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, BigInteger.one);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, BigInteger(this.props.page));
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, BigInteger(this.props.page).add(1).add(1));
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(event, MaxPageCount);
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page.eq(0)}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page.eq(0)}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page.add(1).compare(MaxPageCount) >= 0}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page.add(1).compare(MaxPageCount) >= 0}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.any.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

TablePagination.propTypes = {
  count: PropTypes.any.isRequired
}

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

const tipsStyle = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'left',
    alignItems: 'flex-end',
  },
  icon: {
    margin: theme.spacing.unit * 2,
  },
  hint: {
    margin: theme.spacing.unit * 2,
    marginLeft: 0
  }
})

function EmphasisIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M2 21h19v-3H2v3zM20 8H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V9c0-.55-.45-1-1-1zM2 3v3h19V3H2z" fill={BrightRed} fillRule="nonzero"/>
    </SvgIcon>
  );
}

class Tips extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <EmphasisIcon className={classes.icon} />
        <span className={classes.hint}>Red item means balance</span>
      </div>
    )
  }
}

Tips.propTypes = {
  classes: PropTypes.object.isRequired,
};

const TipsRow = withStyles(tipsStyle)(Tips);

const styles = theme => ({
  root: {
    width: '1200px',
    margin: '1% auto 0',
  },
  table: {
    minWidth: 500,
    fontFamily: 'monospace'
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  input: {
    "WebkitAppearance": "none"
  },
});

class CustomPaginationActionsTable extends React.Component {
  state = {
    rows: [],
    page: BigInteger.zero,
    rowsPerPage: RowsPerPage,
    inputPage: ''
  };

  componentDidMount() {
    console.log(location.href)
    /* this.handlePageJump() */
    let page = BigInteger.one
    while (true) {
      this.fetchData(page)
      page = page.add(1)
    }

  }

  handleChangePage = (event, page) => {
    /* this.setState({ page }); */
    this.fetchData(page)
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handlePageInput = e => {
    let value = e.target.value
    if (!/^\d+$/.test(value)) { return false }
    this.setState({
      inputPage: value
    })
  }

  handlePageJump = () => {
    let page = this.state.inputPage || 1
    console.log(page)

    let pageInput = BigInteger(page)

    if (pageInput.compare(BigInteger.one) < 0) {
      console.log('less than One')
      this.fetchData(BigInteger.one)
    } else if (pageInput.compare(MaxPageCount) > 0) {
      console.log('more than MaxPageCount')
      this.fetchData(MaxPageCount)
    } else {
      this.fetchData(pageInput)
    }
    /* location.href = `?page=${page}` */
  };

  fetchData = (page) => {
    page = BigInteger(page)
    let startKey = page.subtract(BigInteger.one).multiply(RowsPerPage)
    
    let rows = [...Array(RowsPerPage)].map(i => {
      startKey = startKey.add(BigInteger.one)
      let hexString = getPaddingHex(startKey)
      let priv = getPriv(getECKeyBuffer(hexString))

      if (startKey.compare(RecordCount) <= 0) {
        return {
          id: startKey.toString(),
          priv: priv,
          pos: hexString,
          btcAddress: getBitcoinAddressFromPriv(priv),
          ethAddress: getEthereumAddressFromECKey(startKey)
        }
      } else {
        return {
          id: startKey.toString(),
          priv: priv,
          btcAddress: '',
          ethAddress: ''
        }
      }
    })

    this.setState({
      page: page.minus(1),
      rows: rows
    })
  }

  goToBtcAddressInfo = (addr) => {
    window.open(`https://www.blockchain.com/btc/address/${addr}`)
  }

  goToEthAddressInfo = (addr) => {
    window.open(`https://etherscan.io/address/0x${addr}`)
  }

  checkBalance = (item) => {
    let BTCaddr = ['17Vu7st1U1KwymUKU4jJheHHGRVNqrcfLD']
    let ETHaddr = []
    if (BTCaddr.includes(item.btcAddress)) {
      return {backgroundColor: BrightRed, color: '#ffffff'}
    } else if (ETHaddr.includes(item.ethAddress)) {
      return {backgroundColor: BrightRed, color: '#ffffff'}
    } else {
      return {}
    }
  }

  render() {
    const { classes } = this.props;
    const { rows, rowsPerPage, page, inputPage } = this.state;
    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const emptyRows = 0;

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <TipsRow></TipsRow>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <CustomTableCell style={{width: "20px", padding: "0 12px 0 24px"}}><span>/</span></CustomTableCell>
                <CustomTableCell style={{width: '400px'}}>Private Key (WIF)</CustomTableCell>
                <CustomTableCell >Bitcoin Address</CustomTableCell>
                <CustomTableCell >Ethereum Address</CustomTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => {
                return (
                  <TableRow key={row.id} hover={true} style={this.checkBalance(row)}>
                    <TableCellTd style={{padding: "0 0 0 24px", color: 'inherit'}} component="th">{row.btcAddress ? index + 1 : ''}</TableCellTd>
                    <TableCellTd title={row.pos} scope="row" style={{color: 'inherit'}}>{row.btcAddress ? row.priv : ''}</TableCellTd>
                    <TableCellTd style={{cursor: 'pointer', color: 'inherit'}} onClick={this.goToBtcAddressInfo.bind(this, row.btcAddress)}>{row.btcAddress}</TableCellTd>
                    <TableCellTd style={{cursor: 'pointer', color: 'inherit'}} onClick={this.goToEthAddressInfo.bind(this, row.ethAddress)}>{row.ethAddress}</TableCellTd>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 48 * emptyRows }}>
                  <TableCell colSpan={4} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <td colSpan={4} style={{textAlign: 'right'}}> 
                  <FormControl style={{width: "697px"}} className={classes.margin}>
                    <InputLabel
                      FormLabelClasses={{
                        root: classes.cssLabel,
                        focused: classes.cssFocused,
                      }}
                      htmlFor="custom-css-input"
                    >
                      Page
                    </InputLabel>
                    <Input
                      classes={{ underline: classes.cssUnderline }}
                      style={{ WebkitAppearance: "none" }}
                      id="custom-css-input"
                      onChange={this.handlePageInput}
                      value={inputPage}
                      // type="number"
                    />
                  </FormControl>
                  <Button className={classes.button} onClick={this.handlePageJump}>Jump</Button>
                </td>
              </TableRow>
              <TableRow>
                <TablePagination
                  colSpan={4}
                  count={RecordCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActionsWrapped}
                  labelDisplayedRows={({ count }) => `${"Total ".concat(count)}`}
                  rowsPerPageOptions={[10]}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

CustomPaginationActionsTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomPaginationActionsTable);