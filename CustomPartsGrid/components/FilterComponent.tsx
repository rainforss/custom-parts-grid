import { CommandBarButton, DefaultButton, Spinner } from "@fluentui/react";
import * as React from "react";

interface IFilterComponentProps {
  filters: { [key: string]: string };
  filterCriterias?: {
    [key: string]: {
      [key: string]: Array<string>;
    };
  };
  addFilter: (filterName: string, filterValue: string) => void;
  removeFilter: (filterName: string) => void;
}

const FilterComponent: React.FunctionComponent<IFilterComponentProps> = ({
  filters,
  filterCriterias,
  addFilter,
  removeFilter,
}) => {
  if (!filterCriterias) {
    return (
      <div className="betach__filter-container">
        <Spinner label="Loading all filter criterias..." />
      </div>
    );
  }
  const filterArray: Array<{ filterName: string; filterValue: string }> = [];
  Object.keys(filters).forEach((k) => {
    if (!!filters[k])
      filterArray.push({ filterName: k, filterValue: filters[k] });
  });

  // const criteriaArray: Array<{
  //   criteriaName: string;
  //   criteriaValues: string[];
  // }> = [];
  // Object.keys(filterCriterias).forEach((c) => {
  //   criteriaArray.push({ criteriaName: c, criteriaValues: filterCriterias[c] });
  // });

  return (
    <div className="betach__filter-container">
      <div>
        {filterArray.length !== 0 && (
          <>
            <div className="betach__active-filter-group">
              {filterArray.map((f) => (
                <div
                  key={f.filterName + f.filterValue}
                  className="betach__active-filter"
                >
                  <CommandBarButton
                    iconProps={{ iconName: "SkypeCircleMinus" }}
                    text={f.filterValue}
                    style={{
                      height: "30px",
                      width: "200px",
                      fontSize: "0.8rem",
                    }}
                    onClick={() => removeFilter(f.filterName)}
                  />
                </div>
              ))}
            </div>

            <hr className="betach__horizontal-divider" />
          </>
        )}
        {!filterCriterias ? (
          <div className="betach__filter-container">
            <Spinner label="Loading all filter criterias..." />
          </div>
        ) : (
          <div className="betach__active-filter-group">
            <>
              {!filters["wc_category1"] &&
                Object.keys(filterCriterias.wc_category1).map((k) => (
                  <div key={k} className="betach__active-filter">
                    <DefaultButton
                      text={k}
                      style={{
                        height: "30px",
                        width: "100%",
                        fontSize: "0.8rem",
                      }}
                      onClick={() => addFilter("wc_category1", k)}
                    />
                  </div>
                ))}
              {!filters["wc_category2"] &&
                filters["wc_category1"] &&
                filterCriterias.wc_category1["wc_category1"].map((k) => (
                  <div key={k} className="betach__active-filter">
                    <DefaultButton
                      text={k}
                      style={{
                        height: "30px",
                        width: "100%",
                        fontSize: "0.8rem",
                      }}
                      onClick={() => addFilter("wc_category2", k)}
                    />
                  </div>
                ))}
              {!filters["wc_category3"] &&
                filters["wc_category2"] &&
                filterCriterias.wc_category2[filters["wc_category2"]].map(
                  (k) => (
                    <div key={k} className="betach__active-filter">
                      <DefaultButton
                        text={k}
                        style={{
                          height: "30px",
                          width: "100%",
                          fontSize: "0.8rem",
                        }}
                        onClick={() => addFilter("wc_category3", k)}
                      />
                    </div>
                  )
                )}
              {!filters["wc_category4"] &&
                filters["wc_category3"] &&
                filterCriterias.wc_category3[filters["wc_category3"]].map(
                  (k) => (
                    <div key={k} className="betach__active-filter">
                      <DefaultButton
                        text={k}
                        style={{
                          height: "30px",
                          width: "100%",
                          fontSize: "0.8rem",
                        }}
                        onClick={() => addFilter("wc_category4", k)}
                      />
                    </div>
                  )
                )}
              {!filters["wc_category5"] &&
                filters["wc_category4"] &&
                filterCriterias.wc_category4[filters["wc_category4"]].map(
                  (k) => (
                    <div key={k} className="betach__active-filter">
                      <DefaultButton
                        text={k}
                        style={{
                          height: "30px",
                          width: "100%",
                          fontSize: "0.8rem",
                        }}
                        onClick={() => addFilter("wc_category5", k)}
                      />
                    </div>
                  )
                )}
            </>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(FilterComponent);
