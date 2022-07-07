import { Spinner } from "@fluentui/react";
import * as React from "react";

interface IListComponentProps {
  items: ComponentFramework.WebApi.Entity[];
  onSelect: (item: any) => void;
  searching: boolean;
}

const ListComponent: React.FunctionComponent<IListComponentProps> = ({
  items,
  onSelect,
  searching,
}) => {
  if (searching) {
    return (
      <div className="betach__list-container">
        <Spinner label="Searching for items..." />
      </div>
    );
  }
  return (
    <div className="betach__list-container">
      {items.map((i) => (
        <div
          key={i.productid}
          className="betach__item-container"
          onClick={() =>
            onSelect({
              productnumber: i.productnumber,
              price: i.price,
              name: i.name,
              productid: i.productid,
              _defaultuomid_value: i["uom.uomid"],
              currentcost: i.currentcost,
              uomname: i["uom.name"],
              editable: !i.price || i.price === 0,
            })
          }
        >
          <div className="betach__item-header">
            <strong>{i.productnumber}</strong>
            <strong>
              ${i.price} / {i["uom.name"]}
            </strong>
          </div>
          <p>{i.name}</p>
        </div>
      ))}
    </div>
  );
};

export default React.memo(ListComponent);
