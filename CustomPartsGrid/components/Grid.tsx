import { Icon, IconButton, Stack } from "@fluentui/react";
import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";
import LookupInput from "./LookupInput";

interface IGridProps {
  columns: ComponentFramework.PropertyHelper.DataSetApi.Column[];
  records: Record<
    string,
    ComponentFramework.PropertyHelper.DataSetApi.EntityRecord
  >;
  sortedRecordIds: string[];
  itemsLoading: boolean;
  context: ComponentFramework.Context<IInputs>;
  refresh: () => void;
}

const Grid: React.FunctionComponent<IGridProps> = ({
  columns,
  records,
  sortedRecordIds,
  itemsLoading,
  context,
  refresh,
}) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const items = React.useMemo(() => {
    setIsLoading(false);
    return sortedRecordIds.map((id) => records[id]);
  }, [records, sortedRecordIds]);

  return (
    <Stack
      verticalFill
      grow
      tokens={{ childrenGap: 10 }}
      className="betach-parts__stack__container"
    >
      <div style={{ marginTop: "10px", paddingLeft: "10px" }}>
        <LookupInput entityName="product" context={context} />
      </div>
      {items.map((i) => (
        <Stack.Item
          key={i.getRecordId()}
          grow
          className="betach-parts__card__container"
        >
          <div className="betach-parts__card__header">
            <div style={{ flexGrow: 2 }}>
              <div className="betach-parts__card__sub-header">
                <strong>{i.getValue("name").toString()}</strong>

                <strong>
                  {!i.getValue("used")
                    ? ""
                    : (i.getValue("used").valueOf() as number) == 690970001
                    ? "Used"
                    : "Estimated"}{" "}
                </strong>
              </div>
              <div className="betach-parts__card__sub-header">
                <small>
                  QTY:{" "}
                  <strong>
                    {!i.getValue("used")
                      ? ""
                      : (i.getValue("used").valueOf() as number) == 690970001
                      ? (i.getValue("quantity") as number)
                      : (i.getValue("estimatedQuantity") as number) || "0"}
                  </strong>
                </small>
                <small>
                  TOTAL:{" "}
                  <strong>
                    $
                    {!i.getValue("used")
                      ? ""
                      : (i.getValue("used").valueOf() as number) == 690970001
                      ? (i.getValue("subtotal") as number)
                      : (i.getValue("estimatedSubtotal") as number) || "0"}
                  </strong>
                </small>
              </div>
            </div>
            <div className="betach-parts__card__header__icon-wrapper">
              <IconButton
                iconProps={{ iconName: "Edit" }}
                title="Edit"
                ariaLabel="Edit"
                onClick={() =>
                  context.navigation.openForm({
                    entityName: "msdyn_workorderproduct",
                    entityId: i.getRecordId(),
                    openInNewWindow: true,
                  })
                }
              />
            </div>
          </div>

          <div className="betach-parts__card__body">
            {i.getValue("description") && (
              <small>{i.getValue("description").valueOf() as string}</small>
            )}
            {i.getValue("note") && (
              <small>{i.getValue("note").valueOf() as string}</small>
            )}
          </div>
        </Stack.Item>
      ))}
    </Stack>
  );
};

export default Grid;
