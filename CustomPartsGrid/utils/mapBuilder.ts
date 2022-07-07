export const mapBuilder = (entities: ComponentFramework.WebApi.Entity[]) => {
  const map: { [key: string]: { [key: string]: string[] } } = {
    wc_category1: {},
    wc_category2: {},
    wc_category3: {},
    wc_category4: {},
    wc_category5: {},
  };
  for (let entity of entities) {
    if (entity.wc_category1) {
      if (!(entity.wc_category1 in map.wc_category1)) {
        map.wc_category1[entity.wc_category1] = [];
      }

      if (
        entity.wc_category2 &&
        !map.wc_category1[entity.wc_category1].includes(entity.wc_category2)
      ) {
        map.wc_category1[entity.wc_category1].push(entity.wc_category2);
      }
    }
    if (entity.wc_category2) {
      if (!(entity.wc_category2 in map.wc_category2)) {
        map.wc_category2[entity.wc_category2] = [];
      }

      if (
        entity.wc_category3 &&
        !map.wc_category2[entity.wc_category2].includes(entity.wc_category3)
      ) {
        map.wc_category2[entity.wc_category2].push(entity.wc_category3);
      }
    }
    if (entity.wc_category3) {
      if (!(entity.wc_category3 in map.wc_category3)) {
        map.wc_category3[entity.wc_category3] = [];
      }

      if (
        entity.wc_category4 &&
        !map.wc_category3[entity.wc_category3].includes(entity.wc_category4)
      ) {
        map.wc_category3[entity.wc_category3].push(entity.wc_category4);
      }
    }
    if (entity.wc_category4) {
      if (!(entity.wc_category4 in map.wc_category4)) {
        map.wc_category4[entity.wc_category4] = [];
      }

      if (
        entity.wc_category5 &&
        !map.wc_category4[entity.wc_category4].includes(entity.wc_category5)
      ) {
        map.wc_category4[entity.wc_category4].push(entity.wc_category5);
      }
    }
    // if (entity.wc_category5 && !(entity.wc_category5 in map.wc_category5)) {
    //     map.wc_category5[entity.wc_category5] = [];
    //     if (
    //       entity.wc_category5 &&
    //       !map.wc_category4[entity.wc_category4].includes(entity.wc_category5)
    //     ) {
    //       map.wc_category4[entity.wc_category4].push(entity.wc_category5);
    //     }
    //   }
  }

  return map;
};
