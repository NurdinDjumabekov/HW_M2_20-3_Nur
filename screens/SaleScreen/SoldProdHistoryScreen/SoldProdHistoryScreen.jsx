//// hooks
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

//// tags
import { FlatList, RefreshControl } from "react-native";
import { Text, View } from "react-native";

//// redux
import { getListSoldProd } from "../../../store/reducers/requestSlice";

//// helpers
import { formatCount, sumSoputkaProds } from "../../../helpers/amounts";

/////components
import ResultCounts from "../../../common/ResultCounts/ResultCounts";

//// style
import styles from "./style";

export const SoldProdHistoryScreen = ({ navigation, route }) => {
  //// история каждой накладной продажи, история продаж
  const dispatch = useDispatch();
  const { guidInvoice } = route.params;

  const { preloader, listSoldProd } = useSelector(
    (state) => state.requestSlice
  );

  useEffect(() => {
    navigation.setOptions({ title: `${listSoldProd?.[0]?.date}` });
  }, [listSoldProd?.[0]?.date]);

  const getData = () => dispatch(getListSoldProd(guidInvoice));

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.historyParent}>
          <FlatList
            data={listSoldProd}
            renderItem={({ item, index }) => (
              <View style={styles.EveryInner}>
                <View style={styles.mainData}>
                  <View style={styles.mainDataInner}>
                    <Text style={styles.titleNum}>{index + 1}</Text>
                    <Text style={styles.sum}>
                      {item?.sale_price} сом х {item?.count} {item?.unit} ={" "}
                      {formatCount(item?.total_soputka)} сом
                    </Text>
                  </View>
                </View>
                <Text style={styles.title}>{item?.product_name}</Text>
              </View>
            )}
            keyExtractor={(item, index) => `${item.guid}${index}`}
            refreshControl={
              <RefreshControl refreshing={preloader} onRefresh={getData} />
            }
          />
        </View>
        <ResultCounts list={listSoldProd} />
        <Text style={styles.totalItemSumm}>
          Сумма: {sumSoputkaProds(listSoldProd)} сом
        </Text>
      </View>
    </>
  );
};