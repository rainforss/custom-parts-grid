import {
  DefaultButton,
  IconButton,
  ITextField,
  Modal,
  PrimaryButton,
  Spinner,
  TextField,
} from "@fluentui/react";
import { useBoolean } from "@uifabric/react-hooks";
import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";
import { mapBuilder } from "../utils/mapBuilder";
import FilterComponent from "./FilterComponent";
import ListComponent from "./ListComponent";

interface ILookupInputProps {
  entityName: string;
  context: ComponentFramework.Context<IInputs>;
}

const LookupInput: React.FunctionComponent<ILookupInputProps> = React.memo(
  ({ entityName, context }) => {
    const searchRef = React.useRef<ITextField | null>(null);
    const [items, setItems] = React.useState<
      ComponentFramework.WebApi.Entity[]
    >([]);

    const [criterias, setCriterias] = React.useState<{
      [key: string]: {
        [key: string]: string[];
      };
    }>();
    const [selectedItem, setSelectedItem] = React.useState<any>();

    const [error, setError] = React.useState();

    const [submitting, setSubmitting] = React.useState(false);

    const [searching, setSearching] = React.useState(false);

    const [filters, setFilters] = React.useState<{ [key: string]: string }>({
      wc_category1: "",
      wc_category2: "",
      wc_category3: "",
      wc_category4: "",
      wc_category5: "",
    });

    // const getAllItems = () => {
    //   const fetchXML = `?fetchXml=<fetch><entity name="product"><attribute name="price" /><attribute name="defaultuomid" /><attribute name="productid" /><attribute name="name" /><attribute name="wc_category1" /><attribute name="wc_category2" /><attribute name="wc_category3" /><attribute name="wc_category4" /><attribute name="wc_category5" /><attribute name="productnumber" /><link-entity name="uom" from="uomid" to="defaultuomid" link-type="outer" alias="uom"><attribute name="name" /><attribute name="uomid" /></link-entity></entity></fetch>`;
    //   context.webAPI
    //     .retrieveMultipleRecords(
    //       entityName,
    //       fetchXML
    //       // "?$select=productnumber,productid,name,price,_defaultuomid_value,currentcost&$expand=defaultuomid($select=name)" +
    //       //   (!!filterString ? `&$filter=${filterString}` : "")
    //     )
    //     .then(
    //       function success(result) {
    //         if (searchRef!.current!.value) {
    //           //   context.mode.setControlState(
    //           //     result.entities.filter((e) =>
    //           //       e.name.includes(searchRef.current?.value?.toUpperCase())
    //           //     )
    //           //   );
    //           setItems(() =>
    //             result.entities.filter((e) =>
    //               e.name.includes(searchRef.current?.value?.toUpperCase())
    //             )
    //           );
    //         } else {
    //           //   context.mode.setControlState(result.entities);
    //           setItems(() => result.entities);
    //         }
    //         setSearching(() => false);
    //       },
    //       function (error) {
    //         setSearching(() => false);
    //         setError(() => error.message);
    //       }
    //     );
    // };

    const getItems = (filters: { [key: string]: string }) => {
      setSearching(() => true);
      const filterArray: string[] = [];
      const fetchXMLFilterArray: string[] = [];
      Object.keys(filters).forEach((k) => {
        if (!!filters[k]) {
          filterArray.push(`${k} eq '${filters[k]}'`);
          fetchXMLFilterArray.push(
            `<condition attribute="${k}" operator="eq" value="${filters[k]}" />`
          );
        }
      });
      // if (searchRef!.current!.value) {
      //   filterArray.push(`contains(name,'${searchRef!.current!.value}')`);
      // }
      const filterString = filterArray.join(" and ");
      const fetchXMLFilterString = fetchXMLFilterArray.join("");
      const fetchXML = `?fetchXml=<fetch><entity name="product"><attribute name="price" /><attribute name="defaultuomid" /><attribute name="productid" /><attribute name="name" /><attribute name="productnumber" /><attribute name="wc_category1" /><attribute name="wc_category2" /><attribute name="wc_category3" /><attribute name="wc_category4" /><attribute name="wc_category5" /><filter type="and">${fetchXMLFilterString}</filter><link-entity name="uom" from="uomid" to="defaultuomid" link-type="outer" alias="uom"><attribute name="name" /><attribute name="uomid" /></link-entity></entity></fetch>`;

      context.webAPI
        .retrieveMultipleRecords(
          entityName,
          fetchXML
          // "?$select=productnumber,productid,name,price,_defaultuomid_value,currentcost&$expand=defaultuomid($select=name)" +
          //   (!!filterString ? `&$filter=${filterString}` : "")
        )
        .then(
          function success(result) {
            if (searchRef!.current!.value) {
              //   context.mode.setControlState(
              //     result.entities.filter((e) =>
              //       e.name.includes(searchRef.current?.value?.toUpperCase())
              //     )
              //   );
              setItems(() =>
                result.entities.filter((e) =>
                  e.name.includes(searchRef.current?.value?.toUpperCase())
                )
              );
            } else {
              //   context.mode.setControlState(result.entities);
              setItems(() => result.entities);
            }
            setSearching(() => false);
          },
          function (error) {
            setSearching(() => false);
            setError(() => error.message);
          }
        );
    };

    const addPart = (part: any) => {
      setSubmitting(true);
      context.webAPI
        .createRecord("msdyn_workorderproduct", {
          //Safe
          "msdyn_product@odata.bind": `/products(${part.productid})`,
          "msdyn_unit@odata.bind": `/uoms(${part._defaultuomid_value})`,
          msdyn_name: part.name,
          //Safe
          msdyn_linestatus: 690970001,
          //Safe
          msdyn_qtytobill: part.quantity,
          //Safe
          msdyn_unitcost: part.currentcost,
          // msdyn_totalcost: part.currentcost * part.quantity,
          msdyn_description: part.name,

          msdyn_internaldescription: part.name,
          //Safe
          msdyn_unitamount: part.price,
          msdyn_subtotal: part.price * part.quantity,
          msdyn_totalamount: part.price * part.quantity,
          //Safe
          "msdyn_workorder@odata.bind": `/msdyn_workorders(${
            (context.mode as any).contextInfo.entityId
          })`,
          //   "msdyn_booking@odata.bind": `/bookableresourcebookings(${
          //     (context.mode as any).contextInfo.entityId
          //   })`,
          msdyn_taxable: true,

          //Safe
          msdyn_quantity: part.quantity,
        })
        .then(
          function success(result) {
            context.webAPI
              .createRecord("wc_workordercharge", {
                "wc_WorkOrder@odata.bind": `/msdyn_workorders(${
                  (context.mode as any).contextInfo.entityId
                })`,
                "wc_Item@odata.bind": `/products(${part.productid})`,
                wc_name: part.name,
                wc_quantity: part.quantity,
                "wc_Unit@odata.bind": `/uoms(${part._defaultuomid_value})`,
                wc_priceperunit: part.price,
                wc_amount: part.price * part.quantity,
              })
              .then(
                function success(result) {
                  setSubmitting(false);
                  setSelectedItem(() => ({}));
                  hideDialog();
                  // hideModal();
                  context.parameters.workOrderProducts.refresh();
                },
                function (error) {
                  setError(() => error.message);
                  setSubmitting(false);
                }
              );
          },
          function (error) {
            setError(() => error.message);
            setSubmitting(false);
          }
        );
      // }
    };

    const getCriterias = () => {
      const fetchXML = `?fetchXml=<fetch><entity name="product"><attribute name="wc_category1" /><attribute name="wc_category2" /><attribute name="wc_category3" /><attribute name="wc_category4" /><attribute name="wc_category5" /></entity></fetch>`;

      context.webAPI.retrieveMultipleRecords(entityName, fetchXML).then(
        function success(result) {
          const criteriaMap = mapBuilder(result.entities);
          setCriterias(() => criteriaMap);
        },
        function (error) {
          setError(() => error.message);
          setSubmitting(false);
        }
      );
    };

    const modifyItem = (part: any) => {
      setSelectedItem(() => ({ ...part, quantity: 1 }));
      showDialog();
    };

    const cancelModify = () => {
      setSelectedItem(() => ({}));
      hideDialog();
    };

    const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] =
      useBoolean(false);

    const [isDialogOpen, { setTrue: showDialog, setFalse: hideDialog }] =
      useBoolean(false);

    const addFilter = (filterName: string, filterValue: string) => {
      setFilters((prev) => ({ ...prev, [filterName]: filterValue }));
    };

    const removeFilter = (filterName: string) => {
      switch (filterName) {
        case "wc_category1":
          return setFilters((prev) => ({
            wc_category1: "",
            wc_category2: "",
            wc_category3: "",
            wc_category4: "",
            wc_category5: "",
          }));
        case "wc_category2":
          return setFilters((prev) => ({
            ...prev,
            wc_category2: "",
            wc_category3: "",
            wc_category4: "",
            wc_category5: "",
          }));
        case "wc_category3":
          return setFilters((prev) => ({
            ...prev,
            wc_category3: "",
            wc_category4: "",
            wc_category5: "",
          }));
        case "wc_category4":
          return setFilters((prev) => ({
            ...prev,
            wc_category4: "",
            wc_category5: "",
          }));
        case "wc_category5":
          return setFilters((prev) => ({
            ...prev,
            wc_category5: "",
          }));
        default:
          return setFilters((prev) => ({ ...prev, [filterName]: "" }));
      }
    };

    React.useEffect(() => {
      if (isModalOpen) getCriterias();
    }, [isModalOpen]);

    return (
      <>
        <div style={{ display: "flex" }}>
          <PrimaryButton text="Add Parts" onClick={showModal} />
        </div>
        <Modal
          titleAriaId="betach-dialog"
          isOpen={isDialogOpen}
          onDismiss={hideDialog}
          isBlocking={false}
          containerClassName="betach__dialog-container"
          scrollableContentClassName="betach__modal-container--scrollable-content"
        >
          {selectedItem && (
            <div className="betach__selected-item-container">
              <div className="betach__item-header">
                <strong>{selectedItem.productnumber}</strong>
                <strong>
                  ${selectedItem.price} / {selectedItem.uomname}
                </strong>
              </div>
              <p>{selectedItem.name}</p>
              {selectedItem.editable && (
                <div className="betach__price-control">
                  <label htmlFor="price">Enter unit price</label>
                  <TextField
                    ariaLabel="Unit Price"
                    id="price"
                    name="price"
                    type="number"
                    min={0}
                    max={9999}
                    step={0.01}
                    value={selectedItem.price || 0}
                    required
                    iconProps={{ iconName: "CircleDollar" }}
                    onChange={(e) => {
                      // console.log(e.currentTarget.value);
                      setSelectedItem((prev: any) => ({
                        ...prev,
                        price: parseFloat((e.target as any).value),
                      }));
                    }}
                  />
                </div>
              )}
              <div className="betach__quantity-control">
                <IconButton
                  iconProps={{ iconName: "CalculatorSubtract" }}
                  onClick={() => {
                    if (selectedItem.quantity <= 1) {
                      return;
                    }
                    setSelectedItem((prev: any) => ({
                      ...prev,
                      quantity: prev.quantity - 1,
                    }));
                  }}
                />
                <TextField
                  ariaLabel="Quantity"
                  id="quantity"
                  name="quantity"
                  type="number"
                  min={0}
                  max={9999}
                  step={1}
                  value={selectedItem.quantity}
                  required
                  onChange={(e) => {
                    // console.log(e.currentTarget.value);
                    setSelectedItem((prev: any) => ({
                      ...prev,
                      quantity: parseInt((e.target as any).value),
                    }));
                  }}
                />
                <IconButton
                  iconProps={{ iconName: "Add" }}
                  onClick={() => {
                    setSelectedItem((prev: any) => ({
                      ...prev,
                      quantity: prev.quantity + 1,
                    }));
                  }}
                />
              </div>
              <div className="betach__quantity-control-button-group">
                <PrimaryButton
                  text="Confirm Adding"
                  onClick={() => addPart(selectedItem)}
                  disabled={submitting}
                />
                <DefaultButton
                  text="Cancel"
                  onClick={() => cancelModify()}
                  disabled={submitting}
                />
              </div>
              {submitting && (
                <Spinner label="Adding the part to work order..." />
              )}
              {error && <p>{error}</p>}
            </div>
          )}
        </Modal>
        <Modal
          titleAriaId="betach-modal"
          isOpen={isModalOpen}
          onDismiss={hideModal}
          isBlocking={false}
          containerClassName="betach__modal-container"
          scrollableContentClassName="betach__modal-container--scrollable-content"
        >
          <div className="betach__modal-header">
            <IconButton
              iconProps={{ iconName: "ChevronLeft" }}
              ariaLabel="Close popup modal"
              onClick={hideModal}
            />
            <div className="betach__search-field">
              <TextField
                className="betach__search-container"
                placeholder="Search"
                componentRef={searchRef}
              />
              <IconButton
                iconProps={{ iconName: "Search" }}
                ariaLabel="Search"
                onClick={() => {
                  getItems(filters);
                }}
              />
            </div>
          </div>
          <div className="betach__modal-body">
            <FilterComponent
              filters={filters}
              filterCriterias={criterias}
              addFilter={addFilter}
              removeFilter={removeFilter}
            />
            <ListComponent
              items={items}
              onSelect={modifyItem}
              searching={searching}
            />
          </div>
        </Modal>
      </>
    );
  }
);

export default React.memo(LookupInput);
