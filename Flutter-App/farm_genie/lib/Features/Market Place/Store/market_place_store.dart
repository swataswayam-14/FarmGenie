import 'package:farm_genie/Features/Market%20Place/model/product_model.dart';
import 'package:mobx/mobx.dart';

part 'market_place_store.g.dart';

class MarketPlaceStore = _MarketPlace with _$MarketPlaceStore;

abstract class _MarketPlace with Store {
  @observable
  bool isLoading = false;
  @observable
  bool isChatBotOpen = false;
  @observable
  ObservableList<ProductModel> list = ObservableList<ProductModel>();
}
