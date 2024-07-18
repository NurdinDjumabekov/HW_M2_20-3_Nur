///hooks
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

///tags
import { FlatList, SafeAreaView } from "react-native";
import { Text, TouchableOpacity, View } from "react-native";

/////components
import SearchProdsSale from "../../../components/SaleProd/SearchProdsSale/SearchProdsSale";
import EveryProduct from "../../../components/SaleProd/EveryProduct/EveryProduct";

////fns
import { clearListProdSearch } from "../../../store/reducers/requestSlice";

////style
import styles from "./style";

const SaleSearchScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const { infoKassa } = route.params;

  const { listProdSearch } = useSelector((state) => state.requestSlice);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <SearchProdsSale />,
      ///// только для продажи
    });

    return () => dispatch(clearListProdSearch());
  }, []);

  const emptyDataProd = listProdSearch?.length === 0;

  const listProdSale = () => {
    navigation.navigate("SoldProductScreen", { invoice_guid: infoKassa?.guid });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.parentBlock}>
        <TouchableOpacity onPress={listProdSale} style={styles.arrow}>
          <Text style={styles.textBtn}>Список выбранных товаров</Text>
          <View style={styles.arrowInner}></View>
        </TouchableOpacity>
        {emptyDataProd ? (
          <Text style={styles.noneData}>Список пустой</Text>
        ) : (
          <View style={styles.blockSelectProd}>
            <FlatList
              data={listProdSearch}
              renderItem={({ item, index }) => (
                <EveryProduct
                  obj={item}
                  index={index}
                  navigation={navigation}
                />
              )}
              keyExtractor={(item, index) => `${item?.guid}${index}`}
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
};

export default SaleSearchScreen;
