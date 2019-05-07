import React from "react";
import PropTypes from "prop-types";
import ImmutablePropTypes from "react-immutable-proptypes";
import { Link } from "react-router-dom";
import { List, Map } from "immutable";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";
import { Badge } from "@material-ui/core";

import { FilterTrigger } from "./Filter/FilterTrigger";
import { TextFilter } from "./Filter/TextFilter";

const ViewIssueLink = ({ id, hasNewActivity = false }) => {
  const linkNode = (
    <Link
      to={`/issues/${id}`}
    >
      View
    </Link>
  );

  if (hasNewActivity) {
    return (
      <Badge
        variant="dot"
        color="primary"
        title="New activity"
        aria-label="New activity"
      >
        {linkNode}
      </Badge>
    );
  } else {
    return linkNode;
  }
};

ViewIssueLink.propTypes = {
  id: PropTypes.number.isRequired,
  hasNewActivity: PropTypes.bool.isRequired,
};

ViewIssueLink.defaultProps = {
  hasNewActivity: false,
};

const cellStyles = {
  root: ({ columnCount }) => ({
    border: "1px solid black",
    padding: "0.5em",
    borderTopWidth: 0,
    borderRightWidth: 0,

    // Add right border
    [`&:nth-child(${columnCount}n)`]: {
      borderRightWidth: "1px",
    },

    // Add bottom border
    [`&:nth-child(-n + ${columnCount})`]: {
      borderTopWidth: "1px",
    },
  }),
};

let Cell = ({ classes, children, onClick }) => {
  return (
    <div
      className={classes.root}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

Cell.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.node
    ),
  ]).isRequired,
  columnCount: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

Cell = withStyles(cellStyles)(Cell);


const styles = {
  root: {
    display: "grid",
    overflow: "auto",
  },

  tableHeaderCell: {
    fontWeight: "bold",
    textTransform: "uppercase",
    position: "sticky",
    top: 0,
    background: "white",
    marginBottom: "-1px",
    borderBottomWidth: "3px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  flipped: {
    transform: "rotateX(180deg)",
  },
};


/**
 * Issues grid component
 */
class IssuesGrid extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    issues: ImmutablePropTypes.map,
    newActivity: ImmutablePropTypes.map,
  }

  state = {
    sortField: null,
    sortOrder: null,
  }

  /**
   * Handles the sort event
   *
   * @param {object} args
   * @param {string|null} [args.sortField] the name of the field being sorted
   * @param {-1|1} [args.defaultSortOrder=1] the order of the sort (-1 for
   * descending, 1 for ascending) if the grid is not currently sorted by
   * `sortField`
   */
  handleSort = ({ sortField, defaultSortOrder = 1 }) => {
    this.setState(
      (prevState) => {
        let sortOrder = defaultSortOrder;

        if (prevState.sortField === sortField) {
          if (prevState.sortOrder === defaultSortOrder) {
            sortOrder = -1 * prevState.sortOrder;
          } else {
            sortOrder = null;
          }
        }

        if (sortOrder === null) {
          sortField = null;
        }

        return {
          sortField,
          sortOrder,
        };
      }
    );
  }

  /**
   * Adds a sort indicator to header content if applicable
   *
   * @param {*} content the header content
   * @param {string} field the name of the sorted field
   *
   * @return {JSX.Element}
   */
  addSortIndicator = (content, field) => {
    const fieldIsSorted = this.state.sortField === field;

    return (
      <React.Fragment>
        {content}
        <Icon
          title={
            fieldIsSorted ?
              `Sorted in ${
                this.state.sortOrder > 0 ?
                  "descending" :
                  "ascending"
              } order` :
              undefined
          }
        >
          {
            fieldIsSorted && (
              this.state.sortOrder > 0 ?
                "\u21A5" :
                "\u21A7"
            )
          }
        </Icon>
      </React.Fragment>
    );
  }

  /**
   * Renders the component
   *
   * @return {JSX.Element}
   */
  render() {
    const columnDefs = [
      {
        key: "view",
        header: "View",
        width: "auto",
        content: ({ issue }) => (
          <ViewIssueLink
            id={issue.get("id")}
            hasNewActivity={
              this.props.newActivity.get("issues", List())
                .includes(issue.get("id")) ||
              this.props.newActivity.get("issueComments", Map())
                .has(issue.get("id"))
            }
          />
        ),
      },
      {
        key: "description",
        header: this.addSortIndicator("Description", "description"),
        sortable: true,
        filterType: "text",
      },
    ];

    let {
      issues,
    } = this.props;

    const {
      sortField,
      sortOrder,
      filterColumn,
      filterValue,
    } = this.state;

    if (sortField) {
      issues = issues.sort(
        (a, b) => a.get(sortField).toLowerCase().localeCompare(
          b.get(sortField).toLowerCase()
        ) * sortOrder
      );
    }

    if (filterColumn && filterValue) {
      issues = issues.filter(
        (issue) => issue.get(filterColumn).toLowerCase().includes(filterValue)
      );
    }

    const gridTemplateColumns = [];

    for (const { width } of columnDefs) {
      if (width !== undefined) {
        gridTemplateColumns.push(width);
      } else {
        gridTemplateColumns.push("1fr");
      }
    }

    return (
      <div
        className={classnames(
          this.props.classes.root,
          this.props.className
        )}
        style={{
          gridTemplateRows: `repeat(${this.props.issues.size + 1}, auto)`,
          gridTemplateColumns: `${gridTemplateColumns.join(" ")}`,
        }}
      >
        {
          columnDefs.map(
            ({ key, header, sortable, defaultSortOrder, filterType }) => (
              <Cell
                key={key}
                classes={{
                  root: this.props.classes.tableHeaderCell,
                }}
                columnCount={columnDefs.length}
                onClick={
                  sortable ?
                    () => this.handleSort({
                      sortField: key,
                      defaultSortOrder,
                    }) :
                    undefined
                }
              >
                {header}
                {
                  filterType && (
                    filterType === "text" ?
                      (
                        <FilterTrigger>
                          <TextFilter
                            onChange={(value) => this.setState({
                              filterColumn: key,
                              filterValue: value,
                            })}
                            value={
                              filterColumn === key ?
                                filterValue :
                                ""
                            }
                          />
                        </FilterTrigger>
                      ) :
                      undefined
                  )
                }
              </Cell>
            )
          )
        }
        {
          issues.reduce(
            (cells, issue) => {
              cells.push(
                ...columnDefs.map(
                  ({ key, content: Content }) => (
                    <Cell
                      key={`${issue.get("id")}-${key}`}
                      columnCount={columnDefs.length}
                    >
                      {
                        Content ? (
                          <Content
                            issue={issue}
                          />
                        ) :
                          issue.get(key)
                      }
                    </Cell>
                  )
                )
              );

              return cells;
            },
            []
          )
        }
      </div>
    );
  }
}

const StyledIssuesGrid = withStyles(styles)(IssuesGrid);

export { StyledIssuesGrid as IssuesGrid };

