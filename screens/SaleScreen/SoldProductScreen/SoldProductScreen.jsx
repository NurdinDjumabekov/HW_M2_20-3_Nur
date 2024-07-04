////// hooks
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

////// tags
import { FlatList, Text, View } from "react-native";
import { TouchableOpacity, RefreshControl } from "react-native";
import { ViewButton } from "../../../customsTags/ViewButton";

/////// fns
import { getListSoldProd } from "../../../store/reducers/requestSlice";
import { endSaleProds } from "../../../store/reducers/requestSlice";
import { deleteSoldProd } from "../../../store/reducers/requestSlice";

////// components
import ConfirmationModal from "../../../common/ConfirmationModal/ConfirmationModal";

////// helpers
import { formatCount, sumSaleProds } from "../../../helpers/amounts";

////style
import styles from "./style";

export const SoldProductScreen = ({ route, navigation }) => {
  //// список проданных продуктов
  const dispatch = useDispatch();
  const { invoice_guid } = route.params;

  const [modalItemGuid, setModalItemGuid] = useState(null); // Состояние для идентификатора элемента, для которого открывается модальное окно
  const [modal, setModal] = useState(false); // для подтверждения завершения продажи

  const { preloader, listSoldProd } = useSelector(
    (state) => state.requestSlice
  );

  const getData = () => dispatch(getListSoldProd(invoice_guid));

  useEffect(() => {
    getData();
  }, []);

  const del = (product_guid) => {
    dispatch(deleteSoldProd({ product_guid, getData }));
    setModalItemGuid(null);
  };

  if (listSoldProd?.length === 0) {
    return <Text style={styles.noneData}>Список пустой</Text>;
  }

  const endSale = () => dispatch(endSaleProds({ invoice_guid, navigation }));

  return (
    <>
      <View style={styles.soldBlock}>
        <FlatList
          contentContainerStyle={styles.flatList}
          data={listSoldProd}
          renderItem={({ item, index }) => (
            <View style={styles.container}>
              <View style={styles.parentBlock}>
                <View style={styles.mainData}>
                  <Text style={styles.titleNum}>{index + 1} </Text>
                  <View>
                    <Text style={styles.titleDate}>{item.date || "..."}</Text>
                    <Text style={styles.totalPrice}>
                      {item?.product_price} сом х {item?.count} {item?.unit} ={" "}
                      {formatCount(item?.total)} сом
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.krest}
                  onPress={() => setModalItemGuid(item?.guid)}
                >
                  <View style={[styles.line, styles.deg]} />
                  <View style={[styles.line, styles.degMinus]} />
                </TouchableOpacity>
              </View>
              <View>
                <Text style={styles.title}>{item?.product_name}</Text>
              </View>
              <ConfirmationModal
                visible={modalItemGuid === item?.guid}
                message="Отменить продажу ?"
                onYes={() => del(item.guid)}
                onNo={() => setModalItemGuid(null)}
                onClose={() => setModalItemGuid(null)}
              />
            </View>
          )}
          keyExtractor={(item, index) => `${item.guid}${index}`}
          refreshControl={
            <RefreshControl refreshing={preloader} onRefresh={getData} />
          }
        />
        <View style={styles.actionBlock}>
          <Text style={styles.result}>
            Итого к оплате: {sumSaleProds(listSoldProd)}сом
          </Text>
          <View style={styles.actionBlockInner}>
            <ViewButton styles={styles.addCard} onclick={() => setModal(true)}>
              Бонусная карта
            </ViewButton>
            <ViewButton
              styles={styles.endSaleBtn}
              onclick={() => setModal(true)}
            >
              Завершить продажу
            </ViewButton>
          </View>
        </View>
      </View>
      <ConfirmationModal
        visible={modal}
        message="Отменить продажу ?"
        onYes={() => endSale()}
        onNo={() => setModal(false)}
        onClose={() => setModal(true)}
      />
    </>
  );
};
