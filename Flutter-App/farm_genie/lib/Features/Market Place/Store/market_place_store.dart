import 'package:farm_genie/Features/Market%20Place/model/product_model.dart';
import 'package:mobx/mobx.dart';
part 'market_place_store.g.dart';

class MarketPlace = _MarketPlaceStore with _$MarketPlace;

abstract class _MarketPlaceStore with Store {
  @observable
  bool isLoading = false;

  @observable
  ObservableList<ProductModel> list = ObservableList<ProductModel>();
}
